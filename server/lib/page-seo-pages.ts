export const PAGE_SEO_PAGES = [
  { key: "home", path: "/", label: "Home" },
  { key: "about", path: "/about", label: "About" },
  { key: "services", path: "/services", label: "Services" },
  { key: "work", path: "/work", label: "Work" },
  { key: "contact", path: "/contact", label: "Contact" },
  { key: "start-a-project", path: "/start-a-project", label: "Start a Project" },
  { key: "resources", path: "/resources", label: "Resources" },
  { key: "faq", path: "/faq", label: "FAQ" },
  { key: "careers", path: "/careers", label: "Careers" },
  { key: "privacy", path: "/privacy", label: "Privacy" },
  { key: "cookies", path: "/cookies", label: "Cookies" },
  { key: "terms", path: "/terms", label: "Terms" },
] as const;

export type PageSeoKey = (typeof PAGE_SEO_PAGES)[number]["key"];

export const PAGE_SEO_KEY_SET = new Set<string>(PAGE_SEO_PAGES.map((page) => page.key));
