import { getAdminToken } from "@/lib/admin-auth";

function resolveApiBase() {
  const fromEnv = (import.meta.env.VITE_API_URL || "").trim().replace(/\/$/, "");
  if (/^https?:\/\//i.test(fromEnv)) return fromEnv;
  if (import.meta.env.SSR) return "http://localhost:5000/api";
  return fromEnv || "/api";
}

export const API_BASE = resolveApiBase();

type ApiResult<T> = T & { ok: boolean; message?: string };

function buildAuthHeaders(extra?: HeadersInit): HeadersInit {
  const headers = new Headers(extra);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const token = getAdminToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
}

async function readApi<T>(res: Response): Promise<T> {
  const data = (await res.json().catch(() => null)) as ApiResult<T> | null;
  if (!res.ok || !data?.ok) {
    throw new Error(data?.message || "Request failed");
  }
  return data;
}

export async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  try {
    const { headers: extraHeaders, ...rest } = options ?? {};
    const res = await fetch(`${API_BASE}${path}`, {
      credentials: "include",
      headers: buildAuthHeaders(extraHeaders),
      ...rest,
    });
    return readApi<T>(res);
  } catch (err) {
    if (err instanceof TypeError) throw new Error("Server is not running. Start the API and try again.");
    throw err;
  }
}

export async function apiFormRequest<T>(path: string, formData: FormData, method: "POST" | "PUT"): Promise<T> {
  try {
    const headers = new Headers();
    const token = getAdminToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      credentials: "include",
      headers,
      body: formData,
      signal: AbortSignal.timeout(180000),
    });
    return readApi<T>(res);
  } catch (err) {
    if (err instanceof TypeError) throw new Error("Server is not running. Start the API and try again.");
    throw err;
  }
}
