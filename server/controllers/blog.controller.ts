import type { Request, Response } from "express";
import mongoose from "mongoose";
import { Blog, type BlogDoc, type BlogPointDoc, type BlogSectionDoc } from "../models/blog.model";
import { AppError } from "../utils/appError";
import { removeStoredImage, storeImageBuffer } from "../utils/store-image";

const FOLDER = "blogs";
const FILE_TOKEN = "__file__";

function filesOf(req: Request, field: string) {
  const files = req.files;
  if (!files) return [];
  if (Array.isArray(files)) return files.filter((file) => file.fieldname === field);
  const match = (files as Record<string, Express.Multer.File[] | Express.Multer.File | undefined>)[field];
  if (!match) return [];
  return Array.isArray(match) ? match : [match];
}

function toPointDto(point: BlogPointDoc, admin: boolean) {
  return {
    heading: point.heading,
    text: point.text,
    imageUrl: point.imageUrl || "",
    ...(admin ? { imagePublicId: point.imagePublicId || "" } : {}),
  };
}

function toDto(doc: BlogDoc & { _id: unknown }, admin = false) {
  return {
    id: String(doc._id),
    slug: doc.slug,
    title: doc.title,
    category: doc.category,
    readTime: doc.readTime,
    excerpt: doc.excerpt,
    highlight: doc.highlight || "",
    imageAlt: doc.imageAlt || "",
    seoTitle: doc.seoTitle || "",
    seoDescription: doc.seoDescription || "",
    seoKeywords: doc.seoKeywords || "",
    seoCanonical: doc.seoCanonical || "",
    projectSlug: doc.projectSlug,
    imageUrl: doc.imageUrl,
    body: doc.body.map((section) => ({
      heading: section.heading,
      text: section.text,
      points: section.points.map((point) => toPointDto(point, admin)),
    })),
    sortOrder: doc.sortOrder,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
    ...(admin ? { imagePublicId: doc.imagePublicId } : {}),
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

function parseBody(source: object): BlogSectionDoc[] {
  const raw = readField(source, "body", 50000);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item === "object")
      .map((item) => {
        const heading = typeof item.heading === "string" ? item.heading.trim().slice(0, 160) : "";
        const text = typeof item.text === "string" ? item.text.trim().slice(0, 4000) : "";
        const points = Array.isArray(item.points)
          ? item.points
              .filter((point: unknown) => point && typeof point === "object")
              .map((point: { heading?: unknown; text?: unknown; image?: unknown; imageUrl?: unknown }) => {
                const imageToken =
                  typeof point.image === "string"
                    ? point.image.trim()
                    : typeof point.imageUrl === "string"
                      ? point.imageUrl.trim()
                      : "";
                return {
                  heading: typeof point.heading === "string" ? point.heading.trim().slice(0, 160) : "",
                  text: typeof point.text === "string" ? point.text.trim().slice(0, 2000) : "",
                  imageUrl: imageToken.slice(0, 500),
                  imagePublicId: "",
                };
              })
              .filter((point: BlogPointDoc) => point.heading || point.text)
          : [];
        return { heading, text, points };
      })
      .filter((section) => section.heading);
  } catch {
    throw new AppError(400, "Invalid article content");
  }
}

function collectPointImages(body: BlogSectionDoc[]) {
  return body.flatMap((section) =>
    section.points
      .filter((point) => point.imageUrl && point.imageUrl !== FILE_TOKEN)
      .map((point) => ({ url: point.imageUrl, publicId: point.imagePublicId || "" })),
  );
}

async function resolvePointImages(
  body: BlogSectionDoc[],
  files: Express.Multer.File[],
  slug: string,
  previous: BlogSectionDoc[] = [],
): Promise<BlogSectionDoc[]> {
  const previousPoints = previous.flatMap((section) => section.points);
  let fileIndex = 0;
  const next: BlogSectionDoc[] = [];

  for (const [sectionIndex, section] of body.entries()) {
    const points: BlogPointDoc[] = [];
    for (const [pointIndex, point] of section.points.entries()) {
      if (point.imageUrl === FILE_TOKEN) {
        const file = files[fileIndex++];
        if (!file?.buffer) {
          points.push({ ...point, imageUrl: "", imagePublicId: "" });
          continue;
        }
        const uploaded = await storeImageBuffer(
          file.buffer,
          `${slug}-point-${sectionIndex + 1}-${pointIndex + 1}`,
          FOLDER,
          file.mimetype,
        );
        points.push({
          heading: point.heading,
          text: point.text,
          imageUrl: uploaded.imageUrl,
          imagePublicId: uploaded.imagePublicId,
        });
        continue;
      }
      if (!point.imageUrl) {
        points.push({ heading: point.heading, text: point.text, imageUrl: "", imagePublicId: "" });
        continue;
      }
      const existing = previousPoints.find((item) => item.imageUrl === point.imageUrl);
      points.push({
        heading: point.heading,
        text: point.text,
        imageUrl: point.imageUrl,
        imagePublicId: existing?.imagePublicId || "",
      });
    }
    next.push({ heading: section.heading, text: section.text, points });
  }

  return next;
}

function parseFields(source: object, required: boolean) {
  const title = readField(source, "title", 160);
  const category = readField(source, "category", 80);
  const readTime = readField(source, "readTime", 40);
  const excerpt = readField(source, "excerpt", 600);
  const highlight = readField(source, "highlight", 400);
  const imageAlt = readField(source, "imageAlt", 200);
  const seoTitle = readField(source, "seoTitle", 160);
  const seoDescription = readField(source, "seoDescription", 320);
  const seoKeywords = readField(source, "seoKeywords", 400);
  const seoCanonical = readField(source, "seoCanonical", 300);
  const projectSlug = readField(source, "projectSlug", 80);
  const slug = slugify(readField(source, "slug", 80) || title);
  const body = parseBody(source);

  if (required || "title" in source) {
    if (title.length < 2) throw new AppError(400, "Enter the article title");
  }
  if (required || "category" in source) {
    if (category.length < 2) throw new AppError(400, "Enter the category");
  }
  if (required || "slug" in source || "title" in source) {
    if (slug.length < 2) throw new AppError(400, "Enter a valid article slug");
  }
  if (required && body.length < 1) throw new AppError(400, "Add at least one article section");

  return { title, category, readTime, excerpt, highlight, imageAlt, seoTitle, seoDescription, seoKeywords, seoCanonical, projectSlug, slug, body };
}

function getId(req: Request) {
  const id = req.params.id;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) throw new AppError(400, "Invalid article");
  return id;
}

async function findOrThrow(id: string) {
  const doc = await Blog.findById(id);
  if (!doc) throw new AppError(404, "Article not found");
  return doc;
}

async function compactSortOrder() {
  const docs = await Blog.find().sort({ sortOrder: 1, createdAt: 1 });
  await Promise.all(
    docs.map((doc, index) => {
      const order = index + 1;
      if (doc.sortOrder === order) return Promise.resolve();
      return Blog.updateOne({ _id: doc._id }, { $set: { sortOrder: order } });
    }),
  );
}

async function assertUniqueSlug(slug: string, ignoreId?: string) {
  const existing = await Blog.findOne({ slug });
  if (!existing) return;
  if (ignoreId && String(existing._id) === ignoreId) return;
  throw new AppError(400, "That article slug is already in use");
}

export async function listBlogs(req: Request, res: Response) {
  const docs = await Blog.find().sort({ sortOrder: 1, createdAt: 1 });
  res.json({ ok: true, posts: docs.map((doc) => toDto(doc, Boolean(req.admin))) });
}

export async function getBlog(req: Request, res: Response) {
  const slug = req.params.slug || req.params.id;
  if (!slug) throw new AppError(400, "Invalid article");
  const doc = mongoose.Types.ObjectId.isValid(slug) ? await Blog.findById(slug) : await Blog.findOne({ slug });
  if (!doc) throw new AppError(404, "Article not found");
  res.json({ ok: true, post: toDto(doc, Boolean(req.admin)) });
}

export async function createBlog(req: Request, res: Response) {
  const fields = parseFields(req.body ?? {}, true);
  await assertUniqueSlug(fields.slug);
  const cover = filesOf(req, "image")[0];
  if (!cover?.buffer) throw new AppError(400, "Please upload a cover image");

  const uploaded = await storeImageBuffer(cover.buffer, fields.slug, FOLDER, cover.mimetype);
  const body = await resolvePointImages(fields.body, filesOf(req, "pointImages"), fields.slug);
  await Blog.updateMany({}, { $inc: { sortOrder: 1 } });
  const doc = await Blog.create({
    ...fields,
    body,
    imageUrl: uploaded.imageUrl,
    imagePublicId: uploaded.imagePublicId,
    sortOrder: 1,
  });

  res.status(201).json({ ok: true, post: toDto(doc, true) });
}

export async function updateBlog(req: Request, res: Response) {
  const doc = await findOrThrow(getId(req));
  const fields = parseFields(req.body ?? {}, false);
  if (fields.slug && fields.slug !== doc.slug) await assertUniqueSlug(fields.slug, String(doc._id));

  const previousUrl = doc.imageUrl;
  const previousId = doc.imagePublicId;
  const previousBody = doc.body.map((section) => ({
    heading: section.heading,
    text: section.text,
    points: section.points.map((point) => ({ ...point })),
  }));
  let imageUrl = doc.imageUrl;
  let imagePublicId = doc.imagePublicId;
  const cover = filesOf(req, "image")[0];

  if (cover?.buffer) {
    const uploaded = await storeImageBuffer(cover.buffer, `${fields.slug || doc.slug}-cover`, FOLDER, cover.mimetype);
    imageUrl = uploaded.imageUrl;
    imagePublicId = uploaded.imagePublicId;
  }

  if ("body" in (req.body ?? {}) && fields.body.length < 1) {
    throw new AppError(400, "Add at least one article section");
  }

  const body =
    "body" in (req.body ?? {})
      ? await resolvePointImages(fields.body, filesOf(req, "pointImages"), fields.slug || doc.slug, previousBody)
      : doc.body;

  const updated = await Blog.findByIdAndUpdate(
    doc._id,
    {
      $set: {
        title: fields.title || doc.title,
        slug: fields.slug || doc.slug,
        category: fields.category || doc.category,
        readTime: "readTime" in (req.body ?? {}) ? fields.readTime : doc.readTime,
        excerpt: "excerpt" in (req.body ?? {}) ? fields.excerpt : doc.excerpt,
        highlight: "highlight" in (req.body ?? {}) ? fields.highlight : doc.highlight,
        imageAlt: "imageAlt" in (req.body ?? {}) ? fields.imageAlt : doc.imageAlt,
        seoTitle: "seoTitle" in (req.body ?? {}) ? fields.seoTitle : doc.seoTitle,
        seoDescription: "seoDescription" in (req.body ?? {}) ? fields.seoDescription : doc.seoDescription,
        seoKeywords: "seoKeywords" in (req.body ?? {}) ? fields.seoKeywords : doc.seoKeywords,
        seoCanonical: "seoCanonical" in (req.body ?? {}) ? fields.seoCanonical : doc.seoCanonical,
        projectSlug: "projectSlug" in (req.body ?? {}) ? fields.projectSlug : doc.projectSlug,
        body,
        imageUrl,
        imagePublicId,
      },
    },
    { new: true, runValidators: true },
  );
  if (!updated) throw new AppError(404, "Article not found");

  if (cover?.buffer && previousUrl !== updated.imageUrl) {
    await removeStoredImage(previousUrl, previousId, FOLDER).catch(() => undefined);
  }
  const remaining = new Set(collectPointImages(updated.body).map((image) => image.url));
  await Promise.all(
    collectPointImages(previousBody)
      .filter((image) => !remaining.has(image.url))
      .map((image) => removeStoredImage(image.url, image.publicId, FOLDER).catch(() => undefined)),
  );

  res.json({ ok: true, post: toDto(updated, true) });
}

export async function deleteBlog(req: Request, res: Response) {
  const doc = await findOrThrow(getId(req));
  await removeStoredImage(doc.imageUrl, doc.imagePublicId, FOLDER);
  await Promise.all(
    collectPointImages(doc.body).map((image) =>
      removeStoredImage(image.url, image.publicId, FOLDER).catch(() => undefined),
    ),
  );
  await doc.deleteOne();
  await compactSortOrder();
  res.json({ ok: true });
}

export async function reorderBlogs(req: Request, res: Response) {
  const items = req.body?.items;
  if (!Array.isArray(items) || items.length === 0) throw new AppError(400, "Send the article order");

  const seen = new Set<string>();
  const orders = new Set<number>();
  const updates: { id: string; sortOrder: number }[] = [];

  for (const item of items) {
    if (!item || typeof item !== "object") throw new AppError(400, "Invalid order payload");
    const id = typeof item.id === "string" ? item.id : "";
    const sortOrder = Number(item.sortOrder);
    if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError(400, "Invalid article in order");
    if (!Number.isInteger(sortOrder) || sortOrder < 1) throw new AppError(400, "Invalid sort order");
    if (seen.has(id) || orders.has(sortOrder)) throw new AppError(400, "Duplicate values in the article order");
    seen.add(id);
    orders.add(sortOrder);
    updates.push({ id, sortOrder });
  }

  const existing = await Blog.find({ _id: { $in: updates.map((item) => item.id) } });
  if (existing.length !== updates.length) throw new AppError(400, "One or more articles were not found");

  await Promise.all(updates.map((item) => Blog.updateOne({ _id: item.id }, { $set: { sortOrder: item.sortOrder } })));
  const docs = await Blog.find().sort({ sortOrder: 1, createdAt: 1 });
  res.json({ ok: true, posts: docs.map((doc) => toDto(doc, true)) });
}
