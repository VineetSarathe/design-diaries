import {
  ContactSettings,
  CONTACT_SETTINGS_KEY,
} from "../models/contact-settings.model";

export const DEFAULT_CONTACT_SETTINGS = {
  key: CONTACT_SETTINGS_KEY,
  email: "hello@designdiaries.in",
  phone: "+91 00000 00000",
  whatsapp: "+91 00000 00000",
  instagram: "https://instagram.com",
  linkedin: "https://linkedin.com",
};

export async function seedContactSettings(): Promise<void> {
  const existing = await ContactSettings.findOne({ key: CONTACT_SETTINGS_KEY });
  if (!existing) {
    await ContactSettings.create(DEFAULT_CONTACT_SETTINGS);
    console.log("Contact settings ready");
    return;
  }

  const patch: Partial<typeof DEFAULT_CONTACT_SETTINGS> = {};
  if (!existing.instagram) patch.instagram = DEFAULT_CONTACT_SETTINGS.instagram;
  if (!existing.linkedin) patch.linkedin = DEFAULT_CONTACT_SETTINGS.linkedin;
  if (Object.keys(patch).length > 0) {
    await ContactSettings.updateOne({ key: CONTACT_SETTINGS_KEY }, { $set: patch });
  }
}
