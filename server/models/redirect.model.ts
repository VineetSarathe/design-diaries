import mongoose, { Schema } from "mongoose";

export type RedirectDoc = {
  from: string;
  to: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const redirectSchema = new Schema<RedirectDoc>(
  {
    from: { type: String, required: true, unique: true, trim: true },
    to: { type: String, required: true, trim: true },
    enabled: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Redirect = mongoose.model<RedirectDoc>("Redirect", redirectSchema);
