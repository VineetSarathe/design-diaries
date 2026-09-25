import type { Request, Response } from "express";

/** Cache public JSON reads in the browser/CDN; skip when an admin session is active. */
export function setPublicJsonCache(res: Response, req: Request, maxAgeSeconds = 120) {
  if (req.admin) return;
  res.set(
    "Cache-Control",
    `public, max-age=${maxAgeSeconds}, stale-while-revalidate=${maxAgeSeconds * 5}`,
  );
}
