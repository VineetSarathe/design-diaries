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
  { name: "instagram", label: "Instagram", type: "text", placeholder: "https://www.instagram.com/designdiaries_by_sagrika_?stkn=ZmkzMWY4MnNydnpu" },
  { name: "linkedin", label: "LinkedIn", type: "text", placeholder: "https://www.linkedin.com/in/designdiariesbysagrika" },
] as const;

function AdminContactPage() {
  const { admin, loading, logout } = useAdminSession({ required: true });
  const [values, setValues] = useState<ContactSettings>(DEFAULT_CONTACT);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");
  const [smtpConfigured, setSmtpConfigured] = useState(false);
  const [savingMail, setSavingMail] = useState(false);
  const [testingMail, setTestingMail] = useState(false);
  const [mailError, setMailError] = useState<string | null>(null);
  const [mailSaved, setMailSaved] = useState(false);
  const [mailTest, setMailTest] = useState<string | null>(null);

  useEffect(() => {
    if (!admin) return;
    adminApi
      .getContactSettings()
      .then((res) => setValues({ ...DEFAULT_CONTACT, ...res.settings }))
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load settings"));
    adminApi
      .getMailSettings()
      .then((res) => {
        setSmtpUser(res.settings.smtpUser);
        setSmtpConfigured(res.settings.configured);
      })
      .catch((err) => setMailError(err instanceof Error ? err.message : "Could not load mail settings"));
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

  async function onSaveMail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingMail(true);
    setMailError(null);
    setMailSaved(false);
    setMailTest(null);
    try {
      const res = await adminApi.updateMailSettings(smtpUser, smtpPass);
      setSmtpUser(res.settings.smtpUser);
      setSmtpConfigured(res.settings.configured);
      setSmtpPass("");
      setMailSaved(true);
    } catch (err) {
      setMailError(err instanceof Error ? err.message : "Could not save mail settings");
    } finally {
      setSavingMail(false);
    }
  }

  async function onTestMail() {
    setTestingMail(true);
    setMailError(null);
    setMailTest(null);
    try {
      const res = await adminApi.testMailSettings();
      setMailTest(`Test email sent to ${res.to}`);
    } catch (err) {
      setMailError(err instanceof Error ? err.message : "Could not send test email");
    } finally {
      setTestingMail(false);
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

        <form onSubmit={(event) => void onSaveMail(event)} className="mt-16 space-y-6 border-t border-border pt-12">
          <p className="label-caps text-primary">Thank-you email</p>
          <h2 className="font-display text-2xl uppercase">Gmail SMTP</h2>
          <p className="text-sm text-muted-foreground">
            Web3Forms only notifies the studio. To send a thank-you to the person who submits Start a
            Project, connect Gmail here. Turn on 2-Step Verification, then create an App Password at
            myaccount.google.com/apppasswords and paste it below.
          </p>
          {smtpConfigured && (
            <p className="text-sm text-muted-foreground">Gmail is connected. New project enquiries will receive a thank-you email.</p>
          )}
          <label className="block">
            <span className="label-caps text-muted-foreground">Gmail address</span>
            <input
              required
              type="email"
              value={smtpUser}
              onChange={(event) => setSmtpUser(event.target.value)}
              placeholder="designdiariesbysagrika@gmail.com"
              className="mt-2 w-full border-b border-input bg-transparent py-3 text-base outline-none transition-colors focus:border-primary"
            />
          </label>
          <label className="block">
            <span className="label-caps text-muted-foreground">
              App password {smtpConfigured ? "(leave blank to keep the saved one)" : ""}
            </span>
            <input
              required={!smtpConfigured}
              type="password"
              value={smtpPass}
              onChange={(event) => setSmtpPass(event.target.value)}
              autoComplete="new-password"
              placeholder="xxxx xxxx xxxx xxxx"
              className="mt-2 w-full border-b border-input bg-transparent py-3 text-base outline-none transition-colors focus:border-primary"
            />
          </label>
          {mailError && <p className="text-sm text-destructive">{mailError}</p>}
          {mailSaved && <p className="text-sm text-muted-foreground">Saved. Gmail can now send thank-you emails.</p>}
          {mailTest && <p className="text-sm text-muted-foreground">{mailTest}</p>}
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={savingMail}
              className="label-caps bg-primary px-7 py-4 text-primary-foreground transition-colors hover:bg-foreground disabled:opacity-60"
            >
              {savingMail ? "Checking Gmail…" : "Save Gmail SMTP"}
            </button>
            <button
              type="button"
              disabled={!smtpConfigured || testingMail}
              onClick={() => void onTestMail()}
              className="label-caps border border-input px-7 py-4 transition-colors hover:border-primary hover:text-primary disabled:opacity-60"
            >
              {testingMail ? "Sending…" : "Send test email"}
            </button>
          </div>
        </form>
      </section>
    </AdminShell>
  );
}
