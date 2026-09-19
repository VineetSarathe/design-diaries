import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { AppError } from "../utils/appError";

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ ok: false, message: "Route not found" });
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ ok: false, message: err.message });
    return;
  }

  if (err instanceof multer.MulterError) {
    const fileUpload = err.field === "file";
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? fileUpload
          ? "File is too large. Please upload a smaller file."
          : "Image is too large. Please upload a smaller JPG, PNG or WEBP."
        : fileUpload
          ? "Invalid file upload"
          : "Invalid image upload";
    res.status(400).json({ ok: false, message });
    return;
  }

  if (err instanceof SyntaxError) {
    res.status(400).json({ ok: false, message: "Invalid JSON" });
    return;
  }

  console.error(err);
  res.status(500).json({ ok: false, message: "Internal server error" });
}
