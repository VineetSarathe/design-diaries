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
    instagram: { type: String, default: "https://www.instagram.com/designdiaries_by_sagrika_?stkn=ZmkzMWY4MnNydnpu", trim: true },
    linkedin: { type: String, default: "https://www.linkedin.com/in/designdiariesbysagrika", trim: true },
  },
  { timestamps: true },
);

export const ContactSettings = mongoose.model<ContactSettingsDoc>(
  "ContactSettings",
  contactSettingsSchema,
);
