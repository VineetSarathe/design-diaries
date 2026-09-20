import { PAGE_SEO_DEFAULTS } from "@/lib/page-seo";

function countHint(value: string, max: number) {
  const n = value.trim().length;
  return { n, over: n > max };
}

export function SeoFields({
  path,
  title,
  description,
  keywords,
  canonical,
  onChange,
}: {
  path?: string;
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  onChange: (field: "seoTitle" | "seoDescription" | "seoKeywords" | "seoCanonical", value: string) => void;
}) {
  const defaults = path ? PAGE_SEO_DEFAULTS[path] : undefined;
  const titleCount = countHint(title, 60);
  const descCount = countHint(description, 160);
  const previewTitle = title.trim() || defaults?.title || "Page title | Design Diaries";
  const previewDescription = description.trim() || defaults?.description || "Search result ke neeche ye short description dikhegi.";

  return (
    <div className="space-y-6 border border-border p-5">
      <div>
        <p className="label-caps text-primary">Search listing</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Empty fields keep the current site titles. Public page copy does not change.
        </p>
        <div className="mt-4 rounded-sm border border-border bg-card p-4">
          <p className="truncate text-sm font-medium text-foreground">{previewTitle}</p>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{previewDescription}</p>
        </div>
      </div>

      <label className="block">
        <span className="label-caps text-foreground">Google headline</span>
        <input
          value={title}
          onChange={(event) => onChange("seoTitle", event.target.value)}
          placeholder={defaults?.title || "Leave empty to keep the current title"}
          className="mt-2 w-full border-b border-input bg-transparent py-3 text-foreground outline-none focus:border-primary"
        />
        <p className={`mt-1 text-xs ${titleCount.over ? "text-destructive" : "text-muted-foreground"}`}>
          {titleCount.n ? `${titleCount.n}/60 characters — 50 to 60 best rehta hai` : "Khali hai to current title use hogi"}
        </p>
      </label>

      <label className="block">
        <span className="label-caps text-foreground">Short description</span>
        <textarea
          rows={3}
          value={description}
          onChange={(event) => onChange("seoDescription", event.target.value)}
          placeholder={defaults?.description || "Leave empty to keep the current description"}
          className="mt-2 w-full border-b border-input bg-transparent py-3 text-foreground outline-none focus:border-primary"
        />
        <p className={`mt-1 text-xs ${descCount.over ? "text-destructive" : "text-muted-foreground"}`}>
          {descCount.n ? `${descCount.n}/160 characters — 140 to 160 best rehta hai` : "Khali hai to current description use hogi"}
        </p>
      </label>

      <label className="block">
        <span className="label-caps text-foreground">Keywords</span>
        <input
          value={keywords}
          onChange={(event) => onChange("seoKeywords", event.target.value)}
          placeholder="gym interior design, Delhi, fitness studio"
          className="mt-2 w-full border-b border-input bg-transparent py-3 text-foreground outline-none focus:border-primary"
        />
      </label>

      <label className="block">
        <span className="label-caps text-foreground">Canonical URL</span>
        <input
          value={canonical}
          onChange={(event) => onChange("seoCanonical", event.target.value)}
          placeholder="Leave empty to use this page URL"
          className="mt-2 w-full border-b border-input bg-transparent py-3 text-foreground outline-none focus:border-primary"
        />
      </label>
    </div>
  );
}
