import type { Request, Response } from "express";
import { getDbStatus } from "../config/db";

export function health(_req: Request, res: Response) {
  const db = getDbStatus();

  res.json({
    ok: db === "connected",
    service: "gym-space-craft-api",
    db,
    timestamp: new Date().toISOString(),
  });
}
