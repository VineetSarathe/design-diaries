import mongoose, { Schema } from "mongoose";

export const HOMEPAGE_SETTINGS_KEY = "home";

export type HomepageSettingsDoc = {
  key: string;
  heroHeading: string;
  heroDescription: string;
  ctaText: string;
  ctaLink: string;
  featuredProjectSlugs: string[];
  featuredBlogSlugs: string[];
};

const homepageSettingsSchema = new Schema<HomepageSettingsDoc>(
  {
    key: { type: String, required: true, unique: true, default: HOMEPAGE_SETTINGS_KEY },
    heroHeading: { type: String, required: true, trim: true },
    heroDescription: { type: String, required: true, trim: true },
    ctaText: { type: String, required: true, trim: true },
    ctaLink: { type: String, required: true, trim: true },
    featuredProjectSlugs: { type: [String], default: [] },
    featuredBlogSlugs: { type: [String], default: [] },
  },
  { timestamps: true },
);

export const HomepageSettings = mongoose.model<HomepageSettingsDoc>(
  "HomepageSettings",
  homepageSettingsSchema,
);
