import { apiRequest } from "@/lib/api";
import { notifyAdmin } from "@/lib/notify-admin";
import { trackEvent } from "@/lib/analytics";

export type CallSlot = {
  id: string;
  label: string;
};

export type CallDate = {
  date: string;
  label: string;
};

export type CallAvailability = {
  timezone: string;
  dates: CallDate[];
  slots: CallSlot[];
  booked: string[];
  past: string[];
};

export type CallBooking = {
  id: string;
  date: string;
  slot: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  message: string;
  createdAt: string;
};

export function slotKey(date: string, slot: string) {
  return `${date}|${slot}`;
}

export function isSlotTaken(availability: CallAvailability, date: string, slot: string) {
  const key = slotKey(date, slot);
  return availability.booked.includes(key) || availability.past.includes(key);
}

export function getCallAvailability() {
  return apiRequest<CallAvailability>("/call-availability");
}

export async function createCallBooking(payload: {
  date: string;
  slot: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  message: string;
}) {
  const result = await apiRequest<{ booking: CallBooking }>("/call-bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  await notifyAdmin({
    subject: `New discovery call · ${payload.date} · ${payload.slot}`,
    eyebrow: "Discovery call",
    heading: payload.name,
    intro: "A discovery call was booked from the website.",
    name: payload.name,
    replyTo: payload.email,
    fields: [
      { label: "Date", value: payload.date },
      { label: "Time", value: payload.slot },
      { label: "Name", value: payload.name },
      { label: "Email", value: payload.email },
      { label: "Mobile", value: payload.phone },
      { label: "City", value: payload.city },
      { label: "Message", value: payload.message },
    ],
  });
  trackEvent("generate_lead", { lead_type: "call", date: payload.date, slot: payload.slot });
  return result;
}
