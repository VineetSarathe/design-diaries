import mongoose, { Schema } from "mongoose";

export type AdminDoc = {
  email: string;
  passwordHash: string;
};

const adminSchema = new Schema<AdminDoc>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true },
);

export const Admin = mongoose.model<AdminDoc>("Admin", adminSchema);
