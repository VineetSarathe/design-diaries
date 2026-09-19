import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdminSession } from "@/hooks/use-admin-session";
import { adminApi } from "@/lib/admin-api";
import { DEFAULT_HOMEPAGE, type HomepageSettings } from "@/lib/homepage";
import { cn } from "@/lib/utils";
import { InstagramFeedCms } from "@/components/admin/InstagramFeedCms";

export const Route = createFileRoute("/admin/home")({
  head: () => ({
    meta: [
      { title: "Homepage Settings | Design Diaries" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminHomeCmsPage,
});

function toggleSlug(list: string[], slug: string) {
  return list.includes(slug) ? list.filter((item) => item !== slug) : [...list, slug];
}

function AdminHomeCmsPage() {
  const { admin, loading, logout } = useAdminSession({ required: true });
  const [values, setValues] = useState<HomepageSettings>(DEFAULT_HOMEPAGE);
  const [projectOptions, setProjectOptions] = useState<{ slug: string; name: string; location: string; category: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!admin) return;
    adminApi
      .getHomepageSettings()
      .then((res) =>
        setValues({
          ...DEFAULT_HOMEPAGE,
          ...res.settings,
          featuredProjectSlugs: res.settings.featuredProjectSlugs ?? [],
          featuredBlogSlugs: res.settings.featuredBlogSlugs ?? [],
        }),
      )
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load settings"));
    adminApi
      .listProjects()
      .then((res) => setProjectOptions(res.projects))
      .catch(() => setProjectOptions([]));
  }, [admin]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await adminApi.updateHomepageSettings(values);
      setValues(res.settings);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save settings");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !admin) {
    return <div className="min-h-svh bg-background" />;
  }

  return (
    <AdminShell admin={admin} onLogout={() => void logout()}>
      <section className="mx-auto max-w-[52rem] px-5 py-16 md:px-10">
        <p className="label-caps text-primary">CMS</p>
        <h1 className="display-lg mt-4">Homepage Settings</h1>
        <p className="mt-4 text-muted-foreground">
          These details update the homepage hero, CTA, featured projects and Follow on Instagram.
          Labels and layout stay the same.
        </p>

        <form onSubmit={onSubmit} className="mt-12 space-y-10">
          <label className="block">
            <span className="label-caps text-muted-foreground">Hero Heading</span>
            <input
              required
              name="heroHeading"
              value={values.heroHeading}
              onChange={(event) =>
                setValues((current) => ({ ...current, heroHeading: event.target.value }))
              }
              className="mt-2 w-full border-b border-input bg-transparent py-3 text-base outline-none transition-colors focus:border-primary"
            />
          </label>

          <label className="block">
            <span className="label-caps text-muted-foreground">Hero Description</span>
            <textarea
              required
              name="heroDescription"
              rows={4}
              value={values.heroDescription}
              onChange={(event) =>
                setValues((current) => ({ ...current, heroDescription: event.target.value }))
              }
              className="mt-2 w-full resize-y border-b border-input bg-transparent py-3 text-base outline-none transition-colors focus:border-primary"
            />
          </label>

          <label className="block">
            <span className="label-caps text-muted-foreground">CTA Text</span>
            <input
              required
              name="ctaText"
              value={values.ctaText}
              onChange={(event) =>
                setValues((current) => ({ ...current, ctaText: event.target.value }))
              }
              className="mt-2 w-full border-b border-input bg-transparent py-3 text-base outline-none transition-colors focus:border-primary"
            />
          </label>

          <label className="block">
            <span className="label-caps text-muted-foreground">CTA Link</span>
            <input
              required
              name="ctaLink"
              placeholder="/contact"
              value={values.ctaLink}
              onChange={(event) =>
                setValues((current) => ({ ...current, ctaLink: event.target.value }))
              }
              className="mt-2 w-full border-b border-input bg-transparent py-3 text-base outline-none transition-colors focus:border-primary"
            />
          </label>

          <fieldset>
            <legend className="label-caps text-muted-foreground">Featured Projects</legend>
            <p className="mt-2 text-sm text-muted-foreground">
              Homepage par sirf selected projects dikhenge, selection order mein.
            </p>
            <ul className="mt-5 divide-y divide-border border-y border-border">
              {projectOptions.map((project) => {
                const checked = values.featuredProjectSlugs.includes(project.slug);
                return (
                  <li key={project.slug}>
                    <label className="flex cursor-pointer items-start gap-3 py-4">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          setValues((current) => ({
                            ...current,
                            featuredProjectSlugs: toggleSlug(current.featuredProjectSlugs, project.slug),
                          }))
                        }
                        className="mt-1 h-4 w-4 accent-primary"
                      />
                      <span>
                        <span className={cn("block font-display text-lg uppercase", checked && "text-primary")}>
                          {project.name}
                        </span>
                        <span className="mt-1 block text-sm text-muted-foreground">
                          {project.location} · {project.category}
                        </span>
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {saved && (
            <p className="text-sm text-muted-foreground">Saved. The homepage will use these details now.</p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="label-caps bg-primary px-7 py-4 text-primary-foreground transition-colors hover:bg-foreground disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </form>

        <InstagramFeedCms
          ready={Boolean(admin)}
          placement="home"
          label="Follow on Instagram"
          heading="Instagram cards"
          intro="These cards appear only on the homepage Follow on Instagram strip. New cards go first."
        />
      </section>
    </AdminShell>
  );
}
