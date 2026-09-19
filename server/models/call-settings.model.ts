import mongoose, { Schema } from "mongoose";

export const CALL_SETTINGS_KEY = "calls";

export type CallSettingsDoc = {
  key: string;
  email: string;
  accessKey: string;
};

const callSettingsSchema = new Schema<CallSettingsDoc>(
  {
    key: { type: String, required: true, unique: true, default: CALL_SETTINGS_KEY },
    email: { type: String, required: true, trim: true, lowercase: true },
    accessKey: { type: String, default: "", trim: true },
  },
  { timestamps: true },
);

export const CallSettings = mongoose.model<CallSettingsDoc>("CallSettings", callSettingsSchema);
