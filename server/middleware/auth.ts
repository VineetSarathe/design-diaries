import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import { AppError } from "../utils/appError";
import { verifyAdminToken } from "../utils/token";

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  try {
    req.admin = readAdmin(req);
    if (!req.admin) {
      throw new AppError(401, "Please sign in");
    }
    next();
  } catch (err) {
    next(err instanceof AppError ? err : new AppError(401, "Please sign in"));
  }
}

export function optionalAdmin(req: Request, _res: Response, next: NextFunction) {
  req.admin = readAdmin(req);
  next();
}

function readAdmin(req: Request) {
  const token = readAuthToken(req);
  if (!token) return undefined;
  try {
    return verifyAdminToken(token);
  } catch {
    return undefined;
  }
}

function readAuthToken(req: Request): string | undefined {
  const cookieToken = req.cookies?.[env.AUTH_COOKIE];
  if (typeof cookieToken === "string" && cookieToken.trim()) {
    return cookieToken.trim();
  }
  const header = req.headers.authorization;
  if (typeof header === "string" && header.startsWith("Bearer ")) {
    const bearer = header.slice(7).trim();
    if (bearer) return bearer;
  }
  return undefined;
}
