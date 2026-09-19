import mongoose, { Schema } from "mongoose";

export const CONTACT_SETTINGS_KEY = "studio";

export type ContactSettingsDoc = {
  key: string;
  email: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  linkedin: string;
};

const contactSettingsSchema = new Schema<ContactSettingsDoc>(
  {
    key: { type: String, required: true, unique: true, default: CONTACT_SETTINGS_KEY },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    whatsapp: { type: String, required: true, trim: true },
    instagram: { type: String, default: "https://instagram.com", trim: true },
    linkedin: { type: String, default: "https://linkedin.com", trim: true },
  },
  { timestamps: true },
);

export const ContactSettings = mongoose.model<ContactSettingsDoc>(
  "ContactSettings",
  contactSettingsSchema,
);
