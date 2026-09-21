import type { Request, Response } from "express";
import type { FilterQuery } from "mongoose";
import { Lead, LEAD_SOURCES, type LeadDoc, type LeadSource } from "../models/lead.model";
import { AppError } from "../utils/appError";
import { storeFileBuffer } from "../utils/store-file";
import { sendMail, thankYouEmailHtml } from "../utils/mail";
import { getCallNotifyEmail } from "../seed/call-settings.seed";
import { ContactSettings, CONTACT_SETTINGS_KEY } from "../models/contact-settings.model";
import { DEFAULT_CONTACT_SETTINGS } from "../seed/contact-settings.seed";

function readString(body: object, key: string, max: number): string {
  if (!(key in body) || typeof body[key as keyof typeof body] !== "string") return "";
  return String(body[key as keyof typeof body]).trim().slice(0, max);
}

function isLeadSource(value: string): value is LeadSource {
  return (LEAD_SOURCES as readonly string[]).includes(value);
}

function parseCreateBody(body: unknown) {
  if (!body || typeof body !== "object") {
    throw new AppError(400, "Invalid request");
  }

  const name = readString(body, "name", 80);
  const email = readString(body, "email", 160).toLowerCase();
  const phone = readString(body, "phone", 20);
  const message = readString(body, "message", 1200);
  const source = readString(body, "source", 20);
  const city = readString(body, "city", 80);
  const planning = readString(body, "planning", 80);
  const resource = readString(body, "resource", 160);
  const fileName = readString(body, "fileName", 200);

  if (name.length < 2) throw new AppError(400, "Please enter your name");
  if (!email.includes("@")) throw new AppError(400, "Please enter a valid email");
  if (!isLeadSource(source)) throw new AppError(400, "Invalid lead source");
  if (source !== "download" && phone.length < 7) {
    throw new AppError(400, "Please enter a valid phone number");
  }

  return { name, email, phone, message, source, city, planning, resource, fileName };
}

function toLeadDto(lead: LeadDoc & { _id: unknown }) {
  return {
    id: String(lead._id),
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    message: lead.message,
    source: lead.source,
    city: lead.city,
    planning: lead.planning,
    resource: lead.resource,
    fileName: lead.fileName ?? "",
    fileUrl: lead.fileUrl ?? "",
    createdAt: lead.createdAt.toISOString(),
  };
}

function parseDay(value: string, endOfDay: boolean): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return endOfDay
    ? new Date(year, month - 1, day, 23, 59, 59, 999)
    : new Date(year, month - 1, day, 0, 0, 0, 0);
}

function buildFilter(query: Request["query"]): FilterQuery<LeadDoc> {
  const filter: FilterQuery<LeadDoc> = {};
  const q = typeof query.q === "string" ? query.q.trim() : "";
  const source = typeof query.source === "string" ? query.source.trim() : "";
  const from = typeof query.from === "string" ? parseDay(query.from.trim(), false) : null;
  const to = typeof query.to === "string" ? parseDay(query.to.trim(), true) : null;

  if (q) {
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ name: rx }, { email: rx }, { phone: rx }, { message: rx }, { city: rx }];
  }

  if (isLeadSource(source)) {
    filter.source = source;
  }

  if (from || to) {
    filter.createdAt = {
      ...(from ? { $gte: from } : {}),
      ...(to ? { $lte: to } : {}),
    };
  }

  return filter;
}

function csvCell(value: unknown): string {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

async function sendLeadThankYou(lead: LeadDoc) {
  if (lead.source !== "project" || !lead.email.includes("@")) return;

  const contact = await ContactSettings.findOne({ key: CONTACT_SETTINGS_KEY });
  const studioEmail = contact?.email || DEFAULT_CONTACT_SETTINGS.email;
  const studioPhone = contact?.whatsapp || contact?.phone || DEFAULT_CONTACT_SETTINGS.whatsapp;
  const firstName = lead.name.trim().split(/\s+/)[0] || lead.name;

  const text = [
    `Hi ${firstName},`,
    "",
    "Thank you for getting in touch with Design Diaries.",
    "",
    "We have received your project enquiry. Sagrika will reply within 24 hours on working days.",
    "",
    "If you would like to talk sooner, WhatsApp is the fastest route:",
    studioPhone,
    "",
    "Design Diaries",
    studioEmail,
  ].join("\n");

  const sent = await sendMail({
    to: lead.email,
    replyTo: studioEmail,
    subject: "Thank you — we received your enquiry | Design Diaries",
    text,
    html: thankYouEmailHtml({ firstName, studioEmail, studioPhone }),
  });
  if (!sent) {
    console.error(`Thank-you email was not sent to ${lead.email}: Gmail SMTP is not configured`);
  }
}

function formatLeadDate(value: unknown): string {
  const date = value instanceof Date ? value : new Date(String(value ?? ""));
  if (Number.isNaN(date.getTime())) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${date.getFullYear()}`;
}

export async function createLead(req: Request, res: Response) {
  const payload = parseCreateBody(req.body);
  const file = req.file;
  let fileName = payload.fileName;
  let fileUrl = "";
  let filePublicId = "";

  if (file) {
    const stored = await storeFileBuffer(file.buffer, file.originalname, "lead-files", file.mimetype);
    fileName = file.originalname.trim().slice(0, 200) || payload.fileName;
    fileUrl = stored.fileUrl;
    filePublicId = stored.filePublicId;
  }

  const lead = await Lead.create({ ...payload, fileName, fileUrl, filePublicId });
  res.status(201).json({ ok: true, lead: toLeadDto(lead) });
  void sendLeadEmails(lead);
}

async function sendLeadEmails(lead: LeadDoc) {
  try {
    const notifyEmail = await getCallNotifyEmail();
    const sourceLabel =
      lead.source === "project"
        ? "Start a project"
        : lead.source === "download"
          ? "Resource download"
          : lead.source === "contact"
            ? "Contact"
            : "Enquiry";
    await sendMail({
      to: notifyEmail,
      replyTo: lead.email,
      fromName: lead.name,
      subject: `New ${sourceLabel} · ${lead.name}`,
      text: [
        `A new ${sourceLabel.toLowerCase()} form was submitted.`,
        "",
        `Name: ${lead.name}`,
        `Email: ${lead.email}`,
        `Phone: ${lead.phone || "—"}`,
        `City: ${lead.city || "—"}`,
        lead.planning ? `Planning: ${lead.planning}` : "",
        lead.resource ? `Resource: ${lead.resource}` : "",
        lead.fileName || lead.fileUrl ? `File: ${lead.fileUrl || lead.fileName}` : "",
        lead.message ? `Details: ${lead.message}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    });
  } catch (err) {
    console.error("Lead notification email failed", err);
  }
  try {
    await sendLeadThankYou(lead);
  } catch (err) {
    console.error("Lead thank-you email failed", err);
  }
}

export async function listLeads(req: Request, res: Response) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50));
  const filter = buildFilter(req.query);

  const [items, total] = await Promise.all([
    Lead.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Lead.countDocuments(filter),
  ]);

  res.json({
    ok: true,
    leads: items.map((lead) => toLeadDto(lead)),
    total,
    page,
    limit,
  });
}

export async function exportLeads(req: Request, res: Response) {
  try {
    const filter = buildFilter(req.query);
    const items = await Lead.find(filter).sort({ createdAt: -1 }).lean();

    const header = ["Name", "Email", "Phone", "City", "Date", "Planning", "File", "Details", "Source"].map(csvCell).join(",");
    const rows = items.map((lead) => {
      const isProject = lead.source === "project";
      const extra = (value: string) => (isProject && value.trim() ? value : "—");
      return [
        csvCell(lead.name),
        csvCell(lead.email),
        csvCell(`\t${lead.phone ?? ""}`),
        csvCell(lead.city),
        csvCell(formatLeadDate(lead.createdAt)),
        csvCell(extra(lead.planning ?? "")),
        csvCell(extra(lead.fileUrl || lead.fileName || "")),
        csvCell(extra(lead.message ?? "")),
        csvCell(lead.source),
      ].join(",");
    });

    const csv = `\uFEFF${[header, ...rows].join("\r\n")}`;
    const from = typeof req.query.from === "string" ? req.query.from : "";
    const to = typeof req.query.to === "string" ? req.query.to : "";
    const stamp = from && to ? `${from}-to-${to}` : new Date().toISOString().slice(0, 10);

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="leads-${stamp}.csv"`);
    res.end(Buffer.from(csv, "utf8"));
  } catch (err) {
    console.error("exportLeads failed:", err);
    throw err;
  }
}
