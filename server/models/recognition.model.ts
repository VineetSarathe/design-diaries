import mongoose, { Schema } from "mongoose";

export type RecognitionImageDoc = {
  url: string;
  publicId: string;
  kind: "image" | "video";
};

export type RecognitionDoc = {
  title: string;
  category: string;
  year: string;
  link: string;
  imageUrl: string;
  imagePublicId: string;
  images: RecognitionImageDoc[];
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

const recognitionImageSchema = new Schema<RecognitionImageDoc>(
  {
    url: { type: String, required: true, trim: true },
    publicId: { type: String, default: "", trim: true },
    kind: { type: String, enum: ["image", "video"], default: "image", trim: true },
  },
  { _id: false },
);

const recognitionSchema = new Schema<RecognitionDoc>(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    year: { type: String, default: "", trim: true },
    link: { type: String, default: "/about#recognition", trim: true },
    imageUrl: { type: String, required: true, trim: true },
    imagePublicId: { type: String, default: "", trim: true },
    images: { type: [recognitionImageSchema], default: [] },
    sortOrder: { type: Number, required: true, default: 1 },
  },
  { timestamps: true },
);

recognitionSchema.index({ sortOrder: 1 });

export const Recognition = mongoose.model<RecognitionDoc>("Recognition", recognitionSchema);
