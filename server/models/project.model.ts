import mongoose, { Schema } from "mongoose";

export type ProjectImageDoc = {
  url: string;
  publicId: string;
  alt: string;
  caption: string;
  kind: "image" | "video";
};

export type ProjectDoc = {
  slug: string;
  name: string;
  location: string;
  category: string;
  area: string;
  year: string;
  clientType: string;
  cardLabel: string;
  hideCardMeta: boolean;
  insight: string;
  cardUrl: string;
  cardPublicId: string;
  images: ProjectImageDoc[];
  reviewQuote: string;
  reviewAuthor: string;
  reviewRole: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  seoCanonical: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

const projectImageSchema = new Schema<ProjectImageDoc>(
  {
    url: { type: String, default: "", trim: true },
    publicId: { type: String, default: "", trim: true },
    alt: { type: String, default: "", trim: true },
    caption: { type: String, default: "", trim: true },
    kind: { type: String, enum: ["image", "video"], default: "image", trim: true },
  },
  { _id: false },
);

const projectSchema = new Schema<ProjectDoc>(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    location: { type: String, default: "", trim: true },
    category: { type: String, required: true, trim: true },
    area: { type: String, default: "", trim: true },
    year: { type: String, default: "", trim: true },
    clientType: { type: String, default: "", trim: true },
    cardLabel: { type: String, default: "", trim: true },
    hideCardMeta: { type: Boolean, default: true },
    insight: { type: String, required: true, trim: true },
    cardUrl: { type: String, default: "", trim: true },
    cardPublicId: { type: String, default: "", trim: true },
    images: { type: [projectImageSchema], default: [] },
    reviewQuote: { type: String, default: "", trim: true },
    reviewAuthor: { type: String, default: "", trim: true },
    reviewRole: { type: String, default: "", trim: true },
    seoTitle: { type: String, default: "", trim: true },
    seoDescription: { type: String, default: "", trim: true },
    seoKeywords: { type: String, default: "", trim: true },
    seoCanonical: { type: String, default: "", trim: true },
    sortOrder: { type: Number, required: true, default: 1 },
  },
  { timestamps: true },
);

projectSchema.index({ sortOrder: 1 });

export const Project = mongoose.model<ProjectDoc>("Project", projectSchema);
