import { API_BASE } from "@/lib/api";
import { pageSeo, withCmsSeo, type CmsSeoFields } from "@/lib/seo";

export const PAGE_SEO_PAGES = [
  { key: "home", path: "/", label: "Home" },
  { key: "about", path: "/about", label: "About" },
  { key: "services", path: "/services", label: "Services" },
  { key: "work", path: "/work", label: "Work" },
  { key: "contact", path: "/contact", label: "Contact" },
  { key: "start-a-project", path: "/start-a-project", label: "Start a Project" },
  { key: "resources", path: "/resources", label: "Resources" },
  { key: "faq", path: "/faq", label: "FAQ" },
  { key: "careers", path: "/careers", label: "Careers" },
  { key: "privacy", path: "/privacy", label: "Privacy" },
  { key: "cookies", path: "/cookies", label: "Cookies" },
  { key: "terms", path: "/terms", label: "Terms" },
] as const;

export type PageSeoRecord = CmsSeoFields & {
  key: string;
  path: string;
};

export const PAGE_SEO_DEFAULTS: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Gym Interior Design Studio in Delhi | Design Diaries",
    description:
      "Design Diaries is a specialist gym and fitness interior design studio. 15+ gyms designed around equipment logic, circulation, durability and business impact.",
  },
  "/about": {
    title: "About Sagrika & Design Diaries | Gym Interior Specialist",
    description:
      "Meet Sagrika and discover the journey, philosophy and recognition behind Design Diaries, a specialist gym interior studio.",
  },
  "/services": {
    title: "Design Consultancy for Gyms | Design Diaries",
    description:
      "One offering, done properly: gym design consultancy covering concept, space planning, lighting, 3D views and 2D working drawings for your contractor to build from.",
  },
  "/work": {
    title: "Gym & Fitness Studio Projects | Design Diaries",
    description:
      "Gym & fitness interior design projects, designed around real use. Browse gym projects and fitness studios by Design Diaries.",
  },
  "/contact": {
    title: "Contact Design Diaries | Delhi, India",
    description:
      "General enquiries for Design Diaries — email, phone, WhatsApp and studio location in Delhi. Project enquiries go through Start a Project.",
  },
  "/start-a-project": {
    title: "Start a Gym Project | Design Diaries",
    description:
      "Tell us about your gym or fitness studio — size, city, timeline — or book a 30-minute discovery call. Sagrika reviews every enquiry personally.",
  },
  "/resources": {
    title: "Gym Design Journal & Free Downloads | Design Diaries",
    description:
      "Articles on gym planning, equipment layout, materials and wellness trends — plus free planning checklists, layout guides and budget worksheets for new gym owners.",
  },
  "/faq": {
    title: "Gym Interior Design FAQ | Design Diaries",
    description:
      "Remote clients, timelines, scope, process and what to prepare — the questions gym owners ask before starting an interior design project.",
  },
  "/careers": {
    title: "Careers at Design Diaries | Gym Interior Design Studio",
    description:
      "Work on fitness interiors where layout, circulation and durability matter as much as finish. Open roles and applications at Design Diaries.",
  },
  "/privacy": {
    title: "Privacy Policy | Design Diaries",
    description:
      "How Design Diaries by Sagrika collects, uses and protects personal information on www.designdiaries.co.",
  },
  "/cookies": {
    title: "Cookie Policy | Design Diaries",
    description:
      "How Design Diaries by Sagrika uses cookies and similar technologies on www.designdiaries.co, including Google Analytics 4 and Microsoft Clarity.",
  },
  "/terms": {
    title: "Terms & Conditions | Design Diaries",
    description:
      "Terms & Conditions for using the Design Diaries by Sagrika website, including content use, project enquiries and legal notices.",
  },
};

type Cache = { at: number; pages: Record<string, PageSeoRecord> };
let cache: Cache | null = null;
const CACHE_MS = 60_000;

export async function fetchPageSeoMap(): Promise<Record<string, PageSeoRecord>> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.pages;
  try {
    const res = await fetch(`${API_BASE}/page-seo`, {
      credentials: "include",
        signal: AbortSignal.timeout(800),
    });
    const data = (await res.json().catch(() => null)) as { ok?: boolean; pages?: PageSeoRecord[] } | null;
    if (!res.ok || !data?.ok || !Array.isArray(data.pages)) return cache?.pages ?? {};
    const pages: Record<string, PageSeoRecord> = {};
    for (const page of data.pages) {
      if (page?.path) pages[page.path] = page;
    }
    cache = { at: Date.now(), pages };
    return pages;
  } catch {
    return cache?.pages ?? {};
  }
}

export async function loadRouteSeo(path: string): Promise<PageSeoRecord | null> {
  const pages = await fetchPageSeoMap();
  return pages[path] || null;
}

export function routePageSeo(
  path: string,
  extra?: { image?: string; type?: "website" | "article"; noindex?: boolean; jsonLd?: unknown[] },
  cms?: CmsSeoFields | null,
) {
  const defaults = PAGE_SEO_DEFAULTS[path];
  if (!defaults) {
    return pageSeo({ title: "Design Diaries", description: "", path, ...extra });
  }
  return withCmsSeo({ ...defaults, path, ...extra }, cms);
}
