import type { Request, Response } from "express";
import mongoose from "mongoose";
import { Redirect, type RedirectDoc } from "../models/redirect.model";
import { AppError } from "../utils/appError";

const MAX_REDIRECTS = 50;
const BLOCKED_FROM = new Set(["/", ""]);

function toDto(doc: RedirectDoc & { _id: unknown }) {
  return {
    id: String(doc._id),
    from: doc.from,
    to: doc.to,
    enabled: Boolean(doc.enabled),
    updatedAt: doc.updatedAt?.toISOString?.() || undefined,
  };
}

function normalizeFrom(value: string) {
  const raw = value.trim();
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  const clean = path.replace(/\/+$/, "") || "/";
  if (!/^\/[A-Za-z0-9/_-]*$/.test(clean)) throw new AppError(400, "From path can only use letters, numbers, / and -");
  if (clean.includes("//") || clean.includes("*") || clean.includes("?")) {
    throw new AppError(400, "From path must be an exact URL path");
  }
  if (BLOCKED_FROM.has(clean) || clean.startsWith("/admin")) {
    throw new AppError(400, "Home and admin URLs cannot be redirected");
  }
  return clean;
}

function normalizeTo(value: string) {
  const raw = value.trim();
  if (/^https:\/\//i.test(raw)) {
    try {
      const url = new URL(raw);
      if (url.protocol !== "https:") throw new Error("https only");
      return url.toString();
    } catch {
      throw new AppError(400, "Enter a valid https URL");
    }
  }
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  if (!/^\/[A-Za-z0-9/_#?&=.-]*$/.test(path)) throw new AppError(400, "To path looks invalid");
  if (path.startsWith("/admin")) throw new AppError(400, "Do not redirect into admin");
  return path;
}

export async function listPublicRedirects(_req: Request, res: Response) {
  const docs = await Redirect.find({ enabled: true }).sort({ from: 1 }).limit(MAX_REDIRECTS);
  res.json({
    ok: true,
    redirects: docs.map((doc) => ({ from: doc.from, to: doc.to })),
  });
}

export async function listRedirects(_req: Request, res: Response) {
  const docs = await Redirect.find().sort({ from: 1 }).limit(MAX_REDIRECTS);
  res.json({ ok: true, redirects: docs.map((doc) => toDto(doc)) });
}

export async function createRedirect(req: Request, res: Response) {
  if (!req.body || typeof req.body !== "object") throw new AppError(400, "Invalid request");
  const count = await Redirect.countDocuments();
  if (count >= MAX_REDIRECTS) throw new AppError(400, "Redirect limit reached");

  const from = normalizeFrom(String(req.body.from || ""));
  const to = normalizeTo(String(req.body.to || ""));
  if (from === to) throw new AppError(400, "From and to cannot be the same");

  const exists = await Redirect.findOne({ from });
  if (exists) throw new AppError(400, "That from path already has a redirect");

  const doc = await Redirect.create({ from, to, enabled: req.body.enabled !== false });
  res.status(201).json({ ok: true, redirect: toDto(doc) });
}

export async function updateRedirect(req: Request, res: Response) {
  const id = req.params.id;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) throw new AppError(400, "Invalid redirect");
  const doc = await Redirect.findById(id);
  if (!doc) throw new AppError(404, "Redirect not found");
  if (!req.body || typeof req.body !== "object") throw new AppError(400, "Invalid request");

  if ("from" in req.body) doc.from = normalizeFrom(String(req.body.from || ""));
  if ("to" in req.body) doc.to = normalizeTo(String(req.body.to || ""));
  if ("enabled" in req.body) doc.enabled = req.body.enabled !== false;
  if (doc.from === doc.to) throw new AppError(400, "From and to cannot be the same");

  const clash = await Redirect.findOne({ from: doc.from, _id: { $ne: doc._id } });
  if (clash) throw new AppError(400, "That from path already has a redirect");

  await doc.save();
  res.json({ ok: true, redirect: toDto(doc) });
}

export async function deleteRedirect(req: Request, res: Response) {
  const id = req.params.id;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) throw new AppError(400, "Invalid redirect");
  const doc = await Redirect.findById(id);
  if (!doc) throw new AppError(404, "Redirect not found");
  await doc.deleteOne();
  res.json({ ok: true });
}
