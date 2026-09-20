import mongoose, { Schema } from "mongoose";

export type PageSeoDoc = {
  key: string;
  path: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  seoCanonical: string;
  updatedAt: Date;
  createdAt: Date;
};

const pageSeoSchema = new Schema<PageSeoDoc>(
  {
    key: { type: String, required: true, unique: true, trim: true },
    path: { type: String, required: true, trim: true },
    seoTitle: { type: String, default: "", trim: true },
    seoDescription: { type: String, default: "", trim: true },
    seoKeywords: { type: String, default: "", trim: true },
    seoCanonical: { type: String, default: "", trim: true },
  },
  { timestamps: true },
);

export const PageSeo = mongoose.model<PageSeoDoc>("PageSeo", pageSeoSchema);
