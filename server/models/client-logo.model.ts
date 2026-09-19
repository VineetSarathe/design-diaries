import mongoose, { Schema } from "mongoose";

export type ClientLogoDoc = {
  name: string;
  imageUrl: string;
  imagePublicId: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

const clientLogoSchema = new Schema<ClientLogoDoc>(
  {
    name: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true, trim: true },
    imagePublicId: { type: String, default: "", trim: true },
    sortOrder: { type: Number, required: true, default: 1 },
  },
  { timestamps: true },
);

clientLogoSchema.index({ sortOrder: 1 });

export const ClientLogo = mongoose.model<ClientLogoDoc>("ClientLogo", clientLogoSchema);
