import type { CorsOptions } from "cors";
import { env } from "./env";

/** Production frontends always permitted regardless of CORS_ORIGIN. */
const EXPLICIT_ALLOWED_ORIGINS = [
  "https://designdiaries.co",
  "https://www.designdiaries.co",
  "https://design-diaries-web.vercel.app",
  "https://design-diaries-one.vercel.app",
];

/** Extra localhost origins in non-production when env omits them. */
const LOCAL_DEV_FALLBACK_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:8080",
  "http://localhost:8081",
];

export function parseCorsOrigins(value: string): string[] {
  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
}

function buildAllowedOriginSet(): Set<string> {
  const allowed = new Set<string>([
    ...parseCorsOrigins(env.CORS_ORIGIN),
    ...EXPLICIT_ALLOWED_ORIGINS,
  ]);

  if (env.NODE_ENV !== "production") {
    for (const origin of LOCAL_DEV_FALLBACK_ORIGINS) {
      allowed.add(origin);
    }
  }

  return allowed;
}

const allowedOrigins = buildAllowedOriginSet();

export function corsOptions(): CorsOptions {
  return {
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(null, false);
    },
  };
}
