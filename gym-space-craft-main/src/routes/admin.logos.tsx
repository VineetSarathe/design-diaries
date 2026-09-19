import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GripVertical, ImageIcon, X } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdminSession } from "@/hooks/use-admin-session";
import { adminApi, type ClientLogo } from "@/lib/admin-api";

export const Route = createFileRoute("/admin/logos")({
  head: () => ({
    meta: [
      { title: "Client Logos | Design Diaries" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLogosPage,
});

function AdminLogosPage() {
  const { admin, loading, logout } = useAdminSession({ required: true });
  const [items, setItems] = useState<ClientLogo[]>([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewer, setViewer] = useState<{ src: string; name: string } | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [orderDirty, setOrderDirty] = useState(false);

  async function refresh() {
    const res = await adminApi.listClientLogos();
    setItems(res.logos);
    setOrderDirty(false);
  }

  useEffect(() => {
    if (!admin) return;
    refresh().catch((err) => setError(err instanceof Error ? err.message : "Could not load logos"));
  }, [admin]);

  function resetForm() {
    setName("");
    setEditingId(null);
    setFile(null);
    setPreview("");
    setShowForm(false);
  }

  function startCreate() {
    setName("");
    setEditingId(null);
    setFile(null);
    setPreview("");
    setError(null);
    setSaved(null);
    setShowForm(true);
  }

  function startEdit(item: ClientLogo) {
    setName(item.name);
    setEditingId(item.id);
    setFile(null);
    setPreview(item.imageUrl);
    setError(null);
    setSaved(null);
    setShowForm(true);
  }

  function onPickFile(next: File | null) {
    setFile(next);
    if (!next) {
      setPreview(editingId ? items.find((item) => item.id === editingId)?.imageUrl || "" : "");
      return;
    }
    setPreview(URL.createObjectURL(next));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(null);
    try {
      if (!editingId && !file) throw new Error("Please upload a logo image");
      const data = new FormData();
      data.set("name", name);
      if (file) data.set("image", file);
      const res = editingId
        ? await adminApi.updateClientLogo(editingId, data)
        : await adminApi.createClientLogo(data);
      await refresh();
      resetForm();
      setSaved(res.message || "Saved. The website will use this logo now.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save logo");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(item: ClientLogo) {
    if (!window.confirm(`Delete the ${item.name} logo?`)) return;
    setError(null);
    setSaved(null);
    try {
      await adminApi.deleteClientLogo(item.id);
      if (editingId === item.id) resetForm();
      await refresh();
      setSaved("Logo deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete logo");
    }
  }

  function onDragStart(id: string) {
    setDragId(id);
  }

  function onDragOver(event: React.DragEvent<HTMLLIElement>, id: string) {
    event.preventDefault();
    if (!dragId || dragId === id) return;
    setItems((current) => {
      const from = current.findIndex((item) => item.id === dragId);
      const to = current.findIndex((item) => item.id === id);
      if (from < 0 || to < 0) return current;
      const next = [...current];
      const [moved] = next.splice(from, 1);
      if (!moved) return current;
      next.splice(to, 0, moved);
      return next;
    });
    setOrderDirty(true);
  }

  async function onSaveOrder() {
    setSavingOrder(true);
    setError(null);
    setSaved(null);
    try {
      const res = await adminApi.reorderClientLogos(
        items.map((item, index) => ({ id: item.id, sortOrder: index + 1 })),
      );
      setItems(res.logos);
      setOrderDirty(false);
      setSaved("Order saved. The website will use this sequence now.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save order");
    } finally {
      setSavingOrder(false);
    }
  }

  if (loading || !admin) {
    return <div className="min-h-svh bg-background" />;
  }

  return (
    <AdminShell admin={admin} onLogout={() => void logout()}>
      <section className="mx-auto max-w-[52rem] px-5 py-16 md:px-10">
        <p className="label-caps text-primary">CMS</p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1 className="display-lg">Client Logos</h1>
            <p className="mt-4 max-w-xl text-muted-foreground">
              These logos appear in the studio network strip. Drag to reorder, then save.
            </p>
          </div>
          <button
            type="button"
            onClick={startCreate}
            className="label-caps bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-foreground"
          >
            + Add Logo
          </button>
        </div>

        {error && <p className="mt-6 text-sm text-destructive">{error}</p>}
        {saved && <p className="mt-6 text-sm text-muted-foreground">{saved}</p>}

        {showForm && (
          <form onSubmit={onSubmit} className="mt-10 space-y-8 border border-border p-6 md:p-8">
            <h2 className="font-display text-2xl uppercase">{editingId ? "Edit logo" : "Add logo"}</h2>
            <label className="block">
              <span className="label-caps text-muted-foreground">Company / Partner Name</span>
              <input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2 w-full border-b border-input bg-transparent py-3 outline-none focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="label-caps text-muted-foreground">Logo Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => onPickFile(event.target.files?.[0] ?? null)}
                className="mt-3 block w-full text-sm"
              />
            </label>
            {preview && (
              <button type="button" onClick={() => setViewer({ src: preview, name: name || "Logo" })} className="block">
                <img src={preview} alt="" className="h-20 w-auto max-w-xs object-contain" />
                <span className="label-caps mt-2 inline-block text-primary">View logo</span>
              </button>
            )}
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="label-caps bg-primary px-7 py-4 text-primary-foreground transition-colors hover:bg-foreground disabled:opacity-60"
              >
                {saving ? "Saving…" : editingId ? "Save Changes" : "Save Logo"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="label-caps border border-input px-7 py-4 transition-colors hover:border-primary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="mt-12 border border-border">
          {items.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="label-caps text-primary">No logos yet</p>
              <p className="mt-3 text-muted-foreground">Add the first partner logo to show it on the website.</p>
            </div>
          ) : (
            <ul>
              {items.map((item, index) => (
                <li
                  key={item.id}
                  draggable
                  onDragStart={() => onDragStart(item.id)}
                  onDragOver={(event) => onDragOver(event, item.id)}
                  onDragEnd={() => setDragId(null)}
                  className="flex items-center gap-4 border-b border-border px-4 py-4 last:border-b-0"
                >
                  <span className="cursor-grab text-muted-foreground" aria-hidden="true">
                    <GripVertical size={18} />
                  </span>
                  <span className="label-caps w-6 text-muted-foreground">{index + 1}</span>
                  {item.imageUrl ? (
                    <button
                      type="button"
                      aria-label={`View ${item.name} logo`}
                      onClick={() => setViewer({ src: item.imageUrl, name: item.name })}
                      className="flex h-12 w-16 items-center justify-center border border-border bg-secondary p-1"
                    >
                      <img src={item.imageUrl} alt="" className="max-h-full max-w-full object-contain" />
                    </button>
                  ) : (
                    <span className="flex h-12 w-16 items-center justify-center text-muted-foreground">
                      <ImageIcon size={18} className="opacity-30" />
                    </span>
                  )}
                  <span className="flex-1 font-medium">{item.name}</span>
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    className="label-caps text-primary transition-colors hover:text-foreground"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => void onDelete(item)}
                    className="label-caps text-muted-foreground transition-colors hover:text-destructive"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 1 && (
          <button
            type="button"
            onClick={() => void onSaveOrder()}
            disabled={savingOrder || !orderDirty}
            className="label-caps mt-8 bg-primary px-7 py-4 text-primary-foreground transition-colors hover:bg-foreground disabled:opacity-50"
          >
            {savingOrder ? "Saving…" : "Save Order"}
          </button>
        )}
      </section>

      {viewer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/70 p-5"
          onClick={() => setViewer(null)}
        >
          <button
            type="button"
            aria-label="Close logo"
            className="absolute top-5 right-5 p-2 text-background transition-colors hover:text-primary"
            onClick={() => setViewer(null)}
          >
            <X size={22} />
          </button>
          <figure className="max-h-[90svh] max-w-[90vw] bg-background p-8" onClick={(event) => event.stopPropagation()}>
            <img src={viewer.src} alt={viewer.name} className="max-h-[70svh] max-w-full object-contain" />
            <figcaption className="label-caps mt-4 text-center">{viewer.name}</figcaption>
          </figure>
        </div>
      )}
    </AdminShell>
  );
}
