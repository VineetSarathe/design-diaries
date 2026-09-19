import mongoose, { Schema } from "mongoose";

export const LEAD_SOURCES = ["enquiry", "project", "download", "contact"] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export type LeadDoc = {
  name: string;
  email: string;
  phone: string;
  message: string;
  source: LeadSource;
  city: string;
  planning: string;
  resource: string;
  fileName: string;
  fileUrl: string;
  filePublicId: string;
  createdAt: Date;
  updatedAt: Date;
};

const leadSchema = new Schema<LeadDoc>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: "", trim: true },
    message: { type: String, default: "", trim: true },
    source: { type: String, required: true, enum: LEAD_SOURCES },
    city: { type: String, default: "", trim: true },
    planning: { type: String, default: "", trim: true },
    resource: { type: String, default: "", trim: true },
    fileName: { type: String, default: "", trim: true },
    fileUrl: { type: String, default: "", trim: true },
    filePublicId: { type: String, default: "", trim: true },
  },
  { timestamps: true },
);

leadSchema.index({ createdAt: -1 });
leadSchema.index({ email: 1 });

export const Lead = mongoose.model<LeadDoc>("Lead", leadSchema);
