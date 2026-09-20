import type { Request, Response } from "express";
import { CallBooking, type CallBookingDoc } from "../models/call-booking.model";
import { CallSettings, CALL_SETTINGS_KEY } from "../models/call-settings.model";
import { AppError } from "../utils/appError";
import { sendMail, thankYouEmailHtml } from "../utils/mail";
import { getCallNotifyEmail, getCallNotifySettings } from "../seed/call-settings.seed";
import { ContactSettings, CONTACT_SETTINGS_KEY } from "../models/contact-settings.model";
import { DEFAULT_CONTACT_SETTINGS } from "../seed/contact-settings.seed";
import {
  CALL_SLOTS,
  CALL_TIMEZONE,
  bookingWindow,
  dateLabel,
  isCallSlotId,
  isDateInWindow,
  isSlotPast,
  slotKey,
} from "../lib/call-slots";

function readString(body: object, key: string, max: number): string {
  if (!(key in body) || typeof body[key as keyof typeof body] !== "string") return "";
  return String(body[key as keyof typeof body]).trim().slice(0, max);
}

function isDuplicate(err: unknown) {
  return Boolean(err && typeof err === "object" && "code" in err && (err as { code: number }).code === 11000);
}

function toDto(doc: CallBookingDoc & { _id: unknown }) {
  return {
    id: String(doc._id),
    date: doc.date,
    slot: doc.slot,
    name: doc.name,
    phone: doc.phone,
    email: doc.email || "",
    city: doc.city,
    message: doc.message,
    createdAt: doc.createdAt.toISOString(),
  };
}

export async function getCallAvailability(_req: Request, res: Response) {
  const window = bookingWindow();
  const docs = await CallBooking.find({
    date: { $gte: window.start, $lte: window.end },
  }).select("date slot");

  const booked = docs.map((doc) => slotKey(doc.date, doc.slot));
  const past = window.dates.flatMap((day) =>
    CALL_SLOTS.filter((slot) => isSlotPast(day.date, slot.id)).map((slot) => slotKey(day.date, slot.id)),
  );

  res.json({
    ok: true,
    timezone: CALL_TIMEZONE,
    dates: window.dates,
    slots: CALL_SLOTS.map((slot) => ({ id: slot.id, label: slot.label })),
    booked,
    past,
  });
}

export async function createCallBooking(req: Request, res: Response) {
  if (!req.body || typeof req.body !== "object") throw new AppError(400, "Invalid request");

  const date = readString(req.body, "date", 10);
  const slot = readString(req.body, "slot", 20);
  const name = readString(req.body, "name", 80);
  const phone = readString(req.body, "phone", 20);
  const email = readString(req.body, "email", 160).toLowerCase();
  const city = readString(req.body, "city", 80);
  const message = readString(req.body, "message", 400);

  if (!isDateInWindow(date)) throw new AppError(400, "Pick a date from the calendar");
  if (!isCallSlotId(slot)) throw new AppError(400, "Pick a call time");
  if (isSlotPast(date, slot)) throw new AppError(400, "This time has already passed");
  if (name.length < 2) throw new AppError(400, "Enter your full name");
  if (phone.length < 7) throw new AppError(400, "Enter a valid mobile number");
  if (!email.includes("@")) throw new AppError(400, "Enter a valid email");
  if (city.length < 2) throw new AppError(400, "Enter your city");

  try {
    const doc = await CallBooking.create({ date, slot, name, phone, email, city, message });
    const notifyEmail = await getCallNotifyEmail();
    const contact = await ContactSettings.findOne({ key: CONTACT_SETTINGS_KEY });
    const studioEmail = contact?.email || DEFAULT_CONTACT_SETTINGS.email;
    const studioPhone = contact?.whatsapp || contact?.phone || DEFAULT_CONTACT_SETTINGS.whatsapp;
    const firstName = name.trim().split(/\s+/)[0] || name;
    const when = `${dateLabel(date)} · ${slot}`;
    try {
      await sendMail({
        to: notifyEmail,
        replyTo: email,
        fromName: name,
        subject: `New discovery call · ${dateLabel(date)} · ${slot}`,
        text: [
          "A discovery call was booked.",
          "",
          `Date: ${dateLabel(date)}`,
          `Time: ${slot}`,
          `Name: ${name}`,
          `Email: ${email}`,
          `Mobile: ${phone}`,
          `City: ${city}`,
          `Message: ${message}`,
        ].join("\n"),
      });
    } catch (err) {
      console.error("Call booking email failed", err);
    }
    try {
      const body = `Thank you for booking a discovery call with Design Diaries. Your call is confirmed for ${when}. Keep this time free — Sagrika will join you on the call.`;
      const sent = await sendMail({
        to: email,
        replyTo: studioEmail,
        subject: `Your call is booked · ${when} | Design Diaries`,
        text: [`Hi ${firstName},`, "", body, "", "Design Diaries", studioEmail, studioPhone].join("\n"),
        html: thankYouEmailHtml({
          firstName,
          studioEmail,
          studioPhone,
          title: "Call booked",
          body,
        }),
      });
      if (!sent) {
        console.error(`Call thank-you email was not sent to ${email}: Gmail SMTP is not configured`);
      }
    } catch (err) {
      console.error("Call thank-you email failed", err);
    }
    res.status(201).json({ ok: true, booking: toDto(doc) });
  } catch (err) {
    if (isDuplicate(err)) throw new AppError(409, "This time is no longer available");
    throw err;
  }
}

function toSettingsDto(email: string, accessKey: string) {
  return { email, accessKey };
}

export async function getCallSettings(_req: Request, res: Response) {
  const settings = await getCallNotifySettings();
  res.json({ ok: true, settings: toSettingsDto(settings.email, settings.accessKey) });
}

export async function updateCallSettings(req: Request, res: Response) {
  if (!req.body || typeof req.body !== "object") throw new AppError(400, "Invalid request");
  const email = readString(req.body, "email", 160).toLowerCase();
  const accessKey = readString(req.body, "accessKey", 120);
  if (!email.includes("@")) throw new AppError(400, "Enter a valid email");
  if (!accessKey) throw new AppError(400, "Paste the Web3Forms access key");

  const doc = await CallSettings.findOneAndUpdate(
    { key: CALL_SETTINGS_KEY },
    { $set: { email, accessKey }, $setOnInsert: { key: CALL_SETTINGS_KEY } },
    { new: true, upsert: true, returnDocument: "after" },
  );
  res.json({ ok: true, settings: toSettingsDto(doc?.email || email, doc?.accessKey || accessKey) });
}

export async function listCallBookings(req: Request, res: Response) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50));
  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
  const date = typeof req.query.date === "string" ? req.query.date.trim() : "";
  const filter: Record<string, unknown> = {};
  if (q) {
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ name: rx }, { phone: rx }, { email: rx }, { city: rx }];
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    filter.date = date;
  }

  const [items, total] = await Promise.all([
    CallBooking.find(filter)
      .sort({ date: 1, slot: 1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    CallBooking.countDocuments(filter),
  ]);

  res.json({
    ok: true,
    bookings: items.map((item) => toDto(item)),
    total,
    page,
    limit,
  });
}
