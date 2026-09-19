import { AboutSettings, ABOUT_SETTINGS_KEY } from "../models/about-settings.model";

export const DEFAULT_ABOUT_SETTINGS = {
  key: ABOUT_SETTINGS_KEY,
  heading: "More Than Interiors",
  description:
    "I think good design has to be more than just good-looking. It has to know the people, purpose and possibilities of each space.",
  mission: "FUNCTION FIRST. AESTHETICS WITH PURPOSE.",
  vision: "Spaces need to do more for the people who use them.",
};

export async function seedAboutSettings(): Promise<void> {
  const existing = await AboutSettings.findOne({ key: ABOUT_SETTINGS_KEY });
  if (existing) return;
  await AboutSettings.create(DEFAULT_ABOUT_SETTINGS);
  console.log("About settings ready");
}
