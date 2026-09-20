import type { Request, Response } from "express";
import { PAGE_SEO_PAGES, PAGE_SEO_KEY_SET } from "../lib/page-seo-pages";
import { PageSeo, type PageSeoDoc } from "../models/page-seo.model";
import { AppError } from "../utils/appError";
import { seedPageSeo } from "../seed/page-seo.seed";

function toDto(doc: PageSeoDoc) {
  return {
    key: doc.key,
    path: doc.path,
    seoTitle: doc.seoTitle || "",
    seoDescription: doc.seoDescription || "",
    seoKeywords: doc.seoKeywords || "",
    seoCanonical: doc.seoCanonical || "",
    updatedAt: doc.updatedAt?.toISOString?.() || undefined,
  };
}

function readField(body: object, key: string, max: number) {
  if (!(key in body) || typeof body[key as keyof typeof body] !== "string") return "";
  return String(body[key as keyof typeof body]).trim().slice(0, max);
}

async function ensurePages() {
  const count = await PageSeo.countDocuments();
  if (count < PAGE_SEO_PAGES.length) await seedPageSeo();
}

export async function listPageSeo(_req: Request, res: Response) {
  await ensurePages();
  const docs = await PageSeo.find().sort({ path: 1 });
  const byKey = new Map(docs.map((doc) => [doc.key, doc]));
  const pages = PAGE_SEO_PAGES.map((page) => {
    const doc = byKey.get(page.key);
    return doc
      ? toDto(doc)
      : { key: page.key, path: page.path, seoTitle: "", seoDescription: "", seoKeywords: "", seoCanonical: "" };
  });
  res.json({ ok: true, pages });
}

export async function updatePageSeo(req: Request, res: Response) {
  const key = String(req.params.key || "").trim();
  if (!PAGE_SEO_KEY_SET.has(key)) throw new AppError(400, "Unknown page");
  if (!req.body || typeof req.body !== "object") throw new AppError(400, "Invalid request");

  const page = PAGE_SEO_PAGES.find((item) => item.key === key);
  if (!page) throw new AppError(400, "Unknown page");

  const seoTitle = readField(req.body, "seoTitle", 160);
  const seoDescription = readField(req.body, "seoDescription", 320);
  const seoKeywords = readField(req.body, "seoKeywords", 400);
  const seoCanonical = readField(req.body, "seoCanonical", 300);

  const doc = await PageSeo.findOneAndUpdate(
    { key },
    { key, path: page.path, seoTitle, seoDescription, seoKeywords, seoCanonical },
    { upsert: true, returnDocument: "after", runValidators: true },
  );
  if (!doc) throw new AppError(500, "Could not save page SEO");
  res.json({ ok: true, page: toDto(doc) });
}
