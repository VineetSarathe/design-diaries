import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdminSession } from "@/hooks/use-admin-session";
import { adminApi, type AdminAccount } from "@/lib/admin-api";

export const Route = createFileRoute("/admin/admins")({
  head: () => ({
    meta: [
      { title: "Admin Accounts | Design Diaries" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminAccountsPage,
});

type RowState = {
  email: string;
  password: string;
};

function AdminAccountsPage() {
  const { admin, loading, logout } = useAdminSession({ required: true });
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [max, setMax] = useState(5);
  const [rows, setRows] = useState<Record<string, RowState>>({});
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    if (!admin) return;
    adminApi
      .listAdminAccounts()
      .then((res) => {
        setAccounts(res.admins);
        setMax(res.max);
        setRows(
          Object.fromEntries(res.admins.map((item) => [item.id, { email: item.email, password: "" }])),
        );
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load admin accounts"));
  }, [admin]);

  async function saveAccount(id: string) {
    const row = rows[id];
    if (!row) return;
    setBusy(id);
    setError(null);
    try {
      const payload: { email?: string; password?: string } = {};
      const current = accounts.find((item) => item.id === id);
      if (current && row.email.trim().toLowerCase() !== current.email) {
        payload.email = row.email.trim().toLowerCase();
      }
      if (row.password) payload.password = row.password;
      if (!payload.email && !payload.password) return;
      const res = await adminApi.updateAdminAccount(id, payload);
      setAccounts((list) => list.map((item) => (item.id === id ? res.admin : item)));
      setRows((current) => ({
        ...current,
        [id]: { email: res.admin.email, password: "" },
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save admin");
    } finally {
      setBusy(null);
    }
  }

  async function addAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy("new");
    setError(null);
    try {
      const res = await adminApi.createAdminAccount(newEmail.trim().toLowerCase(), newPassword);
      setAccounts((list) => [...list, res.admin]);
      setRows((current) => ({
        ...current,
        [res.admin.id]: { email: res.admin.email, password: "" },
      }));
      setNewEmail("");
      setNewPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add admin");
    } finally {
      setBusy(null);
    }
  }

  async function removeAccount(id: string) {
    setBusy(id);
    setError(null);
    try {
      await adminApi.deleteAdminAccount(id);
      setAccounts((list) => list.filter((item) => item.id !== id));
      setRows((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not remove admin");
    } finally {
      setBusy(null);
    }
  }

  if (loading || !admin) {
    return <div className="min-h-svh bg-background" />;
  }

  const canAdd = accounts.length < max;

  return (
    <AdminShell admin={admin} onLogout={() => void logout()}>
      <section className="mx-auto max-w-[42rem] px-5 py-16 md:px-10">
        <p className="label-caps text-primary">Settings</p>
        <h1 className="display-lg mt-4">Admin accounts</h1>
        <p className="mt-4 text-muted-foreground">
          Up to {max} sign-in accounts. Passwords are never shown after saving — enter a new one only
          when you want to change it.
        </p>

        <ul className="mt-12 space-y-10">
          {accounts.map((item) => (
            <li key={item.id} className="space-y-4 border-b border-border pb-10">
              <label className="block">
                <span className="label-caps text-muted-foreground">Email</span>
                <input
                  type="email"
                  value={rows[item.id]?.email ?? item.email}
                  onChange={(event) =>
                    setRows((current) => ({
                      ...current,
                      [item.id]: {
                        email: event.target.value,
                        password: current[item.id]?.password ?? "",
                      },
                    }))
                  }
                  className="mt-2 w-full border-b border-input bg-transparent py-3 text-base outline-none transition-colors focus:border-primary"
                />
              </label>
              <label className="block">
                <span className="label-caps text-muted-foreground">New password (optional)</span>
                <input
                  type="password"
                  value={rows[item.id]?.password ?? ""}
                  onChange={(event) =>
                    setRows((current) => ({
                      ...current,
                      [item.id]: {
                        email: current[item.id]?.email ?? item.email,
                        password: event.target.value,
                      },
                    }))
                  }
                  autoComplete="new-password"
                  placeholder="Leave blank to keep current"
                  className="mt-2 w-full border-b border-input bg-transparent py-3 text-base outline-none transition-colors focus:border-primary"
                />
              </label>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={busy === item.id}
                  onClick={() => void saveAccount(item.id)}
                  className="label-caps bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-foreground disabled:opacity-60"
                >
                  {busy === item.id ? "Saving…" : "Save"}
                </button>
                <button
                  type="button"
                  disabled={busy === item.id || accounts.length <= 1}
                  onClick={() => void removeAccount(item.id)}
                  className="label-caps inline-flex items-center gap-2 border border-input px-6 py-3 transition-colors hover:border-destructive hover:text-destructive disabled:opacity-60"
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>

        {canAdd && (
          <form onSubmit={(event) => void addAccount(event)} className="mt-12 space-y-6 border-t border-border pt-12">
            <p className="label-caps text-primary">Add admin</p>
            <label className="block">
              <span className="label-caps text-muted-foreground">Email</span>
              <input
                required
                type="email"
                value={newEmail}
                onChange={(event) => setNewEmail(event.target.value)}
                placeholder="admin@gmail.com"
                className="mt-2 w-full border-b border-input bg-transparent py-3 text-base outline-none transition-colors focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="label-caps text-muted-foreground">Password</span>
              <input
                required
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                autoComplete="new-password"
                minLength={6}
                className="mt-2 w-full border-b border-input bg-transparent py-3 text-base outline-none transition-colors focus:border-primary"
              />
            </label>
            <button
              type="submit"
              disabled={busy === "new"}
              className="label-caps bg-primary px-7 py-4 text-primary-foreground transition-colors hover:bg-foreground disabled:opacity-60"
            >
              {busy === "new" ? "Adding…" : "Add admin"}
            </button>
          </form>
        )}

        {error && <p className="mt-6 text-sm text-destructive">{error}</p>}
      </section>
    </AdminShell>
  );
}
