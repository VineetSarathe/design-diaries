import mongoose, { Schema } from "mongoose";

export const ABOUT_SETTINGS_KEY = "about";

export type AboutSettingsDoc = {
  key: string;
  heading: string;
  description: string;
  mission: string;
  vision: string;
};

const aboutSettingsSchema = new Schema<AboutSettingsDoc>(
  {
    key: { type: String, required: true, unique: true, default: ABOUT_SETTINGS_KEY },
    heading: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    mission: { type: String, required: true, trim: true },
    vision: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

export const AboutSettings = mongoose.model<AboutSettingsDoc>("AboutSettings", aboutSettingsSchema);
