import { categories, projects as fallbackProjects, type Category, type Project } from "@/data/projects";
import {
  EMPTY_PROJECT_STUDY,
  type ProjectStudyFields,
  studyHasContent,
} from "@/lib/project-study";

export type CmsProjectImage = {
  url: string;
  alt?: string;
  caption?: string;
  kind?: "image" | "video";
};

export type CmsProject = {
  id?: string;
  slug: string;
  name: string;
  location: string;
  category: string;
  area: string;
  year: string;
  clientType: string;
  cardLabel: string;
  hideCardMeta: boolean;
  insight: string;
  study?: ProjectStudyFields;
  cardUrl: string;
  images: CmsProjectImage[];
  reviewQuote?: string;
  reviewAuthor?: string;
  reviewRole?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  seoCanonical?: string;
  sortOrder?: number;
};

function studyForProject(cms: CmsProject, fallback?: Project): Project["study"] {
  if (studyHasContent(cms.study)) {
    return { ...EMPTY_PROJECT_STUDY, ...cms.study };
  }
  if (fallback?.study) return fallback.study;
  const insight = cms.insight.trim();
  if (!insight) return EMPTY_PROJECT_STUDY;
  return { ...EMPTY_PROJECT_STUDY, brief: insight };
}

export const PROJECT_CATEGORIES = [...categories];

export function cmsToProject(cms: CmsProject, fallback?: Project): Project {
  const extras = cms.images
    .filter((image) => image.url)
    .map((image) => ({
      src: image.url,
      alt: image.alt || cms.name,
      caption: image.caption,
    }));
  const extraSrcs = extras.map((image) => image.src);
  const card = cms.cardUrl || extraSrcs[0] || fallback?.card || "";
  const cardImages = extraSrcs.length
    ? extraSrcs.includes(card)
      ? extraSrcs
      : [card, ...extraSrcs].filter(Boolean)
    : [card].filter(Boolean);
  return {
    slug: cms.slug,
    name: cms.name,
    location: cms.location,
    category: (cms.category || fallback?.category || "Gym Projects") as Category,
    area: cms.area,
    year: cms.year,
    clientType: cms.clientType,
    cardLabel: cms.cardLabel || undefined,
    hideCardMeta: cms.hideCardMeta,
    insight: cms.insight,
    seoTitle: cms.seoTitle || "",
    seoDescription: cms.seoDescription || "",
    seoKeywords: cms.seoKeywords || "",
    seoCanonical: cms.seoCanonical || "",
    card,
    cardImages,
    hero: card || extras[0]?.src || fallback?.hero || "",
    gallery: extras.length ? extras : fallback?.gallery || [],
    plan: fallback?.plan,
    study: studyForProject(cms, fallback),
    testimonial: {
      quote: cms.reviewQuote || fallback?.testimonial.quote || cms.insight,
      author: cms.reviewAuthor || fallback?.testimonial.author || "Client",
      role: cms.reviewRole || fallback?.testimonial.role || cms.clientType || cms.name,
    },
    detail: fallback?.detail,
  };
}

export function mergeCmsProjects(cmsProjects: CmsProject[], fallback = fallbackProjects): Project[] {
  const map = new Map(fallback.map((project) => [project.slug, project]));
  return cmsProjects.map((item) => cmsToProject(item, map.get(item.slug)));
}

export function categoriesFromProjects(list: Project[]) {
  const extra = list.map((project) => project.category).filter((category) => !PROJECT_CATEGORIES.includes(category as Category));
  return [...PROJECT_CATEGORIES, ...Array.from(new Set(extra))];
}
