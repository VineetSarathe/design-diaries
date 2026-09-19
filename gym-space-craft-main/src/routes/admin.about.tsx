import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdminSession } from "@/hooks/use-admin-session";
import { adminApi } from "@/lib/admin-api";
import { DEFAULT_ABOUT, type AboutSettings } from "@/lib/about";
import { InstagramFeedCms } from "@/components/admin/InstagramFeedCms";

export const Route = createFileRoute("/admin/about")({
  head: () => ({
    meta: [
      { title: "About Settings | Design Diaries" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminAboutPage,
});

function AdminAboutPage() {
  const { admin, loading, logout } = useAdminSession({ required: true });
  const [values, setValues] = useState<AboutSettings>(DEFAULT_ABOUT);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!admin) return;
    adminApi
      .getAboutSettings()
      .then((res) => setValues({ ...DEFAULT_ABOUT, ...res.settings }))
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load settings"));
  }, [admin]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await adminApi.updateAboutSettings(values);
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
        <h1 className="display-lg mt-4">About Settings</h1>
        <p className="mt-4 text-muted-foreground">
          These details update the About page heading, description, mission and vision. Layout stays
          the same. All over the social media reels are edited below.
        </p>

        <form onSubmit={onSubmit} className="mt-12 space-y-10">
          <label className="block">
            <span className="label-caps text-muted-foreground">About Heading</span>
            <input
              required
              value={values.heading}
              onChange={(event) => setValues((current) => ({ ...current, heading: event.target.value }))}
              className="mt-2 w-full border-b border-input bg-transparent py-3 outline-none focus:border-primary"
            />
          </label>
          <label className="block">
            <span className="label-caps text-muted-foreground">About Description</span>
            <textarea
              required
              rows={4}
              value={values.description}
              onChange={(event) =>
                setValues((current) => ({ ...current, description: event.target.value }))
              }
              className="mt-2 w-full border-b border-input bg-transparent py-3 outline-none focus:border-primary"
            />
          </label>
          <label className="block">
            <span className="label-caps text-muted-foreground">Mission</span>
            <textarea
              required
              rows={3}
              value={values.mission}
              onChange={(event) => setValues((current) => ({ ...current, mission: event.target.value }))}
              className="mt-2 w-full border-b border-input bg-transparent py-3 outline-none focus:border-primary"
            />
          </label>
          <label className="block">
            <span className="label-caps text-muted-foreground">Vision</span>
            <textarea
              required
              rows={3}
              value={values.vision}
              onChange={(event) => setValues((current) => ({ ...current, vision: event.target.value }))}
              className="mt-2 w-full border-b border-input bg-transparent py-3 outline-none focus:border-primary"
            />
          </label>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {saved && <p className="text-sm text-muted-foreground">Saved. The About page will use this copy now.</p>}

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
          placement="about"
          label="All over the social media"
          heading="About reels"
          intro="Image and reel link. New cards go first. These reels appear only on the About page."
        />
      </section>
    </AdminShell>
  );
}
