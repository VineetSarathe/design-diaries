import type { Request, Response } from "express";
import {
  HomepageSettings,
  HOMEPAGE_SETTINGS_KEY,
  type HomepageSettingsDoc,
} from "../models/homepage-settings.model";
import { AppError } from "../utils/appError";
import { setPublicJsonCache } from "../utils/public-cache";
import { DEFAULT_HOMEPAGE_SETTINGS } from "../seed/homepage-settings.seed";

function toDto(doc: HomepageSettingsDoc) {
  return {
    heroHeading: doc.heroHeading || DEFAULT_HOMEPAGE_SETTINGS.heroHeading,
    heroDescription: doc.heroDescription || DEFAULT_HOMEPAGE_SETTINGS.heroDescription,
    ctaText: doc.ctaText || DEFAULT_HOMEPAGE_SETTINGS.ctaText,
    ctaLink: doc.ctaLink || DEFAULT_HOMEPAGE_SETTINGS.ctaLink,
    featuredProjectSlugs: Array.isArray(doc.featuredProjectSlugs)
      ? doc.featuredProjectSlugs
      : DEFAULT_HOMEPAGE_SETTINGS.featuredProjectSlugs,
    featuredBlogSlugs: Array.isArray(doc.featuredBlogSlugs)
      ? doc.featuredBlogSlugs
      : DEFAULT_HOMEPAGE_SETTINGS.featuredBlogSlugs,
  };
}

function readString(body: object, key: string, max: number): string {
  if (!(key in body) || typeof body[key as keyof typeof body] !== "string") return "";
  return String(body[key as keyof typeof body]).trim().slice(0, max);
}

function readSlugArray(body: object, key: string): string[] {
  const value = body[key as keyof typeof body];
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const slugs: string[] = [];
  for (const item of value) {
    if (typeof item !== "string") continue;
    const slug = item.trim().toLowerCase().slice(0, 80);
    if (!/^[a-z0-9-]+$/.test(slug) || seen.has(slug)) continue;
    seen.add(slug);
    slugs.push(slug);
    if (slugs.length >= 24) break;
  }
  return slugs;
}

function normalizeLink(value: string): string {
  if (!value) return "";
  if (/^https?:\/\//i.test(value) || value.startsWith("/")) return value;
  return `/${value}`;
}

function isLink(value: string): boolean {
  if (/^https?:\/\//i.test(value)) {
    try {
      const parsed = new URL(value);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  }
  return /^\/[A-Za-z0-9/_#?&=.-]*$/.test(value);
}

async function getOrThrow() {
  const settings = await HomepageSettings.findOne({ key: HOMEPAGE_SETTINGS_KEY });
  if (!settings) {
    throw new AppError(404, "Homepage settings not found");
  }
  return settings;
}

export async function getHomepageSettings(req: Request, res: Response) {
  const settings = await getOrThrow();
  setPublicJsonCache(res, req, 120);
  res.json({ ok: true, settings: toDto(settings) });
}

export async function updateHomepageSettings(req: Request, res: Response) {
  if (!req.body || typeof req.body !== "object") {
    throw new AppError(400, "Invalid request");
  }

  const heroHeading = readString(req.body, "heroHeading", 160);
  const heroDescription = readString(req.body, "heroDescription", 600);
  const ctaText = readString(req.body, "ctaText", 80);
  const ctaLink = normalizeLink(readString(req.body, "ctaLink", 300));
  const featuredProjectSlugs = readSlugArray(req.body, "featuredProjectSlugs");
  const featuredBlogSlugs = readSlugArray(req.body, "featuredBlogSlugs");

  if (heroHeading.length < 2) throw new AppError(400, "Enter a hero heading");
  if (heroDescription.length < 8) throw new AppError(400, "Enter a hero description");
  if (ctaText.length < 2) throw new AppError(400, "Enter CTA text");
  if (!isLink(ctaLink)) throw new AppError(400, "Enter a valid CTA link, e.g. /contact");

  const settings = await HomepageSettings.findOneAndUpdate(
    { key: HOMEPAGE_SETTINGS_KEY },
    {
      heroHeading,
      heroDescription,
      ctaText,
      ctaLink,
      featuredProjectSlugs,
      featuredBlogSlugs,
    },
    { returnDocument: "after", upsert: true },
  );

  if (!settings) {
    throw new AppError(500, "Could not save homepage settings");
  }

  res.json({ ok: true, settings: toDto(settings) });
}
