import type { Request, Response } from "express";
import mongoose from "mongoose";
import { Recognition, type RecognitionDoc, type RecognitionImageDoc } from "../models/recognition.model";
import { AppError } from "../utils/appError";
import { removeStoredImage, storeImageBuffer, storeMediaBuffer } from "../utils/store-image";

const FOLDER = "recognition";
const DEFAULT_LINK = "/about#recognition";

function filesOf(req: Request, field: string) {
  const files = req.files;
  if (!files) return [];
  if (Array.isArray(files)) return files.filter((file) => file.fieldname === field);
  const match = (files as Record<string, Express.Multer.File[] | Express.Multer.File | undefined>)[field];
  if (!match) return [];
  return Array.isArray(match) ? match : [match];
}

function toDto(doc: RecognitionDoc & { _id: unknown }, admin = false) {
  return {
    id: String(doc._id),
    title: doc.title,
    category: doc.category,
    year: doc.year,
    description: doc.description || "",
    link: doc.link || DEFAULT_LINK,
    imageUrl: doc.imageUrl,
    images: doc.images.map((image) => ({
      url: image.url,
      kind: image.kind === "video" ? "video" : "image",
      ...(admin ? { publicId: image.publicId } : {}),
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

function parseFields(source: object, required: boolean) {
  const title = readField(source, "title", 160);
  const category = readField(source, "category", 80);
  const year = readField(source, "year", 20);
  const description = readField(source, "description", 400);
  const link = readField(source, "link", 300) || DEFAULT_LINK;

  if (required || "title" in source) {
    if (title.length < 2) throw new AppError(400, "Enter the recognition title");
  }
  if (required || "category" in source) {
    if (category.length < 2) throw new AppError(400, "Enter the category");
  }

  return { title, category, year, description, link };
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

function getId(req: Request) {
  const id = req.params.id;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) throw new AppError(400, "Invalid recognition");
  return id;
}

async function findOrThrow(id: string) {
  const doc = await Recognition.findById(id);
  if (!doc) throw new AppError(404, "Recognition not found");
  return doc;
}

async function compactSortOrder() {
  const docs = await Recognition.find().sort({ sortOrder: 1, createdAt: 1 });
  await Promise.all(
    docs.map((doc, index) => {
      const order = index + 1;
      if (doc.sortOrder === order) return Promise.resolve();
      return Recognition.updateOne({ _id: doc._id }, { $set: { sortOrder: order } });
    }),
  );
}

function slugName(title: string, year: string) {
  const slug = `${title} ${year}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return slug || "recognition";
}

async function uploadExtras(files: Express.Multer.File[], base: string): Promise<RecognitionImageDoc[]> {
  const extras: RecognitionImageDoc[] = [];
  for (const [index, file] of files.entries()) {
    const uploaded = await storeMediaBuffer(file.buffer, `${base}-${index + 1}`, FOLDER, file.mimetype);
    extras.push({ url: uploaded.imageUrl, publicId: uploaded.imagePublicId, kind: uploaded.kind });
  }
  return extras;
}

export async function listRecognitions(req: Request, res: Response) {
  const docs = await Recognition.find().sort({ sortOrder: 1, createdAt: 1 });
  res.json({ ok: true, items: docs.map((doc) => toDto(doc, Boolean(req.admin))) });
}

export async function getRecognition(req: Request, res: Response) {
  const doc = await findOrThrow(getId(req));
  res.json({ ok: true, item: toDto(doc, Boolean(req.admin)) });
}

export async function createRecognition(req: Request, res: Response) {
  const fields = parseFields(req.body ?? {}, true);
  const imageFile = filesOf(req, "image")[0];
  if (!imageFile?.buffer) throw new AppError(400, "Please upload a recognition photo");

  const base = slugName(fields.title, fields.year);
  const main = await storeImageBuffer(imageFile.buffer, base, FOLDER, imageFile.mimetype);
  const images = await uploadExtras(filesOf(req, "images"), base);

  await Recognition.updateMany({}, { $inc: { sortOrder: 1 } });
  const doc = await Recognition.create({
    ...fields,
    imageUrl: main.imageUrl,
    imagePublicId: main.imagePublicId,
    images,
    sortOrder: 1,
  });

  res.status(201).json({ ok: true, item: toDto(doc, true) });
}

export async function updateRecognition(req: Request, res: Response) {
  const doc = await findOrThrow(getId(req));
  const fields = parseFields(req.body ?? {}, false);
  const base = slugName(fields.title || doc.title, fields.year || doc.year);

  const previousImageUrl = doc.imageUrl;
  const previousImageId = doc.imagePublicId;
  const previousImages = [...doc.images];
  const imageFile = filesOf(req, "image")[0];

  let imageUrl = doc.imageUrl;
  let imagePublicId = doc.imagePublicId;
  if (imageFile?.buffer) {
    const uploaded = await storeImageBuffer(imageFile.buffer, `${base}-main`, FOLDER, imageFile.mimetype);
    imageUrl = uploaded.imageUrl;
    imagePublicId = uploaded.imagePublicId;
  } else {
    const requestedMain = readField(req.body ?? {}, "imageUrl", 2000);
    if (requestedMain && requestedMain !== doc.imageUrl) {
      const fromExtra = previousImages.find((image) => image.url === requestedMain);
      if (!fromExtra) throw new AppError(400, "Main photo was not found in this card");
      if (fromExtra.kind === "video") throw new AppError(400, "Main photo must be an image, not a video");
      imageUrl = fromExtra.url;
      imagePublicId = fromExtra.publicId;
    }
  }

  const extraOrder = parseExtraOrder(req.body ?? {});
  const newExtras = filesOf(req, "images");
  let images = previousImages;

  if (extraOrder) {
    const nextImages: RecognitionImageDoc[] = [];
    let fileIndex = 0;
    for (const token of extraOrder) {
      if (token === imageUrl) continue;
      if (token === "__file__") {
        const file = newExtras[fileIndex++];
        if (!file?.buffer) continue;
        const uploaded = await storeMediaBuffer(file.buffer, `${base}-${nextImages.length + 1}`, FOLDER, file.mimetype);
        nextImages.push({ url: uploaded.imageUrl, publicId: uploaded.imagePublicId, kind: uploaded.kind });
        continue;
      }
      const existing = previousImages.find((image) => image.url === token);
      if (existing) {
        nextImages.push(existing);
        continue;
      }
      if (token === previousImageUrl && token !== imageUrl) {
        nextImages.push({ url: previousImageUrl, publicId: previousImageId, kind: "image" });
      }
    }
    images = nextImages;
  } else if (newExtras.length) {
    images = [...previousImages, ...(await uploadExtras(newExtras, base))].filter((image) => image.url !== imageUrl);
  }

  const updated = await Recognition.findByIdAndUpdate(
    doc._id,
    {
      $set: {
        title: fields.title || doc.title,
        category: fields.category || doc.category,
        year: "year" in (req.body ?? {}) ? fields.year : doc.year,
        description: "description" in (req.body ?? {}) ? fields.description : doc.description,
        link: "link" in (req.body ?? {}) ? fields.link : doc.link,
        imageUrl,
        imagePublicId,
        images,
      },
    },
    { new: true, runValidators: true },
  );
  if (!updated) throw new AppError(404, "Recognition not found");

  const remaining = new Set(updated.images.map((image) => image.url));
  remaining.add(updated.imageUrl);
  if (imageFile?.buffer && previousImageUrl !== updated.imageUrl && !remaining.has(previousImageUrl)) {
    await removeStoredImage(previousImageUrl, previousImageId, FOLDER).catch(() => undefined);
  }
  await Promise.all(
    previousImages
      .filter((image) => !remaining.has(image.url))
      .map((image) => removeStoredImage(image.url, image.publicId, FOLDER, image.kind).catch(() => undefined)),
  );

  res.json({ ok: true, item: toDto(updated, true) });
}

export async function deleteRecognition(req: Request, res: Response) {
  const doc = await findOrThrow(getId(req));
  await removeStoredImage(doc.imageUrl, doc.imagePublicId, FOLDER);
  await Promise.all(doc.images.map((image) => removeStoredImage(image.url, image.publicId, FOLDER, image.kind)));
  await doc.deleteOne();
  await compactSortOrder();
  res.json({ ok: true });
}

export async function reorderRecognitions(req: Request, res: Response) {
  const items = req.body?.items;
  if (!Array.isArray(items) || items.length === 0) throw new AppError(400, "Send the recognition order");

  const seen = new Set<string>();
  const orders = new Set<number>();
  const updates: { id: string; sortOrder: number }[] = [];

  for (const item of items) {
    if (!item || typeof item !== "object") throw new AppError(400, "Invalid order payload");
    const id = typeof item.id === "string" ? item.id : "";
    const sortOrder = Number(item.sortOrder);
    if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError(400, "Invalid recognition in order");
    if (!Number.isInteger(sortOrder) || sortOrder < 1) throw new AppError(400, "Invalid sort order");
    if (seen.has(id) || orders.has(sortOrder)) throw new AppError(400, "Duplicate values in the recognition order");
    seen.add(id);
    orders.add(sortOrder);
    updates.push({ id, sortOrder });
  }

  const existing = await Recognition.find({ _id: { $in: updates.map((item) => item.id) } });
  if (existing.length !== updates.length) throw new AppError(400, "One or more recognitions were not found");

  await Promise.all(
    updates.map((item) => Recognition.updateOne({ _id: item.id }, { $set: { sortOrder: item.sortOrder } })),
  );

  const docs = await Recognition.find().sort({ sortOrder: 1, createdAt: 1 });
  res.json({ ok: true, items: docs.map((doc) => toDto(doc, true)) });
}
