import { API_BASE } from "@/lib/api";

type PublicRedirect = { from: string; to: string };

let cache: { at: number; items: PublicRedirect[] } | null = null;
const CACHE_MS = 30_000;

function normalizePath(pathname: string) {
  const clean = pathname.replace(/\/+$/, "") || "/";
  return clean;
}

export async function matchRedirect(pathname: string): Promise<string | null> {
  const from = normalizePath(pathname);
  if (from === "/" || from.startsWith("/admin")) return null;

  if (!cache || Date.now() - cache.at >= CACHE_MS) {
    try {
      const res = await fetch(`${API_BASE}/redirects/public`, {
        signal: AbortSignal.timeout(500),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; redirects?: PublicRedirect[] } | null;
      cache = {
        at: Date.now(),
        items: res.ok && data?.ok && Array.isArray(data.redirects) ? data.redirects : cache?.items ?? [],
      };
    } catch {
      if (!cache) cache = { at: Date.now(), items: [] };
    }
  }

  const hit = cache.items.find((item) => item.from === from);
  if (!hit?.to || hit.to === from) return null;
  return hit.to;
}
