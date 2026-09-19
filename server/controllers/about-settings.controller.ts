import type { Request, Response } from "express";
import { AboutSettings, ABOUT_SETTINGS_KEY, type AboutSettingsDoc } from "../models/about-settings.model";
import { AppError } from "../utils/appError";
import { DEFAULT_ABOUT_SETTINGS } from "../seed/about-settings.seed";

function toDto(doc: AboutSettingsDoc) {
  return {
    heading: doc.heading || DEFAULT_ABOUT_SETTINGS.heading,
    description: doc.description || DEFAULT_ABOUT_SETTINGS.description,
    mission: doc.mission || DEFAULT_ABOUT_SETTINGS.mission,
    vision: doc.vision || DEFAULT_ABOUT_SETTINGS.vision,
  };
}

function readString(body: object, key: string, max: number): string {
  if (!(key in body) || typeof body[key as keyof typeof body] !== "string") return "";
  return String(body[key as keyof typeof body]).trim().slice(0, max);
}

export async function getAboutSettings(_req: Request, res: Response) {
  const settings = await AboutSettings.findOne({ key: ABOUT_SETTINGS_KEY });
  if (!settings) throw new AppError(404, "About settings not found");
  res.json({ ok: true, settings: toDto(settings) });
}

export async function updateAboutSettings(req: Request, res: Response) {
  if (!req.body || typeof req.body !== "object") throw new AppError(400, "Invalid request");

  const heading = readString(req.body, "heading", 160);
  const description = readString(req.body, "description", 800);
  const mission = readString(req.body, "mission", 600);
  const vision = readString(req.body, "vision", 600);

  if (heading.length < 2) throw new AppError(400, "Enter an about heading");
  if (description.length < 8) throw new AppError(400, "Enter an about description");
  if (mission.length < 8) throw new AppError(400, "Enter the mission");
  if (vision.length < 8) throw new AppError(400, "Enter the vision");

  const settings = await AboutSettings.findOneAndUpdate(
    { key: ABOUT_SETTINGS_KEY },
    { heading, description, mission, vision },
    { returnDocument: "after", upsert: true },
  );

  if (!settings) throw new AppError(500, "Could not save about settings");
  res.json({ ok: true, settings: toDto(settings) });
}
