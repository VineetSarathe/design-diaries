import mongoose, { Schema } from "mongoose";

export type CallBookingDoc = {
  date: string;
  slot: string;
  name: string;
  phone: string;
  city: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
};

const callBookingSchema = new Schema<CallBookingDoc>(
  {
    date: { type: String, required: true, trim: true },
    slot: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    message: { type: String, default: "", trim: true },
  },
  { timestamps: true },
);

callBookingSchema.index({ date: 1, slot: 1 }, { unique: true });
callBookingSchema.index({ createdAt: -1 });

export const CallBooking = mongoose.model<CallBookingDoc>("CallBooking", callBookingSchema);
