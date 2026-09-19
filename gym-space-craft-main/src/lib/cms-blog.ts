import type { BlogPost } from "@/data/resources";

export type CmsBlog = {
  id: string;
  slug: string;
  title: string;
  category: string;
  readTime: string;
  excerpt: string;
  highlight?: string;
  imageAlt?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  seoCanonical?: string;
  projectSlug: string;
  imageUrl: string;
  imagePublicId?: string;
  body: BlogPost["body"];
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

export function cmsToPost(item: CmsBlog): BlogPost {
  return {
    slug: item.slug,
    title: item.title,
    category: item.category,
    readTime: item.readTime,
    excerpt: item.excerpt,
    highlight: item.highlight || "",
    image: item.imageUrl,
    imageAlt: item.imageAlt || "",
    seoTitle: item.seoTitle || "",
    seoDescription: item.seoDescription || "",
    seoKeywords: item.seoKeywords || "",
    seoCanonical: item.seoCanonical || "",
    projectSlug: item.projectSlug || "",
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    body: Array.isArray(item.body)
      ? item.body.map((section) => ({
          heading: section.heading,
          text: section.text,
          points: (section.points || []).map((point) => ({
            heading: point.heading,
            text: point.text,
            image: point.image || (point as { imageUrl?: string }).imageUrl || "",
          })),
        }))
      : [],
  };
}

export function cmsToPosts(items: CmsBlog[]): BlogPost[] {
  return items.map(cmsToPost);
}
