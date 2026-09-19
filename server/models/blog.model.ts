import mongoose, { Schema } from "mongoose";

export type BlogPointDoc = {
  heading: string;
  text: string;
  imageUrl: string;
  imagePublicId: string;
};

export type BlogSectionDoc = {
  heading: string;
  text: string;
  points: BlogPointDoc[];
};

export type BlogDoc = {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  excerpt: string;
  highlight: string;
  imageAlt: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  seoCanonical: string;
  projectSlug: string;
  imageUrl: string;
  imagePublicId: string;
  body: BlogSectionDoc[];
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

const pointSchema = new Schema<BlogPointDoc>(
  {
    heading: { type: String, default: "", trim: true },
    text: { type: String, default: "", trim: true },
    imageUrl: { type: String, default: "", trim: true },
    imagePublicId: { type: String, default: "", trim: true },
  },
  { _id: false },
);

const sectionSchema = new Schema<BlogSectionDoc>(
  {
    heading: { type: String, required: true, trim: true },
    text: { type: String, default: "", trim: true },
    points: { type: [pointSchema], default: [] },
  },
  { _id: false },
);

const blogSchema = new Schema<BlogDoc>(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    readTime: { type: String, default: "", trim: true },
    excerpt: { type: String, default: "", trim: true },
    highlight: { type: String, default: "", trim: true },
    imageAlt: { type: String, default: "", trim: true },
    seoTitle: { type: String, default: "", trim: true },
    seoDescription: { type: String, default: "", trim: true },
    seoKeywords: { type: String, default: "", trim: true },
    seoCanonical: { type: String, default: "", trim: true },
    projectSlug: { type: String, default: "", trim: true },
    imageUrl: { type: String, required: true, trim: true },
    imagePublicId: { type: String, default: "", trim: true },
    body: { type: [sectionSchema], default: [] },
    sortOrder: { type: Number, required: true, default: 1 },
  },
  { timestamps: true },
);

blogSchema.index({ sortOrder: 1 });

export const Blog = mongoose.model<BlogDoc>("Blog", blogSchema);
