const PREFIX = "dd-cms:";

type Entry<T> = { at: number; data: T };

export function readCmsCache<T>(key: string, maxAgeMs = 5 * 60_000): T | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(`${PREFIX}${key}`);
    if (!raw) return null;
    const entry = JSON.parse(raw) as Entry<T>;
    if (!entry?.at || Date.now() - entry.at > maxAgeMs) return null;
    return entry.data;
  } catch {
    return null;
  }
}

export function writeCmsCache<T>(key: string, data: T) {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(`${PREFIX}${key}`, JSON.stringify({ at: Date.now(), data }));
  } catch {
    /* quota */
  }
}
