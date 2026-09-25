import type { Request, Response } from "express";
import { Admin } from "../models/admin.model";
import { AppError } from "../utils/appError";
import { hashPassword } from "../utils/password";

const MAX_ADMINS = 5;

function toDto(doc: { _id: unknown; email: string }) {
  return { id: String(doc._id), email: doc.email };
}

export async function listAdminAccounts(_req: Request, res: Response) {
  const docs = await Admin.find().sort({ createdAt: 1 }).limit(MAX_ADMINS);
  res.json({ ok: true, admins: docs.map(toDto), max: MAX_ADMINS });
}

export async function createAdminAccount(req: Request, res: Response) {
  const count = await Admin.countDocuments();
  if (count >= MAX_ADMINS) {
    throw new AppError(400, `You can have at most ${MAX_ADMINS} admin accounts`);
  }

  const body = req.body;
  if (!body || typeof body !== "object") throw new AppError(400, "Invalid request");

  const email =
    "email" in body && typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = "password" in body && typeof body.password === "string" ? body.password : "";

  if (!email || !email.includes("@")) throw new AppError(400, "Enter a valid email");
  if (!password || password.length < 6) throw new AppError(400, "Password must be at least 6 characters");

  const existing = await Admin.findOne({ email });
  if (existing) throw new AppError(400, "An admin with this email already exists");

  const passwordHash = await hashPassword(password);
  const doc = await Admin.create({ email, passwordHash });
  res.status(201).json({ ok: true, admin: toDto(doc) });
}

export async function updateAdminAccount(req: Request, res: Response) {
  const id = req.params.id;
  const doc = await Admin.findById(id);
  if (!doc) throw new AppError(404, "Admin not found");

  const body = req.body;
  if (!body || typeof body !== "object") throw new AppError(400, "Invalid request");

  if ("email" in body && typeof body.email === "string") {
    const email = body.email.trim().toLowerCase();
    if (!email || !email.includes("@")) throw new AppError(400, "Enter a valid email");
    const clash = await Admin.findOne({ email, _id: { $ne: doc._id } });
    if (clash) throw new AppError(400, "An admin with this email already exists");
    doc.email = email;
  }

  if ("password" in body && typeof body.password === "string" && body.password.length > 0) {
    if (body.password.length < 6) throw new AppError(400, "Password must be at least 6 characters");
    doc.passwordHash = await hashPassword(body.password);
  }

  await doc.save();
  res.json({ ok: true, admin: toDto(doc) });
}

export async function deleteAdminAccount(req: Request, res: Response) {
  const id = req.params.id;
  const count = await Admin.countDocuments();
  if (count <= 1) throw new AppError(400, "At least one admin account is required");

  const doc = await Admin.findById(id);
  if (!doc) throw new AppError(404, "Admin not found");

  if (req.admin?.id === String(doc._id)) {
    throw new AppError(400, "You cannot delete the account you are signed in with");
  }

  await doc.deleteOne();
  res.json({ ok: true });
}
