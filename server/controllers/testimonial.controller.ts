import type { Request, Response } from "express";
import mongoose from "mongoose";
import { Testimonial, type TestimonialDoc } from "../models/testimonial.model";
import { AppError } from "../utils/appError";
import { removeStoredImage, storeImageBuffer } from "../utils/store-image";
import { setPublicJsonCache } from "../utils/public-cache";

function toDto(doc: TestimonialDoc & { _id: unknown }, admin = false) {
  return {
    id: String(doc._id),
    name: doc.name,
    company: doc.company,
    designation: doc.designation,
    testimonial: doc.testimonial,
    rating: doc.rating,
    imageUrl: doc.imageUrl,
    sortOrder: doc.sortOrder || 1,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
    ...(admin ? { imagePublicId: doc.imagePublicId } : {}),
  };
}

function readField(source: object, key: string, max: number): string {
  if (!(key in source) || typeof source[key as keyof typeof source] !== "string") return "";
  return String(source[key as keyof typeof source]).trim().slice(0, max);
}

function parseRating(value: unknown): number {
  const rating = Number(value);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new AppError(400, "Rating must be a whole number between 1 and 5");
  }
  return rating;
}

function parseCreate(source: object) {
  const name = readField(source, "name", 80);
  const company = readField(source, "company", 120);
  const designation = readField(source, "designation", 80);
  const testimonial = readField(source, "testimonial", 1200);
  const hasRating = "rating" in source && source.rating !== undefined && source.rating !== "";

  if (name.length < 2) throw new AppError(400, "Enter the person's name");
  if (testimonial.length < 8) throw new AppError(400, "Enter the testimonial");

  return {
    name,
    company,
    designation,
    testimonial,
    rating: parseRating(hasRating ? source.rating : 5),
  };
}

function parseUpdate(source: object) {
  const name = readField(source, "name", 80);
  const company = readField(source, "company", 120);
  const designation = readField(source, "designation", 80);
  const testimonial = readField(source, "testimonial", 1200);
  const hasRating = "rating" in source && source.rating !== undefined && source.rating !== "";

  if ("name" in source && name.length < 2) throw new AppError(400, "Enter the person's name");
  if ("testimonial" in source && testimonial.length < 8) {
    throw new AppError(400, "Enter the testimonial");
  }

  return {
    ...("name" in source ? { name } : {}),
    ...("company" in source ? { company } : {}),
    ...("designation" in source ? { designation } : {}),
    ...("testimonial" in source ? { testimonial } : {}),
    ...(hasRating ? { rating: parseRating(source.rating) } : {}),
  };
}

function getId(req: Request) {
  const id = req.params.id;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid testimonial");
  }
  return id;
}

async function findOrThrow(id: string) {
  const doc = await Testimonial.findById(id);
  if (!doc) throw new AppError(404, "Testimonial not found");
  return doc;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "client";
}

export async function listTestimonials(req: Request, res: Response) {
  const docs = await Testimonial.find().sort({ sortOrder: 1, createdAt: 1 });
  setPublicJsonCache(res, req, 120);
  res.json({ ok: true, testimonials: docs.map((doc) => toDto(doc, Boolean(req.admin))) });
}

export async function getTestimonial(req: Request, res: Response) {
  const doc = await findOrThrow(getId(req));
  res.json({ ok: true, testimonial: toDto(doc, Boolean(req.admin)) });
}

export async function createTestimonial(req: Request, res: Response) {
  const fields = parseCreate(req.body ?? {});
  let imageUrl = "";
  let imagePublicId = "";

  if (req.file?.buffer) {
    const uploaded = await storeImageBuffer(req.file.buffer, slugify(fields.name), "testimonials", req.file.mimetype);
    imageUrl = uploaded.imageUrl;
    imagePublicId = uploaded.imagePublicId;
  }

  await Testimonial.updateMany({}, { $inc: { sortOrder: 1 } });
  const doc = await Testimonial.create({
    name: fields.name,
    company: fields.company,
    designation: fields.designation,
    testimonial: fields.testimonial,
    rating: fields.rating,
    imageUrl,
    imagePublicId,
    sortOrder: 1,
  });

  res.status(201).json({ ok: true, testimonial: toDto(doc, true) });
}

export async function updateTestimonial(req: Request, res: Response) {
  const doc = await findOrThrow(getId(req));
  const fields = parseUpdate(req.body ?? {});
  const removeImage = String(req.body?.removeImage ?? "") === "true";

  const previousUrl = doc.imageUrl;
  const previousId = doc.imagePublicId;
  let imageUrl = doc.imageUrl;
  let imagePublicId = doc.imagePublicId;

  if (req.file?.buffer) {
    const uploaded = await storeImageBuffer(
      req.file.buffer,
      slugify(fields.name || doc.name),
      "testimonials",
      req.file.mimetype,
    );
    imageUrl = uploaded.imageUrl;
    imagePublicId = uploaded.imagePublicId;
  } else if (removeImage) {
    imageUrl = "";
    imagePublicId = "";
  }

  const updated = await Testimonial.findByIdAndUpdate(
    doc._id,
    {
      $set: {
        ...fields,
        imageUrl,
        imagePublicId,
      },
    },
    { new: true, runValidators: true },
  );
  if (!updated) throw new AppError(404, "Testimonial not found");

  if ((req.file?.buffer || removeImage) && previousUrl && previousUrl !== updated.imageUrl) {
    await removeStoredImage(previousUrl, previousId, "testimonials").catch(() => undefined);
  }

  res.json({ ok: true, testimonial: toDto(updated, true) });
}

export async function deleteTestimonial(req: Request, res: Response) {
  const doc = await findOrThrow(getId(req));
  await removeStoredImage(doc.imageUrl, doc.imagePublicId, "testimonials").catch(() => undefined);
  await doc.deleteOne();
  res.json({ ok: true });
}
