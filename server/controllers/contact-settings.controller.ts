import type { Request, Response } from "express";
import {
  ContactSettings,
  CONTACT_SETTINGS_KEY,
  type ContactSettingsDoc,
} from "../models/contact-settings.model";
import { AppError } from "../utils/appError";
import { DEFAULT_CONTACT_SETTINGS } from "../seed/contact-settings.seed";

function toDto(doc: ContactSettingsDoc) {
  return {
    email: doc.email,
    phone: doc.phone,
    whatsapp: doc.whatsapp,
    instagram: doc.instagram || DEFAULT_CONTACT_SETTINGS.instagram,
    linkedin: doc.linkedin || DEFAULT_CONTACT_SETTINGS.linkedin,
  };
}

function readString(body: object, key: string, max: number): string {
  if (!(key in body) || typeof body[key as keyof typeof body] !== "string") return "";
  return String(body[key as keyof typeof body]).trim().slice(0, max);
}

function normalizeUrl(value: string): string {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

function isUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

async function getOrThrow() {
  const settings = await ContactSettings.findOne({ key: CONTACT_SETTINGS_KEY });
  if (!settings) {
    throw new AppError(404, "Contact settings not found");
  }
  return settings;
}

export async function getContactSettings(_req: Request, res: Response) {
  const settings = await getOrThrow();
  res.json({ ok: true, settings: toDto(settings) });
}

export async function updateContactSettings(req: Request, res: Response) {
  if (!req.body || typeof req.body !== "object") {
    throw new AppError(400, "Invalid request");
  }

  const email = readString(req.body, "email", 160).toLowerCase();
  const phone = readString(req.body, "phone", 40);
  const whatsapp = readString(req.body, "whatsapp", 40);
  const instagram = normalizeUrl(readString(req.body, "instagram", 300));
  const linkedin = normalizeUrl(readString(req.body, "linkedin", 300));

  if (!email.includes("@")) throw new AppError(400, "Enter a valid email");
  if (phone.replace(/\D/g, "").length < 7) throw new AppError(400, "Enter a valid phone number");
  if (whatsapp.replace(/\D/g, "").length < 7) {
    throw new AppError(400, "Enter a valid WhatsApp number");
  }
  if (!isUrl(instagram)) throw new AppError(400, "Enter a valid Instagram URL");
  if (!isUrl(linkedin)) throw new AppError(400, "Enter a valid LinkedIn URL");

  const settings = await ContactSettings.findOneAndUpdate(
    { key: CONTACT_SETTINGS_KEY },
    { email, phone, whatsapp, instagram, linkedin },
    { returnDocument: "after", upsert: true },
  );

  if (!settings) {
    throw new AppError(500, "Could not save contact settings");
  }

  res.json({ ok: true, settings: toDto(settings) });
}
