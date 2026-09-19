import {
  HomepageSettings,
  HOMEPAGE_SETTINGS_KEY,
} from "../models/homepage-settings.model";

export const DEFAULT_HOMEPAGE_SETTINGS = {
  key: HOMEPAGE_SETTINGS_KEY,
  heroHeading: "Gyms designed to perform",
  heroDescription:
    "We specialise in fitness and gym interior design, shaped around movement, performance and the people who use them.",
  ctaText: "Start Your Gym Project",
  ctaLink: "/start-a-project",
  featuredProjectSlugs: ["iron-standard", "sanctum-wellness", "still-house-recovery"],
  featuredBlogSlugs: [] as string[],
};

export async function seedHomepageSettings(): Promise<void> {
  const existing = await HomepageSettings.findOne({ key: HOMEPAGE_SETTINGS_KEY });
  if (!existing) {
    await HomepageSettings.create(DEFAULT_HOMEPAGE_SETTINGS);
    console.log("Homepage settings ready");
    return;
  }

  const patch: Partial<typeof DEFAULT_HOMEPAGE_SETTINGS> = {};
  if (!existing.heroHeading) patch.heroHeading = DEFAULT_HOMEPAGE_SETTINGS.heroHeading;
  if (!existing.heroDescription) patch.heroDescription = DEFAULT_HOMEPAGE_SETTINGS.heroDescription;
  if (!existing.ctaText) patch.ctaText = DEFAULT_HOMEPAGE_SETTINGS.ctaText;
  if (!existing.ctaLink) patch.ctaLink = DEFAULT_HOMEPAGE_SETTINGS.ctaLink;
  if (!Array.isArray(existing.featuredProjectSlugs)) {
    patch.featuredProjectSlugs = DEFAULT_HOMEPAGE_SETTINGS.featuredProjectSlugs;
  }
  if (!Array.isArray(existing.featuredBlogSlugs)) {
    patch.featuredBlogSlugs = DEFAULT_HOMEPAGE_SETTINGS.featuredBlogSlugs;
  }
  if (Object.keys(patch).length > 0) {
    await HomepageSettings.updateOne({ key: HOMEPAGE_SETTINGS_KEY }, { $set: patch });
  }
}
