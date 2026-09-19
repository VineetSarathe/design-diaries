import type { CookieOptions, Request, Response } from "express";
import { env } from "../config/env";
import { Admin } from "../models/admin.model";
import { AppError } from "../utils/appError";
import { verifyPassword } from "../utils/password";
import { signAdminToken } from "../utils/token";

function cookieOptions(): CookieOptions {
  const isProd = env.NODE_ENV === "production";
  return {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  };
}

function parseLoginBody(body: unknown): { email: string; password: string } {
  if (!body || typeof body !== "object") {
    throw new AppError(400, "Invalid request");
  }

  const email =
    "email" in body && typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = "password" in body && typeof body.password === "string" ? body.password : "";

  if (!email || !email.includes("@")) {
    throw new AppError(400, "Enter a valid email");
  }
  if (!password) {
    throw new AppError(400, "Enter your password");
  }

  return { email, password };
}

export async function login(req: Request, res: Response) {
  const { email, password } = parseLoginBody(req.body);
  const admin = await Admin.findOne({ email });

  if (!admin || !(await verifyPassword(password, admin.passwordHash))) {
    throw new AppError(401, "Invalid email or password");
  }

  const token = signAdminToken({ id: String(admin._id), email: admin.email });
  res.cookie(env.AUTH_COOKIE, token, cookieOptions());
  res.json({ ok: true, admin: { email: admin.email } });
}

export function logout(_req: Request, res: Response) {
  res.clearCookie(env.AUTH_COOKIE, cookieOptions());
  res.json({ ok: true });
}

export function me(req: Request, res: Response) {
  if (!req.admin?.email) {
    res.json({ ok: true, admin: null });
    return;
  }

  res.json({
    ok: true,
    admin: { email: req.admin.email },
  });
}
