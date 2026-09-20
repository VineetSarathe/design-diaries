import type { Request, Response } from "express";
import {
  ContactSettings,
  CONTACT_SETTINGS_KEY,
  type ContactSettingsDoc,
} from "../models/contact-settings.model";
import { AppError } from "../utils/appError";
import { DEFAULT_CONTACT_SETTINGS } from "../seed/contact-settings.seed";
import { sendMail, verifySmtp } from "../utils/mail";

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

function toMailDto(smtpUser: string, configured: boolean) {
  return { smtpUser, configured };
}

export async function getMailSettings(_req: Request, res: Response) {
  const settings = await ContactSettings.findOne({ key: CONTACT_SETTINGS_KEY }).select("+smtpPass");
  if (!settings) throw new AppError(404, "Contact settings not found");
  res.json({
    ok: true,
    settings: toMailDto(settings.smtpUser || settings.email, Boolean(settings.smtpUser && settings.smtpPass)),
  });
}

export async function updateMailSettings(req: Request, res: Response) {
  if (!req.body || typeof req.body !== "object") throw new AppError(400, "Invalid request");

  const smtpUser = readString(req.body, "smtpUser", 160).toLowerCase();
  const smtpPass = readString(req.body, "smtpPass", 80).replace(/\s/g, "");
  if (!smtpUser.includes("@")) throw new AppError(400, "Enter the Gmail used to send mail");

  const existing = await ContactSettings.findOne({ key: CONTACT_SETTINGS_KEY }).select("+smtpPass");
  if (!existing) throw new AppError(404, "Contact settings not found");

  const nextPass = smtpPass || existing.smtpPass;
  if (!nextPass) throw new AppError(400, "Paste the 16-character Gmail app password");

  try {
    await verifySmtp({
      host: "smtp.gmail.com",
      port: 587,
      user: smtpUser,
      pass: nextPass,
      from: smtpUser,
    });
  } catch {
    throw new AppError(
      400,
      "Gmail login failed. Use an App Password (16 characters), not the normal Gmail password. 2-Step Verification must be on.",
    );
  }

  existing.smtpUser = smtpUser;
  existing.smtpPass = nextPass;
  await existing.save();

  res.json({ ok: true, settings: toMailDto(smtpUser, true) });
}

export async function testMailSettings(_req: Request, res: Response) {
  const settings = await ContactSettings.findOne({ key: CONTACT_SETTINGS_KEY }).select("+smtpPass");
  if (!settings) throw new AppError(404, "Contact settings not found");
  const to = settings.smtpUser || settings.email;
  try {
    const sent = await sendMail({
      to,
      subject: "Test email | Design Diaries",
      text: "SMTP is working. Visitors will now receive a thank-you email after they submit Start a Project.",
    });
    if (!sent) throw new AppError(400, "Save Gmail SMTP first, then send a test");
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError(400, "Gmail could not send the test email. Check the app password.");
  }
  res.json({ ok: true, to });
}
