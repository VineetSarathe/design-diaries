import mongoose, { Schema } from "mongoose";

export type TestimonialDoc = {
  name: string;
  company: string;
  designation: string;
  testimonial: string;
  rating: number;
  imageUrl: string;
  imagePublicId: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

const testimonialSchema = new Schema<TestimonialDoc>(
  {
    name: { type: String, required: true, trim: true },
    company: { type: String, default: "", trim: true },
    designation: { type: String, default: "", trim: true },
    testimonial: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    imageUrl: { type: String, default: "", trim: true },
    imagePublicId: { type: String, default: "", trim: true },
    sortOrder: { type: Number, required: true, default: 1 },
  },
  { timestamps: true },
);

testimonialSchema.index({ createdAt: -1 });
testimonialSchema.index({ sortOrder: 1 });

export const Testimonial = mongoose.model<TestimonialDoc>("Testimonial", testimonialSchema);
