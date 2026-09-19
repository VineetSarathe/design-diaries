import { z } from "zod";
import { apiFormRequest, apiRequest } from "@/lib/api";
import type { Lead, LeadSource } from "@/lib/admin-api";
import { compressImage } from "@/lib/compress-image";
import { notifyAdmin } from "@/lib/notify-admin";

export const planningOptions = ["New Gym", "Renovation", "Fitness Studio", "Other"] as const;

function parse<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.issues[0]?.message || "Please check the form and try again.");
  }
  return result.data;
}

function createLead(payload: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  source: LeadSource;
  city?: string;
  planning?: string;
  resource?: string;
  fileName?: string;
}) {
  return apiRequest<{ lead: Lead }>("/leads", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z.string().trim().min(7, "Please enter a valid phone number").max(20),
  email: z.string().trim().email("Please enter a valid email").max(160),
  city: z.string().trim().min(2, "Please enter your city").max(80),
});

export async function submitEnquiry(data: unknown) {
  const parsed = parse(enquirySchema, data);
  await createLead({
    source: "enquiry",
    name: parsed.name,
    email: parsed.email,
    phone: parsed.phone,
    city: parsed.city,
    message: `Enquiry from ${parsed.city}`,
  });
  await notifyAdmin({
    subject: `New Enquiry · ${parsed.name}`,
    eyebrow: "New enquiry",
    heading: parsed.name,
    intro: "Someone submitted an enquiry on the website.",
    name: parsed.name,
    replyTo: parsed.email,
    fields: [
      { label: "Name", value: parsed.name },
      { label: "Email", value: parsed.email },
      { label: "Phone", value: parsed.phone },
      { label: "City", value: parsed.city },
    ],
  });
}

const downloadLeadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.string().trim().email("Please enter a valid email").max(160),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  resource: z.string().trim().min(1).max(160),
});

export async function submitDownloadLead(data: unknown) {
  const parsed = parse(downloadLeadSchema, data);
  await createLead({
    source: "download",
    name: parsed.name,
    email: parsed.email,
    phone: parsed.phone || "",
    resource: parsed.resource,
    message: `Download request: ${parsed.resource}`,
  });
  await notifyAdmin({
    subject: `New Resource download · ${parsed.name}`,
    eyebrow: "Resource download",
    heading: parsed.name,
    intro: "Someone requested a download from Resources.",
    name: parsed.name,
    replyTo: parsed.email,
    fields: [
      { label: "Name", value: parsed.name },
      { label: "Email", value: parsed.email },
      { label: "Phone", value: parsed.phone || "—" },
      { label: "Resource", value: parsed.resource },
    ],
  });
}

const projectEnquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z.string().trim().min(7, "Please enter a valid phone number").max(20),
  email: z.string().trim().email("Please enter a valid email").max(160),
  city: z.string().trim().min(2, "Please enter your city").max(80),
  planning: z.enum(planningOptions),
  description: z.string().trim().min(10, "Tell us a little more").max(1200),
});

const MAX_LEAD_FILE_BYTES = 40 * 1024 * 1024;

export async function submitProjectEnquiry(data: {
  name: string;
  phone: string;
  email: string;
  city: string;
  planning: string;
  description: string;
  file?: File | null;
}) {
  const parsed = parse(projectEnquirySchema, data);
  if (data.file && data.file.size > MAX_LEAD_FILE_BYTES) {
    throw new Error("File is too large. Please upload a smaller file.");
  }

  const fd = new FormData();
  fd.append("source", "project");
  fd.append("name", parsed.name);
  fd.append("email", parsed.email);
  fd.append("phone", parsed.phone);
  fd.append("city", parsed.city);
  fd.append("planning", parsed.planning);
  fd.append("message", parsed.description);
  if (data.file) {
    fd.append("fileName", data.file.name.slice(0, 200));
    const upload = data.file.type.startsWith("image/") ? await compressImage(data.file) : data.file;
    fd.append("file", upload, data.file.name);
  }

  await apiFormRequest<{ lead: Lead }>("/leads", fd, "POST");
  await notifyAdmin({
    subject: `New Start a project · ${parsed.name}`,
    eyebrow: "Start a project",
    heading: parsed.name,
    intro: "A new project enquiry arrived from the website.",
    name: parsed.name,
    replyTo: parsed.email,
    fields: [
      { label: "Name", value: parsed.name },
      { label: "Email", value: parsed.email },
      { label: "Phone", value: parsed.phone },
      { label: "City", value: parsed.city },
      { label: "Planning", value: parsed.planning },
      { label: "Details", value: parsed.description },
      { label: "File", value: data.file?.name || "" },
    ],
  });
}
