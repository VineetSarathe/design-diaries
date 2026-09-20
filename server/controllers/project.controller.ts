import type { Request, Response } from "express";
import mongoose from "mongoose";
import { HomepageSettings, HOMEPAGE_SETTINGS_KEY } from "../models/homepage-settings.model";
import { Project, type ProjectDoc, type ProjectImageDoc } from "../models/project.model";
import { AppError } from "../utils/appError";
import { removeStoredImage, storeImageBuffer, storeMediaBuffer } from "../utils/store-image";

const CATEGORIES = new Set(["Gym Projects", "Fitness Studios"]);

function filesOf(req: Request, field: string) {
  const files = req.files;
  if (!files) return [];
  if (Array.isArray(files)) return files.filter((file) => file.fieldname === field);
  const match = (files as Record<string, Express.Multer.File[] | Express.Multer.File | undefined>)[field];
  if (!match) return [];
  return Array.isArray(match) ? match : [match];
}

function toDto(doc: ProjectDoc & { _id: unknown }, admin = false) {
  return {
    id: String(doc._id),
    slug: doc.slug,
    name: doc.name,
    location: doc.location,
    category: doc.category,
    area: doc.area,
    year: doc.year,
    clientType: doc.clientType,
    cardLabel: doc.cardLabel,
    hideCardMeta: Boolean(doc.hideCardMeta),
    insight: doc.insight,
    cardUrl: doc.cardUrl,
    reviewQuote: doc.reviewQuote || "",
    reviewAuthor: doc.reviewAuthor || "",
    reviewRole: doc.reviewRole || "",
    seoTitle: doc.seoTitle || "",
    seoDescription: doc.seoDescription || "",
    seoKeywords: doc.seoKeywords || "",
    seoCanonical: doc.seoCanonical || "",
    images: doc.images.map((image) => ({
      url: image.url,
      alt: image.alt,
      caption: image.caption,
      kind: image.kind === "video" ? "video" : "image",
      ...(admin ? { publicId: image.publicId } : {}),
    })),
    sortOrder: doc.sortOrder,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
    ...(admin ? { cardPublicId: doc.cardPublicId } : {}),
  };
}

function readField(source: object, key: string, max: number) {
  if (!(key in source) || typeof source[key as keyof typeof source] !== "string") return "";
  return String(source[key as keyof typeof source]).trim().slice(0, max);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function parseBool(value: unknown, fallback: boolean) {
  if (value === true || value === "true" || value === "1") return true;
  if (value === false || value === "false" || value === "0") return false;
  return fallback;
}

function parseKeptImages(source: object): string[] | null {
  if (!("keptImages" in source) || typeof source.keptImages !== "string") return null;
  try {
    const parsed = JSON.parse(source.keptImages);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter((item): item is string => typeof item === "string" && item.length > 0);
  } catch {
    return null;
  }
}

function parseExtraOrder(source: object): string[] | null {
  if (!("extraOrder" in source) || typeof source.extraOrder !== "string") return null;
  try {
    const parsed = JSON.parse(source.extraOrder);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter((item): item is string => typeof item === "string" && item.length > 0);
  } catch {
    return null;
  }
}

function parseFields(source: object, required: boolean) {
  const name = readField(source, "name", 120);
  const location = readField(source, "location", 120);
  const category = readField(source, "category", 80) || "Gym Projects";
  const area = readField(source, "area", 40);
  const year = readField(source, "year", 20);
  const clientType = readField(source, "clientType", 80);
  const cardLabel = readField(source, "cardLabel", 80);
  const insight = readField(source, "insight", 600);
  const reviewQuote = readField(source, "reviewQuote", 1200);
  const reviewAuthor = readField(source, "reviewAuthor", 80);
  const reviewRole = readField(source, "reviewRole", 160);
  const seoTitle = readField(source, "seoTitle", 160);
  const seoDescription = readField(source, "seoDescription", 320);
  const seoKeywords = readField(source, "seoKeywords", 400);
  const seoCanonical = readField(source, "seoCanonical", 300);
  const hideCardMeta = parseBool((source as { hideCardMeta?: unknown }).hideCardMeta, true);
  let slug = slugify(readField(source, "slug", 80) || name);

  if (required || "name" in source) {
    if (name.length < 2) throw new AppError(400, "Enter the project name");
  }
  if (required || "insight" in source) {
    if (insight.length < 8) throw new AppError(400, "Enter the project description");
  }
  if (required || "slug" in source || "name" in source) {
    if (slug.length < 2) throw new AppError(400, "Enter a valid project slug");
  }
  if (!CATEGORIES.has(category) && category.length < 2) {
    throw new AppError(400, "Enter a category");
  }

  return {
    name,
    location,
    category,
    area,
    year,
    clientType,
    cardLabel,
    insight,
    reviewQuote,
    reviewAuthor,
    reviewRole,
    seoTitle,
    seoDescription,
    seoKeywords,
    seoCanonical,
    hideCardMeta,
    slug,
  };
}

function getId(req: Request) {
  const id = req.params.id;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) throw new AppError(400, "Invalid project");
  return id;
}

async function findOrThrow(id: string) {
  const doc = await Project.findById(id);
  if (!doc) throw new AppError(404, "Project not found");
  return doc;
}

async function nextSortOrder() {
  const last = await Project.findOne().sort({ sortOrder: -1 }).select("sortOrder");
  return (last?.sortOrder ?? 0) + 1;
}

async function compactSortOrder() {
  const docs = await Project.find().sort({ sortOrder: 1, createdAt: 1 });
  await Promise.all(
    docs.map((doc, index) => {
      const order = index + 1;
      if (doc.sortOrder === order) return Promise.resolve();
      doc.sortOrder = order;
      return doc.save();
    }),
  );
}

async function assertUniqueSlug(slug: string, ignoreId?: string) {
  const existing = await Project.findOne({ slug });
  if (!existing) return;
  if (ignoreId && String(existing._id) === ignoreId) return;
  throw new AppError(400, "That project slug is already in use");
}

async function uploadExtras(files: Express.Multer.File[], slug: string): Promise<ProjectImageDoc[]> {
  const extras: ProjectImageDoc[] = [];
  for (const [index, file] of files.entries()) {
    const uploaded = await storeMediaBuffer(file.buffer, `${slug}-${index + 1}`, "projects", file.mimetype);
    extras.push({
      url: uploaded.imageUrl,
      publicId: uploaded.imagePublicId,
      alt: "",
      caption: "",
      kind: uploaded.kind,
    });
  }
  return extras;
}

export async function listProjects(req: Request, res: Response) {
  const docs = await Project.find().sort({ sortOrder: 1, createdAt: 1 });
  res.json({ ok: true, projects: docs.map((doc) => toDto(doc, Boolean(req.admin))) });
}

export async function getProject(req: Request, res: Response) {
  const slug = req.params.slug || req.params.id;
  if (!slug) throw new AppError(400, "Invalid project");
  const doc = mongoose.Types.ObjectId.isValid(slug)
    ? await Project.findById(slug)
    : await Project.findOne({ slug });
  if (!doc) throw new AppError(404, "Project not found");
  res.json({ ok: true, project: toDto(doc, Boolean(req.admin)) });
}

export async function createProject(req: Request, res: Response) {
  const fields = parseFields(req.body ?? {}, true);
  await assertUniqueSlug(fields.slug);
  const cardFile = filesOf(req, "card")[0];
  if (!cardFile?.buffer) throw new AppError(400, "Please upload a project photo");

  const card = await storeImageBuffer(cardFile.buffer, fields.slug, "projects", cardFile.mimetype);
  const images = await uploadExtras(filesOf(req, "images"), fields.slug);

  const doc = await Project.create({
    ...fields,
    cardUrl: card.imageUrl,
    cardPublicId: card.imagePublicId,
    images,
    sortOrder: await nextSortOrder(),
  });

  res.status(201).json({ ok: true, project: toDto(doc, true) });
}

export async function updateProject(req: Request, res: Response) {
  const doc = await findOrThrow(getId(req));
  const fields = parseFields(req.body ?? {}, false);
  if (fields.slug && fields.slug !== doc.slug) await assertUniqueSlug(fields.slug, String(doc._id));

  Object.assign(doc, {
    ...(fields.name ? { name: fields.name } : {}),
    ...(fields.slug ? { slug: fields.slug } : {}),
    location: fields.location,
    category: fields.category,
    area: fields.area,
    year: fields.year,
    clientType: fields.clientType,
    cardLabel: fields.cardLabel,
    insight: fields.insight || doc.insight,
    reviewQuote: fields.reviewQuote,
    reviewAuthor: fields.reviewAuthor,
    reviewRole: fields.reviewRole,
    seoTitle: fields.seoTitle,
    seoDescription: fields.seoDescription,
    seoKeywords: fields.seoKeywords,
    seoCanonical: fields.seoCanonical,
    hideCardMeta: fields.hideCardMeta,
  });

  const previousCardId = doc.cardPublicId;
  const previousCardUrl = doc.cardUrl;
  const cardFile = filesOf(req, "card")[0];
  if (cardFile?.buffer) {
    const uploaded = await storeImageBuffer(cardFile.buffer, `${doc.slug}-card`, "projects", cardFile.mimetype);
    doc.cardUrl = uploaded.imageUrl;
    doc.cardPublicId = uploaded.imagePublicId;
  }

  const previousImages = [...doc.images];
  const extraOrder = parseExtraOrder(req.body ?? {});
  const newExtras = filesOf(req, "images");

  if (extraOrder) {
    const nextImages: ProjectImageDoc[] = [];
    let fileIndex = 0;
    for (const token of extraOrder) {
      if (token === "__file__") {
        const file = newExtras[fileIndex++];
        if (!file?.buffer) continue;
        const uploaded = await storeMediaBuffer(file.buffer, `${doc.slug}-${nextImages.length + 1}`, "projects", file.mimetype);
        nextImages.push({
          url: uploaded.imageUrl,
          publicId: uploaded.imagePublicId,
          alt: "",
          caption: "",
          kind: uploaded.kind,
        });
        continue;
      }
      const existing = previousImages.find((image) => image.url === token);
      if (existing) nextImages.push(existing);
    }
    doc.images = nextImages;
  } else {
    const kept = parseKeptImages(req.body ?? {});
    if (kept) doc.images = previousImages.filter((image) => kept.includes(image.url));
    const extras = await uploadExtras(newExtras, doc.slug);
    if (extras.length) doc.images = [...doc.images, ...extras];
  }

  const updated = await Project.findByIdAndUpdate(
    doc._id,
    {
      $set: {
        name: doc.name,
        slug: doc.slug,
        location: doc.location,
        category: doc.category,
        area: doc.area,
        year: doc.year,
        clientType: doc.clientType,
        cardLabel: doc.cardLabel,
        insight: doc.insight,
        reviewQuote: doc.reviewQuote,
        reviewAuthor: doc.reviewAuthor,
        reviewRole: doc.reviewRole,
        seoTitle: doc.seoTitle,
        seoDescription: doc.seoDescription,
        seoKeywords: doc.seoKeywords,
        seoCanonical: doc.seoCanonical,
        hideCardMeta: doc.hideCardMeta,
        cardUrl: doc.cardUrl,
        cardPublicId: doc.cardPublicId,
        images: doc.images,
      },
    },
    { new: true, runValidators: true },
  );
  if (!updated) throw new AppError(404, "Project not found");

  if (cardFile?.buffer && previousCardUrl !== updated.cardUrl) {
    await removeStoredImage(previousCardUrl, previousCardId, "projects").catch(() => undefined);
  }
  const remaining = new Set(updated.images.map((image) => image.url));
  await Promise.all(
    previousImages
      .filter((image) => !remaining.has(image.url))
      .map((image) => removeStoredImage(image.url, image.publicId, "projects", image.kind).catch(() => undefined)),
  );

  res.json({ ok: true, project: toDto(updated, true) });
}

export async function deleteProject(req: Request, res: Response) {
  const doc = await findOrThrow(getId(req));
  await removeStoredImage(doc.cardUrl, doc.cardPublicId, "projects");
  await Promise.all(doc.images.map((image) => removeStoredImage(image.url, image.publicId, "projects", image.kind)));
  const slug = doc.slug;
  await doc.deleteOne();
  await compactSortOrder();
  await HomepageSettings.updateOne(
    { key: HOMEPAGE_SETTINGS_KEY },
    { $pull: { featuredProjectSlugs: slug } },
  );
  res.json({ ok: true });
}

export async function reorderProjects(req: Request, res: Response) {
  const items = req.body?.items;
  if (!Array.isArray(items) || items.length === 0) throw new AppError(400, "Send the project order");

  const seen = new Set<string>();
  const orders = new Set<number>();
  const updates: { id: string; sortOrder: number }[] = [];

  for (const item of items) {
    if (!item || typeof item !== "object") throw new AppError(400, "Invalid order payload");
    const id = typeof item.id === "string" ? item.id : "";
    const sortOrder = Number(item.sortOrder);
    if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError(400, "Invalid project in order");
    if (!Number.isInteger(sortOrder) || sortOrder < 1) throw new AppError(400, "Invalid sort order");
    if (seen.has(id) || orders.has(sortOrder)) throw new AppError(400, "Duplicate values in the project order");
    seen.add(id);
    orders.add(sortOrder);
    updates.push({ id, sortOrder });
  }

  const existing = await Project.find({ _id: { $in: updates.map((item) => item.id) } });
  if (existing.length !== updates.length) throw new AppError(400, "One or more projects were not found");

  await Promise.all(
    updates.map((item) => Project.updateOne({ _id: item.id }, { $set: { sortOrder: item.sortOrder } })),
  );

  const docs = await Project.find().sort({ sortOrder: 1, createdAt: 1 });
  res.json({ ok: true, projects: docs.map((doc) => toDto(doc, true)) });
}
