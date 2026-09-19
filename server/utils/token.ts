import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "./appError";

export type AdminTokenPayload = {
  id: string;
  email: string;
};

export function signAdminToken(payload: AdminTokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
}

export function verifyAdminToken(token: string): AdminTokenPayload {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    if (
      typeof decoded !== "object" ||
      decoded === null ||
      typeof decoded.id !== "string" ||
      typeof decoded.email !== "string"
    ) {
      throw new AppError(401, "Invalid session");
    }
    return { id: decoded.id, email: decoded.email };
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError(401, "Invalid session");
  }
}
