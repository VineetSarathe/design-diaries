export type ContactSettings = {
  email: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  linkedin: string;
};

export const DEFAULT_CONTACT: ContactSettings = {
  email: "designdiariesbysagrika@gmail.com",
  phone: "+91 96224 34242",
  whatsapp: "+91 96224 34242",
  instagram: "https://www.instagram.com/designdiaries_by_sagrika_?stkn=ZmkzMWY4MnNydnpu",
  linkedin: "https://linkedin.com",
};

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function mailtoHref(email: string, subject?: string) {
  const base = `mailto:${email}`;
  return subject ? `${base}?subject=${encodeURIComponent(subject)}` : base;
}

export function whatsappHref(phone: string) {
  return `https://wa.me/${phone.replace(/\D/g, "")}`;
}
