import { API_BASE, apiFormRequest, apiRequest } from "@/lib/api";
import type { ContactSettings } from "@/lib/contact";
import type { HomepageSettings } from "@/lib/homepage";
import type { AboutSettings } from "@/lib/about";
import type { CmsProject } from "@/lib/cms-project";
import type { PageSeoRecord } from "@/lib/page-seo";
import type { CmsSeoFields } from "@/lib/seo";

export type AdminUser = {
  email: string;
};

export type AdminAccount = {
  id: string;
  email: string;
};

export type LeadSource = "enquiry" | "project" | "download" | "contact";

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  source: LeadSource;
  city: string;
  planning: string;
  resource: string;
  fileName: string;
  fileUrl: string;
  createdAt: string;
};

export type LeadList = {
  leads: Lead[];
  total: number;
  page: number;
  limit: number;
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

export type CallBookingList = {
  bookings: CallBooking[];
  total: number;
  page: number;
  limit: number;
};

export const SOURCE_LABELS: Record<LeadSource, string> = {
  enquiry: "Enquiry",
  project: "Project",
  download: "Download",
  contact: "Contact",
};

export type Testimonial = {
  id: string;
  name: string;
  company: string;
  designation: string;
  testimonial: string;
  rating: number;
  imageUrl: string;
  imagePublicId?: string;
  createdAt: string;
  updatedAt: string;
};

export type ClientLogo = {
  id: string;
  name: string;
  imageUrl: string;
  imagePublicId?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminProject = CmsProject & {
  id: string;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

export type Recognition = {
  id: string;
  title: string;
  category: string;
  year: string;
  description?: string;
  link: string;
  imageUrl: string;
  imagePublicId?: string;
  images: { url: string; kind?: "image" | "video"; publicId?: string }[];
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminBlog = {
  id: string;
  slug: string;
  title: string;
  category: string;
  readTime: string;
  excerpt: string;
  highlight?: string;
  imageAlt?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  seoCanonical?: string;
  projectSlug: string;
  imageUrl: string;
  imagePublicId?: string;
  body: {
    heading: string;
    text?: string;
    points?: { heading: string; text: string; imageUrl?: string }[];
  }[];
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminRedirect = {
  id: string;
  from: string;
  to: string;
  enabled: boolean;
  updatedAt?: string;
};

export type InstagramCard = {
  id: string;
  caption: string;
  link: string;
  imageUrl: string;
  imagePublicId?: string;
  placement?: "home" | "work" | "about" | "resources" | "services";
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

export const adminApi = {
  login(email: string, password: string) {
    return apiRequest<{ admin: AdminUser }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  logout() {
    return apiRequest("/auth/logout", { method: "POST" });
  },
  me() {
    return apiRequest<{ admin: AdminUser | null }>("/auth/me");
  },
  listAdminAccounts() {
    return apiRequest<{ admins: AdminAccount[]; max: number }>("/admin-accounts");
  },
  createAdminAccount(email: string, password: string) {
    return apiRequest<{ admin: AdminAccount }>("/admin-accounts", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  updateAdminAccount(id: string, fields: { email?: string; password?: string }) {
    return apiRequest<{ admin: AdminAccount }>(`/admin-accounts/${id}`, {
      method: "PUT",
      body: JSON.stringify(fields),
    });
  },
  deleteAdminAccount(id: string) {
    return apiRequest(`/admin-accounts/${id}`, { method: "DELETE" });
  },
  listLeads(
    params: { page?: number; limit?: number; q?: string; source?: string; from?: string; to?: string } = {},
  ) {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.q) query.set("q", params.q);
    if (params.source) query.set("source", params.source);
    if (params.from) query.set("from", params.from);
    if (params.to) query.set("to", params.to);
    const suffix = query.toString() ? `?${query.toString()}` : "";
    return apiRequest<LeadList>(`/leads${suffix}`);
  },
  listCallBookings(params: { page?: number; limit?: number; q?: string; date?: string } = {}) {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.q) query.set("q", params.q);
    if (params.date) query.set("date", params.date);
    const suffix = query.toString() ? `?${query.toString()}` : "";
    return apiRequest<CallBookingList>(`/call-bookings${suffix}`);
  },
  getCallSettings() {
    return apiRequest<{ settings: { email: string; accessKey: string } }>("/call-settings");
  },
  updateCallSettings(email: string, accessKey: string) {
    return apiRequest<{ settings: { email: string; accessKey: string } }>("/call-settings", {
      method: "PUT",
      body: JSON.stringify({ email, accessKey }),
    });
  },
  async exportLeads(params: { q?: string; source?: string; from?: string; to?: string } = {}) {
    const query = new URLSearchParams();
    if (params.q) query.set("q", params.q);
    if (params.source) query.set("source", params.source);
    if (params.from) query.set("from", params.from);
    if (params.to) query.set("to", params.to);
    const suffix = query.toString() ? `?${query.toString()}` : "";
    const res = await fetch(`${API_BASE}/leads/export${suffix}`, { credentials: "include" });
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { message?: string } | null;
      throw new Error(data?.message || "Could not export leads");
    }
    return res.blob();
  },
  getContactSettings() {
    return apiRequest<{ settings: ContactSettings }>("/settings/contact");
  },
  updateContactSettings(settings: ContactSettings) {
    return apiRequest<{ settings: ContactSettings }>("/settings/contact", {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  },
  getMailSettings() {
    return apiRequest<{ settings: { smtpUser: string; configured: boolean } }>("/settings/mail");
  },
  updateMailSettings(smtpUser: string, smtpPass: string) {
    return apiRequest<{ settings: { smtpUser: string; configured: boolean } }>("/settings/mail", {
      method: "PUT",
      body: JSON.stringify({ smtpUser, smtpPass }),
    });
  },
  testMailSettings() {
    return apiRequest<{ to: string }>("/settings/mail/test", { method: "POST" });
  },
  getHomepageSettings() {
    return apiRequest<{ settings: HomepageSettings }>("/settings/homepage");
  },
  updateHomepageSettings(settings: HomepageSettings) {
    return apiRequest<{ settings: HomepageSettings }>("/settings/homepage", {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  },
  listTestimonials() {
    return apiRequest<{ testimonials: Testimonial[] }>("/testimonials");
  },
  getTestimonial(id: string) {
    return apiRequest<{ testimonial: Testimonial }>(`/testimonials/${id}`);
  },
  createTestimonial(formData: FormData) {
    return apiFormRequest<{ testimonial: Testimonial; message?: string }>("/testimonials", formData, "POST");
  },
  updateTestimonial(id: string, formData: FormData) {
    return apiFormRequest<{ testimonial: Testimonial; message?: string }>(
      `/testimonials/${id}`,
      formData,
      "PUT",
    );
  },
  deleteTestimonial(id: string) {
    return apiRequest(`/testimonials/${id}`, { method: "DELETE" });
  },
  listClientLogos() {
    return apiRequest<{ logos: ClientLogo[] }>("/client-logos");
  },
  createClientLogo(formData: FormData) {
    return apiFormRequest<{ logo: ClientLogo; message?: string }>("/client-logos", formData, "POST");
  },
  updateClientLogo(id: string, formData: FormData) {
    return apiFormRequest<{ logo: ClientLogo; message?: string }>(`/client-logos/${id}`, formData, "PUT");
  },
  deleteClientLogo(id: string) {
    return apiRequest(`/client-logos/${id}`, { method: "DELETE" });
  },
  reorderClientLogos(items: { id: string; sortOrder: number }[]) {
    return apiRequest<{ logos: ClientLogo[] }>("/client-logos/reorder", {
      method: "PUT",
      body: JSON.stringify({ items }),
    });
  },
  getAboutSettings() {
    return apiRequest<{ settings: AboutSettings }>("/settings/about");
  },
  updateAboutSettings(settings: AboutSettings) {
    return apiRequest<{ settings: AboutSettings }>("/settings/about", {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  },
  listProjects() {
    return apiRequest<{ projects: AdminProject[] }>("/projects");
  },
  getProject(idOrSlug: string) {
    return apiRequest<{ project: AdminProject }>(`/projects/${encodeURIComponent(idOrSlug)}`);
  },
  createProject(formData: FormData) {
    return apiFormRequest<{ project: AdminProject; message?: string }>("/projects", formData, "POST");
  },
  updateProject(id: string, formData: FormData) {
    return apiFormRequest<{ project: AdminProject; message?: string }>(`/projects/${id}`, formData, "POST");
  },
  deleteProject(id: string) {
    return apiRequest(`/projects/${id}`, { method: "DELETE" });
  },
  reorderProjects(items: { id: string; sortOrder: number }[]) {
    return apiRequest<{ projects: AdminProject[] }>("/projects/reorder", {
      method: "PUT",
      body: JSON.stringify({ items }),
    });
  },
  listRecognitions() {
    return apiRequest<{ items: Recognition[] }>("/recognitions");
  },
  createRecognition(formData: FormData) {
    return apiFormRequest<{ item: Recognition; message?: string }>("/recognitions", formData, "POST");
  },
  updateRecognition(id: string, formData: FormData) {
    return apiFormRequest<{ item: Recognition; message?: string }>(`/recognitions/${id}`, formData, "PUT");
  },
  deleteRecognition(id: string) {
    return apiRequest(`/recognitions/${id}`, { method: "DELETE" });
  },
  reorderRecognitions(items: { id: string; sortOrder: number }[]) {
    return apiRequest<{ items: Recognition[] }>("/recognitions/reorder", {
      method: "PUT",
      body: JSON.stringify({ items }),
    });
  },
  listBlogs() {
    return apiRequest<{ posts: AdminBlog[] }>("/blogs");
  },
  createBlog(formData: FormData) {
    return apiFormRequest<{ post: AdminBlog; message?: string }>("/blogs", formData, "POST");
  },
  updateBlog(id: string, formData: FormData) {
    return apiFormRequest<{ post: AdminBlog; message?: string }>(`/blogs/${id}`, formData, "PUT");
  },
  deleteBlog(id: string) {
    return apiRequest(`/blogs/${id}`, { method: "DELETE" });
  },
  reorderBlogs(items: { id: string; sortOrder: number }[]) {
    return apiRequest<{ posts: AdminBlog[] }>("/blogs/reorder", {
      method: "PUT",
      body: JSON.stringify({ items }),
    });
  },
  listInstagramFeed(placement: "home" | "work" | "about" | "resources" | "services" = "home") {
    return apiRequest<{ items: InstagramCard[] }>(`/instagram-feed?placement=${placement}`);
  },
  createInstagramCard(formData: FormData) {
    return apiFormRequest<{ item: InstagramCard; message?: string }>("/instagram-feed", formData, "POST");
  },
  updateInstagramCard(id: string, formData: FormData) {
    return apiFormRequest<{ item: InstagramCard; message?: string }>(`/instagram-feed/${id}`, formData, "PUT");
  },
  deleteInstagramCard(id: string) {
    return apiRequest(`/instagram-feed/${id}`, { method: "DELETE" });
  },
  reorderInstagramFeed(items: { id: string; sortOrder: number }[]) {
    return apiRequest<{ items: InstagramCard[] }>("/instagram-feed/reorder", {
      method: "PUT",
      body: JSON.stringify({ items }),
    });
  },
  listPageSeo() {
    return apiRequest<{ pages: PageSeoRecord[] }>("/page-seo");
  },
  updatePageSeo(key: string, fields: CmsSeoFields) {
    return apiRequest<{ page: PageSeoRecord }>(`/page-seo/${encodeURIComponent(key)}`, {
      method: "PUT",
      body: JSON.stringify(fields),
    });
  },
  listRedirects() {
    return apiRequest<{ redirects: AdminRedirect[] }>("/redirects");
  },
  createRedirect(payload: { from: string; to: string; enabled?: boolean }) {
    return apiRequest<{ redirect: AdminRedirect }>("/redirects", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  updateRedirect(id: string, payload: Partial<{ from: string; to: string; enabled: boolean }>) {
    return apiRequest<{ redirect: AdminRedirect }>(`/redirects/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  deleteRedirect(id: string) {
    return apiRequest(`/redirects/${id}`, { method: "DELETE" });
  },
};
