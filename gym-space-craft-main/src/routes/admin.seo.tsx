import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { SeoFields } from "@/components/admin/SeoFields";
import { useAdminSession } from "@/hooks/use-admin-session";
import { adminApi, type AdminRedirect } from "@/lib/admin-api";
import { PAGE_SEO_DEFAULTS, PAGE_SEO_PAGES, type PageSeoRecord } from "@/lib/page-seo";

export const Route = createFileRoute("/admin/seo")({
  head: () => ({
    meta: [
      { title: "SEO | Design Diaries" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminSeoPage,
});

function emptyPage(key: string, path: string): PageSeoRecord {
  return { key, path, seoTitle: "", seoDescription: "", seoKeywords: "", seoCanonical: "" };
}

function AdminSeoPage() {
  const { admin, loading, logout } = useAdminSession({ required: true });
  const [pages, setPages] = useState<Record<string, PageSeoRecord>>({});
  const [redirects, setRedirects] = useState<AdminRedirect[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [openKey, setOpenKey] = useState<string>("home");
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [savingRedirect, setSavingRedirect] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const catalog = useMemo(
    () =>
      PAGE_SEO_PAGES.map((page) => pages[page.key] || emptyPage(page.key, page.path)),
    [pages],
  );

  async function refresh() {
    const [pageRes, redirectRes] = await Promise.all([adminApi.listPageSeo(), adminApi.listRedirects()]);
    const next: Record<string, PageSeoRecord> = {};
    for (const page of pageRes.pages) next[page.key] = page;
    setPages(next);
    setRedirects(redirectRes.redirects);
  }

  useEffect(() => {
    if (!admin) return;
    refresh().catch((err) => setError(err instanceof Error ? err.message : "Could not load SEO"));
  }, [admin]);

  function setPageField(key: string, field: "seoTitle" | "seoDescription" | "seoKeywords" | "seoCanonical", value: string) {
    setPages((current) => {
      const page = current[key] || emptyPage(key, PAGE_SEO_PAGES.find((item) => item.key === key)?.path || "/");
      return { ...current, [key]: { ...page, [field]: value } };
    });
  }

  async function savePage(key: string) {
    const page = pages[key];
    if (!page || savingKey) return;
    setSavingKey(key);
    setError(null);
    setSaved(null);
    try {
      const res = await adminApi.updatePageSeo(key, {
        seoTitle: page.seoTitle || "",
        seoDescription: page.seoDescription || "",
        seoKeywords: page.seoKeywords || "",
        seoCanonical: page.seoCanonical || "",
      });
      setPages((current) => ({ ...current, [key]: res.page }));
      setSaved(`${PAGE_SEO_PAGES.find((item) => item.key === key)?.label || key} search listing saved.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save page SEO");
    } finally {
      setSavingKey(null);
    }
  }

  async function addRedirect() {
    if (savingRedirect) return;
    setSavingRedirect(true);
    setError(null);
    setSaved(null);
    try {
      const res = await adminApi.createRedirect({ from, to, enabled: true });
      setRedirects((current) => [...current, res.redirect].sort((a, b) => a.from.localeCompare(b.from)));
      setFrom("");
      setTo("");
      setSaved("Redirect added.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add redirect");
    } finally {
      setSavingRedirect(false);
    }
  }

  async function toggleRedirect(item: AdminRedirect) {
    try {
      const res = await adminApi.updateRedirect(item.id, { enabled: !item.enabled });
      setRedirects((current) => current.map((row) => (row.id === item.id ? res.redirect : row)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update redirect");
    }
  }

  async function removeRedirect(item: AdminRedirect) {
    if (!window.confirm(`Remove redirect from ${item.from}?`)) return;
    try {
      await adminApi.deleteRedirect(item.id);
      setRedirects((current) => current.filter((row) => row.id !== item.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete redirect");
    }
  }

  if (loading || !admin) {
    return <div className="min-h-svh bg-background" />;
  }

  return (
    <AdminShell admin={admin} onLogout={() => void logout()}>
      <section className="mx-auto max-w-[52rem] px-5 py-16 md:px-10">
        <p className="label-caps text-primary">CMS</p>
        <h1 className="display-lg mt-4">SEO</h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Search titles, descriptions and exact 301 redirects. Empty fields keep the live titles. Page design does not change.
        </p>

        {error && <p className="mt-6 text-sm text-destructive">{error}</p>}
        {saved && <p className="mt-6 text-sm text-muted-foreground">{saved}</p>}

        <div className="mt-12 space-y-4">
          {catalog.map((page) => {
            const meta = PAGE_SEO_PAGES.find((item) => item.key === page.key);
            const open = openKey === page.key;
            return (
              <div key={page.key} className="border border-border">
                <button
                  type="button"
                  onClick={() => setOpenKey(open ? "" : page.key)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span>
                    <span className="font-medium">{meta?.label || page.key}</span>
                    <span className="ml-3 text-sm text-muted-foreground">{page.path}</span>
                  </span>
                  <span className="label-caps text-muted-foreground">{open ? "Hide" : "Edit"}</span>
                </button>
                {open ? (
                  <div className="space-y-6 border-t border-border px-5 py-6">
                    <p className="text-sm text-muted-foreground">
                      Current title: {PAGE_SEO_DEFAULTS[page.path]?.title}
                    </p>
                    <SeoFields
                      path={page.path}
                      title={page.seoTitle || ""}
                      description={page.seoDescription || ""}
                      keywords={page.seoKeywords || ""}
                      canonical={page.seoCanonical || ""}
                      onChange={(field, value) => setPageField(page.key, field, value)}
                    />
                    <button
                      type="button"
                      onClick={() => void savePage(page.key)}
                      disabled={savingKey === page.key}
                      className="label-caps bg-primary px-7 py-4 text-primary-foreground transition-colors hover:bg-foreground disabled:opacity-60"
                    >
                      {savingKey === page.key ? "Saving" : "Save this page"}
                    </button>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="mt-16 border border-border p-6 md:p-8">
          <h2 className="font-display text-2xl uppercase">301 Redirects</h2>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">
            Exact paths only. Home and admin cannot be redirected. If the API is down, redirects are skipped so the site still loads.
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <label className="block">
              <span className="label-caps text-muted-foreground">From</span>
              <input
                value={from}
                onChange={(event) => setFrom(event.target.value)}
                placeholder="/old-page"
                className="mt-2 w-full border-b border-input bg-transparent py-3 outline-none focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="label-caps text-muted-foreground">To</span>
              <input
                value={to}
                onChange={(event) => setTo(event.target.value)}
                placeholder="/work"
                className="mt-2 w-full border-b border-input bg-transparent py-3 outline-none focus:border-primary"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={() => void addRedirect()}
            disabled={savingRedirect}
            className="label-caps mt-6 bg-primary px-7 py-4 text-primary-foreground transition-colors hover:bg-foreground disabled:opacity-60"
          >
            {savingRedirect ? "Adding" : "Add redirect"}
          </button>

          <ul className="mt-8 space-y-3">
            {redirects.length === 0 ? (
              <li className="text-sm text-muted-foreground">No redirects yet.</li>
            ) : (
              redirects.map((item) => (
                <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 border border-border px-4 py-3">
                  <p className="text-sm">
                    <span className="font-medium">{item.from}</span>
                    <span className="text-muted-foreground"> → {item.to}</span>
                  </p>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => void toggleRedirect(item)} className="label-caps text-xs text-muted-foreground hover:text-primary">
                      {item.enabled ? "On" : "Off"}
                    </button>
                    <button type="button" onClick={() => void removeRedirect(item)} className="label-caps text-xs text-destructive">
                      Remove
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>
    </AdminShell>
  );
}
