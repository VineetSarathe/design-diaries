import {
  ContactSettings,
  CONTACT_SETTINGS_KEY,
} from "../models/contact-settings.model";

export const DEFAULT_CONTACT_SETTINGS = {
  key: CONTACT_SETTINGS_KEY,
  email: "designdiariesbysagrika@gmail.com",
  phone: "+91 96224 34242",
  whatsapp: "+91 96224 34242",
  instagram: "https://www.instagram.com/designdiaries_by_sagrika_?stkn=ZmkzMWY4MnNydnpu",
  linkedin: "https://linkedin.com",
};

const OLD_PLACEHOLDERS = {
  email: new Set(["hello@designdiaries.in", ""]),
  phone: new Set(["+91 00000 00000", ""]),
  whatsapp: new Set(["+91 00000 00000", ""]),
  instagram: new Set([
    "",
    "https://instagram.com",
    "https://instagram.com/",
    "https://www.instagram.com",
    "https://www.instagram.com/",
  ]),
};

export async function seedContactSettings(): Promise<void> {
  const existing = await ContactSettings.findOne({ key: CONTACT_SETTINGS_KEY });
  if (!existing) {
    await ContactSettings.create(DEFAULT_CONTACT_SETTINGS);
    console.log("Contact settings ready");
    return;
  }

  const patch: Partial<typeof DEFAULT_CONTACT_SETTINGS> = {};
  if (OLD_PLACEHOLDERS.email.has(existing.email)) patch.email = DEFAULT_CONTACT_SETTINGS.email;
  if (OLD_PLACEHOLDERS.phone.has(existing.phone)) patch.phone = DEFAULT_CONTACT_SETTINGS.phone;
  if (OLD_PLACEHOLDERS.whatsapp.has(existing.whatsapp)) {
    patch.whatsapp = DEFAULT_CONTACT_SETTINGS.whatsapp;
  }
  if (OLD_PLACEHOLDERS.instagram.has(existing.instagram)) {
    patch.instagram = DEFAULT_CONTACT_SETTINGS.instagram;
  }
  if (!existing.linkedin) patch.linkedin = DEFAULT_CONTACT_SETTINGS.linkedin;

  if (Object.keys(patch).length > 0) {
    await ContactSettings.updateOne({ key: CONTACT_SETTINGS_KEY }, { $set: patch });
  }
}
