export type HomepageSettings = {
  heroHeading: string;
  heroDescription: string;
  ctaText: string;
  ctaLink: string;
  featuredProjectSlugs: string[];
  featuredBlogSlugs: string[];
};

export const DEFAULT_HOMEPAGE: HomepageSettings = {
  heroHeading: "Gyms designed to perform",
  heroDescription:
    "We specialise in fitness and gym interior design, shaped around movement, performance and the people who use them.",
  ctaText: "Start Your Gym Project",
  ctaLink: "/start-a-project",
  featuredProjectSlugs: ["iron-standard", "sanctum-wellness", "still-house-recovery"],
  featuredBlogSlugs: [],
};

export function pickBySlugs<T extends { slug: string }>(items: T[], slugs: string[]) {
  const map = new Map(items.map((item) => [item.slug, item]));
  return slugs.map((slug) => map.get(slug)).filter((item): item is T => item != null);
}

export function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}
