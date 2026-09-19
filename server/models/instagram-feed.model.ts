import mongoose, { Schema } from "mongoose";

export type InstagramPlacement = "home" | "work" | "about" | "resources" | "services";

export type InstagramFeedDoc = {
  caption: string;
  link: string;
  imageUrl: string;
  imagePublicId: string;
  placement: InstagramPlacement;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

const instagramFeedSchema = new Schema<InstagramFeedDoc>(
  {
    caption: { type: String, default: "", trim: true },
    link: { type: String, default: "", trim: true },
    imageUrl: { type: String, required: true, trim: true },
    imagePublicId: { type: String, default: "", trim: true },
    placement: { type: String, enum: ["home", "work", "about", "resources", "services"], default: "home", index: true },
    sortOrder: { type: Number, required: true, default: 1 },
  },
  { timestamps: true },
);

instagramFeedSchema.index({ placement: 1, sortOrder: 1 });

export const InstagramFeed = mongoose.model<InstagramFeedDoc>("InstagramFeed", instagramFeedSchema);
