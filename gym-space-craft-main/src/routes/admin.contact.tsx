import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdminSession } from "@/hooks/use-admin-session";
import { adminApi } from "@/lib/admin-api";
import { DEFAULT_CONTACT, type ContactSettings } from "@/lib/contact";

export const Route = createFileRoute("/admin/contact")({
  head: () => ({
    meta: [
      { title: "Contact Settings | Design Diaries" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminContactPage,
});

const fields = [
  { name: "email", label: "Email", type: "email", placeholder: "designdiariesbysagrika@gmail.com" },
  { name: "phone", label: "Phone", type: "tel", placeholder: "+91 96224 34242" },
  { name: "whatsapp", label: "WhatsApp", type: "tel", placeholder: "+91 96224 34242" },
  { name: "instagram", label: "Instagram", type: "text", placeholder: "https://www.instagram.com/designdiaries_by_sagrika_" },
  { name: "linkedin", label: "LinkedIn", type: "text", placeholder: "https://linkedin.com/company/studio" },
] as const;

function AdminContactPage() {
  const { admin, loading, logout } = useAdminSession({ required: true });
  const [values, setValues] = useState<ContactSettings>(DEFAULT_CONTACT);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!admin) return;
    adminApi
      .getContactSettings()
      .then((res) => setValues({ ...DEFAULT_CONTACT, ...res.settings }))
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load settings"));
  }, [admin]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await adminApi.updateContactSettings(values);
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
      <section className="mx-auto max-w-[40rem] px-5 py-16 md:px-10">
        <p className="label-caps text-primary">CMS</p>
        <h1 className="display-lg mt-4">Contact Settings</h1>
        <p className="mt-4 text-muted-foreground">
          These details update email, phone, WhatsApp, Instagram and LinkedIn links across the website.
        </p>

        <form onSubmit={onSubmit} className="mt-12 space-y-8">
          {fields.map((field) => (
            <label key={field.name} className="block">
              <span className="label-caps text-muted-foreground">{field.label}</span>
              <input
                required
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                value={values[field.name]}
                onChange={(event) =>
                  setValues((current) => ({ ...current, [field.name]: event.target.value }))
                }
                className="mt-2 w-full border-b border-input bg-transparent py-3 text-base outline-none transition-colors focus:border-primary"
              />
            </label>
          ))}

          {error && <p className="text-sm text-destructive">{error}</p>}
          {saved && <p className="text-sm text-muted-foreground">Saved. The website will use these details now.</p>}

          <button
            type="submit"
            disabled={saving}
            className="label-caps bg-primary px-7 py-4 text-primary-foreground transition-colors hover:bg-foreground disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </section>
    </AdminShell>
  );
}
