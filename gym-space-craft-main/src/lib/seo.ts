import { mediaPreviewUrl } from "@/lib/media";
import { DEFAULT_CONTACT } from "@/lib/contact";

export const SITE_NAME = "Design Diaries";
export const SITE_ORIGIN = (
  import.meta.env.VITE_SITE_URL || "https://design-diaries-web.vercel.app"
).replace(/\/$/, "");
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og.jpg`;

export function absoluteUrl(pathOrUrl: string) {
  if (!pathOrUrl) return "";
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_ORIGIN}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

export function blogCanonical(slug: string) {
  return `${SITE_ORIGIN}/resources/blog/${slug}`;
}

export function blogShareImage(src: string) {
  if (!src) return DEFAULT_OG_IMAGE;
  const preview = mediaPreviewUrl(src, 1200);
  return /^https?:\/\//i.test(preview) ? preview : absoluteUrl(preview);
}

export function blogKeywords(category: string, title: string) {
  const fromTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3)
    .slice(0, 6)
    .join(", ");
  return [category, "gym interior design", "fitness space design", "Design Diaries", fromTitle]
    .filter(Boolean)
    .join(", ");
}

export function resolveBlogSeo(post: {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  imageAlt?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  seoCanonical?: string;
}) {
  const title = post.seoTitle?.trim() || `${post.title} | ${SITE_NAME}`;
  const description = post.seoDescription?.trim() || post.excerpt;
  const keywords = post.seoKeywords?.trim() || blogKeywords(post.category, post.title);
  const customCanonical = post.seoCanonical?.trim();
  const url = customCanonical
    ? /^https?:\/\//i.test(customCanonical)
      ? customCanonical
      : absoluteUrl(customCanonical)
    : blogCanonical(post.slug);
  const image = blogShareImage(post.image);
  return { title, description, keywords, url, image, imageAlt: post.imageAlt?.trim() || post.title };
}

export function jsonLdScript(data: unknown) {
  return {
    type: "application/ld+json" as const,
    children: JSON.stringify(data),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "InteriorDesigner",
    name: SITE_NAME,
    url: SITE_ORIGIN,
    email: DEFAULT_CONTACT.email,
    telephone: DEFAULT_CONTACT.phone,
    image: DEFAULT_OG_IMAGE,
    logo: absoluteUrl("/favicon.png"),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Delhi",
      addressCountry: "IN",
    },
    areaServed: "IN",
    sameAs: [DEFAULT_CONTACT.instagram, DEFAULT_CONTACT.linkedin].filter(Boolean),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_ORIGIN,
    publisher: { "@type": "Organization", name: SITE_NAME },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqPageJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

type PageSeoInput = {
  title: string;
  description: string;
  path: string;
  canonical?: string;
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
  keywords?: string;
  jsonLd?: unknown[];
};

export function pageSeo(input: PageSeoInput) {
  const url = input.canonical?.trim() ? absoluteUrl(input.canonical.trim()) : absoluteUrl(input.path);
  const image = input.image ? blogShareImage(input.image) : DEFAULT_OG_IMAGE;
  const jsonLd = input.jsonLd ?? [];
  return {
    meta: [
      { title: input.title },
      { name: "description", content: input.description },
      ...(input.keywords ? [{ name: "keywords", content: input.keywords }] : []),
      ...(input.noindex ? [{ name: "robots", content: "noindex, nofollow" }] : []),
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "en_IN" },
      { property: "og:title", content: input.title },
      { property: "og:description", content: input.description },
      { property: "og:type", content: input.type || "website" },
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: input.title },
      { name: "twitter:description", content: input.description },
      { name: "twitter:image", content: image },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: jsonLd.map(jsonLdScript),
  };
}

export type CmsSeoFields = {
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  seoCanonical?: string;
};

export function withCmsSeo(base: PageSeoInput, cms?: CmsSeoFields | null) {
  return pageSeo({
    ...base,
    title: cms?.seoTitle?.trim() || base.title,
    description: cms?.seoDescription?.trim() || base.description,
    keywords: cms?.seoKeywords?.trim() || base.keywords,
    canonical: cms?.seoCanonical?.trim() || base.canonical,
  });
}
