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
  linkedin: "https://www.linkedin.com/in/designdiariesbysagrika",
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
    "https://www.instagram.com/designdiaries_by_sagrika_",
    "https://www.instagram.com/designdiaries_by_sagrika_/",
    "https://instagram.com/designdiaries_by_sagrika_",
    "https://instagram.com/designdiaries_by_sagrika_/",
  ]),
  linkedin: new Set(["", "https://linkedin.com", "https://linkedin.com/", "https://www.linkedin.com", "https://www.linkedin.com/"]),
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
  if (
    OLD_PLACEHOLDERS.instagram.has(existing.instagram) ||
    existing.instagram !== DEFAULT_CONTACT_SETTINGS.instagram
  ) {
    patch.instagram = DEFAULT_CONTACT_SETTINGS.instagram;
  }
  if (
    OLD_PLACEHOLDERS.linkedin.has(existing.linkedin) ||
    !existing.linkedin.includes("designdiariesbysagrika")
  ) {
    patch.linkedin = DEFAULT_CONTACT_SETTINGS.linkedin;
  }

  if (Object.keys(patch).length > 0) {
    await ContactSettings.updateOne({ key: CONTACT_SETTINGS_KEY }, { $set: patch });
  }
}
