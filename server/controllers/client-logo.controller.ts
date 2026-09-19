import type { Request, Response } from "express";
import mongoose from "mongoose";
import { ClientLogo, type ClientLogoDoc } from "../models/client-logo.model";
import { AppError } from "../utils/appError";
import { removeStoredImage, storeImageBuffer } from "../utils/store-image";

function toDto(doc: ClientLogoDoc & { _id: unknown }, admin = false) {
  return {
    id: String(doc._id),
    name: doc.name,
    imageUrl: doc.imageUrl,
    sortOrder: doc.sortOrder,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
    ...(admin ? { imagePublicId: doc.imagePublicId } : {}),
  };
}

function readName(source: object) {
  if (!("name" in source) || typeof source.name !== "string") return "";
  return source.name.trim().slice(0, 80);
}

function getId(req: Request) {
  const id = req.params.id;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid logo");
  }
  return id;
}

async function findOrThrow(id: string) {
  const doc = await ClientLogo.findById(id);
  if (!doc) throw new AppError(404, "Logo not found");
  return doc;
}

async function nextSortOrder() {
  const last = await ClientLogo.findOne().sort({ sortOrder: -1 }).select("sortOrder");
  return (last?.sortOrder ?? 0) + 1;
}

async function compactSortOrder() {
  const docs = await ClientLogo.find().sort({ sortOrder: 1, createdAt: 1 });
  await Promise.all(
    docs.map((doc, index) => {
      const order = index + 1;
      if (doc.sortOrder === order) return Promise.resolve();
      doc.sortOrder = order;
      return doc.save();
    }),
  );
}

export async function listClientLogos(req: Request, res: Response) {
  const docs = await ClientLogo.find().sort({ sortOrder: 1, createdAt: 1 });
  res.json({ ok: true, logos: docs.map((doc) => toDto(doc, Boolean(req.admin))) });
}

export async function getClientLogo(req: Request, res: Response) {
  const doc = await findOrThrow(getId(req));
  res.json({ ok: true, logo: toDto(doc, Boolean(req.admin)) });
}

export async function createClientLogo(req: Request, res: Response) {
  const name = readName(req.body ?? {});
  if (name.length < 2) throw new AppError(400, "Enter the company / partner name");
  if (!req.file?.buffer) throw new AppError(400, "Please upload a logo image");

  const uploaded = await storeImageBuffer(req.file.buffer, name, "client-logos", req.file.mimetype);
  const doc = await ClientLogo.create({
    name,
    imageUrl: uploaded.imageUrl,
    imagePublicId: uploaded.imagePublicId,
    sortOrder: await nextSortOrder(),
  });

  res.status(201).json({ ok: true, logo: toDto(doc, true) });
}

export async function updateClientLogo(req: Request, res: Response) {
  const doc = await findOrThrow(getId(req));
  const name = readName(req.body ?? {});
  if ("name" in (req.body ?? {}) && name.length < 2) {
    throw new AppError(400, "Enter the company / partner name");
  }
  if (name) doc.name = name;

  const previousPublicId = doc.imagePublicId;
  const previousUrl = doc.imageUrl;

  if (req.file?.buffer) {
    const uploaded = await storeImageBuffer(req.file.buffer, doc.name, "client-logos", req.file.mimetype);
    doc.imageUrl = uploaded.imageUrl;
    doc.imagePublicId = uploaded.imagePublicId;
  }

  await doc.save();

  if (req.file?.buffer && previousUrl && previousUrl !== doc.imageUrl) {
    const cleaned = await removeStoredImage(previousUrl, previousPublicId, "client-logos");
    if (!cleaned.ok) {
      res.json({
        ok: true,
        logo: toDto(doc, true),
        message: "Saved, but the previous logo could not be removed from storage.",
      });
      return;
    }
  }

  res.json({ ok: true, logo: toDto(doc, true) });
}

export async function deleteClientLogo(req: Request, res: Response) {
  const doc = await findOrThrow(getId(req));

  const cleaned = await removeStoredImage(doc.imageUrl, doc.imagePublicId, "client-logos");
  if (!cleaned.ok) {
    throw new AppError(502, "Could not delete the logo from storage. The record was not removed.");
  }

  await doc.deleteOne();
  await compactSortOrder();
  res.json({ ok: true });
}

export async function reorderClientLogos(req: Request, res: Response) {
  const items = req.body?.items;
  if (!Array.isArray(items) || items.length === 0) {
    throw new AppError(400, "Send the logo order");
  }

  const seen = new Set<string>();
  const orders = new Set<number>();
  const updates: { id: string; sortOrder: number }[] = [];

  for (const item of items) {
    if (!item || typeof item !== "object") throw new AppError(400, "Invalid order payload");
    const id = typeof item.id === "string" ? item.id : "";
    const sortOrder = Number(item.sortOrder);
    if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError(400, "Invalid logo in order");
    if (!Number.isInteger(sortOrder) || sortOrder < 1) throw new AppError(400, "Invalid sort order");
    if (seen.has(id) || orders.has(sortOrder)) {
      throw new AppError(400, "Duplicate values in the logo order");
    }
    seen.add(id);
    orders.add(sortOrder);
    updates.push({ id, sortOrder });
  }

  const existing = await ClientLogo.find({ _id: { $in: updates.map((item) => item.id) } });
  if (existing.length !== updates.length) {
    throw new AppError(400, "One or more logos were not found");
  }

  await Promise.all(
    updates.map((item) => ClientLogo.updateOne({ _id: item.id }, { $set: { sortOrder: item.sortOrder } })),
  );

  const docs = await ClientLogo.find().sort({ sortOrder: 1, createdAt: 1 });
  res.json({ ok: true, logos: docs.map((doc) => toDto(doc, true)) });
}
