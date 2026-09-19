import { mediaPreviewUrl } from "@/lib/media";

export const SITE_NAME = "Design Diaries";
export const SITE_ORIGIN = (import.meta.env.VITE_SITE_URL || "https://designdiaries.in").replace(/\/$/, "");

export function absoluteUrl(pathOrUrl: string) {
  if (!pathOrUrl) return "";
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_ORIGIN}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

export function blogCanonical(slug: string) {
  return `${SITE_ORIGIN}/resources/blog/${slug}`;
}

export function blogShareImage(src: string) {
  if (!src) return "";
  return absoluteUrl(mediaPreviewUrl(src, 1200));
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
