import type { Request, Response } from "express";
import mongoose from "mongoose";
import { InstagramFeed, type InstagramFeedDoc, type InstagramPlacement } from "../models/instagram-feed.model";
import { AppError } from "../utils/appError";
import { removeStoredImage, storeImageBuffer } from "../utils/store-image";

const FOLDER = "instagram";

function toDto(doc: InstagramFeedDoc & { _id: unknown }, admin = false) {
  return {
    id: String(doc._id),
    caption: doc.caption,
    link: doc.link,
    imageUrl: doc.imageUrl,
    placement: parsePlacement(doc.placement),
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
    .slice(0, 60) || "instagram";
}

function parseLink(value: string, required: boolean) {
  if (!value) {
    if (required) throw new AppError(400, "Enter the Instagram reel link");
    return "";
  }
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("bad");
    return url.toString();
  } catch {
    throw new AppError(400, "Enter a valid reel link, starting with https://");
  }
}

function parsePlacement(value: unknown): InstagramPlacement {
  if (value === "work" || value === "about" || value === "resources" || value === "services") return value;
  return "home";
}

function parseFields(source: object, required: boolean) {
  const caption = readField(source, "caption", 160);
  const link = parseLink(readField(source, "link", 500), required);
  const placement = parsePlacement(readField(source, "placement", 20));

  return { caption, link, placement };
}

function getId(req: Request) {
  const id = req.params.id;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) throw new AppError(400, "Invalid Instagram card");
  return id;
}

async function findOrThrow(id: string) {
  const doc = await InstagramFeed.findById(id);
  if (!doc) throw new AppError(404, "Instagram card not found");
  return doc;
}

async function compactSortOrder(placement: InstagramPlacement) {
  const docs = await InstagramFeed.find({ placement }).sort({ sortOrder: 1, createdAt: 1 });
  await Promise.all(
    docs.map((doc, index) => {
      const order = index + 1;
      if (doc.sortOrder === order) return Promise.resolve();
      return InstagramFeed.updateOne({ _id: doc._id }, { $set: { sortOrder: order } });
    }),
  );
}

export async function listInstagramFeed(req: Request, res: Response) {
  const placement = parsePlacement(req.query.placement);
  const docs = await InstagramFeed.find({ placement }).sort({ sortOrder: 1, createdAt: 1 });
  res.json({ ok: true, items: docs.map((doc) => toDto(doc, Boolean(req.admin))) });
}

export async function getInstagramFeedItem(req: Request, res: Response) {
  const doc = await findOrThrow(getId(req));
  res.json({ ok: true, item: toDto(doc, Boolean(req.admin)) });
}

export async function createInstagramFeed(req: Request, res: Response) {
  const fields = parseFields(req.body ?? {}, true);
  if (!req.file?.buffer) throw new AppError(400, "Please upload an image");

  const uploaded = await storeImageBuffer(req.file.buffer, slugify(fields.link || "instagram-reel"), FOLDER, req.file.mimetype);
  await InstagramFeed.updateMany({ placement: fields.placement }, { $inc: { sortOrder: 1 } });
  const doc = await InstagramFeed.create({
    ...fields,
    imageUrl: uploaded.imageUrl,
    imagePublicId: uploaded.imagePublicId,
    sortOrder: 1,
  });

  res.status(201).json({ ok: true, item: toDto(doc, true) });
}

export async function updateInstagramFeed(req: Request, res: Response) {
  const doc = await findOrThrow(getId(req));
  const fields = parseFields(req.body ?? {}, false);

  const previousUrl = doc.imageUrl;
  const previousId = doc.imagePublicId;
  let imageUrl = doc.imageUrl;
  let imagePublicId = doc.imagePublicId;

  if (req.file?.buffer) {
    const uploaded = await storeImageBuffer(
      req.file.buffer,
      `${slugify(fields.link || doc.link || "instagram-reel")}-cover`,
      FOLDER,
      req.file.mimetype,
    );
    imageUrl = uploaded.imageUrl;
    imagePublicId = uploaded.imagePublicId;
  }

  const updated = await InstagramFeed.findByIdAndUpdate(
    doc._id,
    {
      $set: {
        caption: "caption" in (req.body ?? {}) ? fields.caption : doc.caption,
        link: "link" in (req.body ?? {}) ? fields.link : doc.link,
        imageUrl,
        imagePublicId,
      },
    },
    { new: true, runValidators: true },
  );
  if (!updated) throw new AppError(404, "Instagram card not found");

  if (req.file?.buffer && previousUrl !== updated.imageUrl) {
    await removeStoredImage(previousUrl, previousId, FOLDER).catch(() => undefined);
  }

  res.json({ ok: true, item: toDto(updated, true) });
}

export async function deleteInstagramFeed(req: Request, res: Response) {
  const doc = await findOrThrow(getId(req));
  await removeStoredImage(doc.imageUrl, doc.imagePublicId, FOLDER);
  const placement = parsePlacement(doc.placement);
  await doc.deleteOne();
  await compactSortOrder(placement);
  res.json({ ok: true });
}

export async function reorderInstagramFeed(req: Request, res: Response) {
  const items = req.body?.items;
  if (!Array.isArray(items) || items.length === 0) throw new AppError(400, "Send the card order");

  const seen = new Set<string>();
  const orders = new Set<number>();
  const updates: { id: string; sortOrder: number }[] = [];

  for (const item of items) {
    if (!item || typeof item !== "object") throw new AppError(400, "Invalid order payload");
    const id = typeof item.id === "string" ? item.id : "";
    const sortOrder = Number(item.sortOrder);
    if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError(400, "Invalid card in order");
    if (!Number.isInteger(sortOrder) || sortOrder < 1) throw new AppError(400, "Invalid sort order");
    if (seen.has(id) || orders.has(sortOrder)) throw new AppError(400, "Duplicate values in the card order");
    seen.add(id);
    orders.add(sortOrder);
    updates.push({ id, sortOrder });
  }

  const existing = await InstagramFeed.find({ _id: { $in: updates.map((item) => item.id) } });
  if (existing.length !== updates.length) throw new AppError(400, "One or more cards were not found");

  await Promise.all(updates.map((item) => InstagramFeed.updateOne({ _id: item.id }, { $set: { sortOrder: item.sortOrder } })));
  const placement = parsePlacement(existing[0]?.placement);
  const docs = await InstagramFeed.find({ placement }).sort({ sortOrder: 1, createdAt: 1 });
  res.json({ ok: true, items: docs.map((doc) => toDto(doc, true)) });
}
