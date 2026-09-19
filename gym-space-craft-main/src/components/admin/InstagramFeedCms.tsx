import { useEffect, useState } from "react";
import { GripVertical, ImageIcon, X } from "lucide-react";
import { adminApi, type InstagramCard } from "@/lib/admin-api";
import { compressImage } from "@/lib/compress-image";

type FormState = {
  link: string;
};

const EMPTY_FORM: FormState = {
  link: "",
};

export function InstagramFeedCms({
  ready,
  placement,
  label,
  heading,
  intro,
  standalone = false,
}: {
  ready: boolean;
  placement: "home" | "work" | "about" | "resources" | "services";
  label: string;
  heading: string;
  intro: string;
  standalone?: boolean;
}) {
  const [items, setItems] = useState<InstagramCard[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewer, setViewer] = useState<{ src: string; name: string } | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [orderDirty, setOrderDirty] = useState(false);

  async function refresh() {
    const res = await adminApi.listInstagramFeed(placement);
    setItems(res.items);
    setOrderDirty(false);
  }

  useEffect(() => {
    if (!ready) return;
    refresh().catch((err) => setError(err instanceof Error ? err.message : "Could not load Instagram cards"));
  }, [ready, placement]);

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setImageFile(null);
    setImagePreview("");
    setShowForm(false);
  }

  function startCreate() {
    resetForm();
    setError(null);
    setSaved(null);
    setShowForm(true);
  }

  function startEdit(item: InstagramCard) {
    setForm({ link: item.link });
    setEditingId(item.id);
    setImageFile(null);
    setImagePreview(item.imageUrl);
    setError(null);
    setSaved(null);
    setShowForm(true);
  }

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function save() {
    if (saving) return;
    setSaving(true);
    setError(null);
    setSaved(null);
    try {
      if (form.link.trim().length < 8) throw new Error("Enter the Instagram reel link");
      if (!editingId && !imageFile) throw new Error("Please upload an image");

      const data = new FormData();
      data.set("link", form.link);
      data.set("placement", placement);
      if (imageFile) data.set("image", await compressImage(imageFile));

      const res = editingId
        ? await adminApi.updateInstagramCard(editingId, data)
        : await adminApi.createInstagramCard(data);

      const savedItem = res.item;
      setImageFile(null);
      if (savedItem) startEdit(savedItem);
      else resetForm();
      setSaved(res.message || "Saved. This Instagram card is live.");
      await refresh().catch(() => undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save Instagram card");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(item: InstagramCard) {
    if (!window.confirm("Delete this Instagram reel?")) return;
    setError(null);
    setSaved(null);
    try {
      await adminApi.deleteInstagramCard(item.id);
      if (editingId === item.id) resetForm();
      await refresh();
      setSaved("Instagram card deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete Instagram card");
    }
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
      const res = await adminApi.reorderInstagramFeed(
        items.map((item, index) => ({ id: item.id, sortOrder: index + 1 })),
      );
      setItems(res.items);
      setOrderDirty(false);
      setSaved("Order saved. This sequence is live.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save order");
    } finally {
      setSavingOrder(false);
    }
  }

  return (
    <div className={standalone ? "" : "mt-16 border-t border-border pt-12"}>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="label-caps text-primary">{label}</p>
          <h2 className="display-lg mt-4">{heading}</h2>
          <p className="mt-4 max-w-xl text-muted-foreground">{intro}</p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="label-caps bg-primary px-7 py-4 text-primary-foreground transition-colors hover:bg-foreground"
        >
          + Add Card
        </button>
      </div>

      {error && <p className="mt-6 text-sm text-destructive">{error}</p>}
      {saved && <p className="mt-6 text-sm text-muted-foreground">{saved}</p>}

      {showForm && (
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void save();
          }}
          className="mt-10 space-y-8 border border-border p-6 md:p-8"
        >
          <h3 className="font-display text-2xl uppercase">{editingId ? "Edit card" : "Add card"}</h3>
          <label className="block">
            <span className="label-caps text-muted-foreground">Reel link</span>
            <input
              value={form.link}
              onChange={(event) => setField("link", event.target.value)}
              placeholder="https://www.instagram.com/reel/..."
              className="mt-2 w-full border-b border-input bg-transparent py-3 outline-none focus:border-primary"
            />
          </label>
          <label className="block">
            <span className="label-caps text-muted-foreground">Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const next = event.target.files?.[0] ?? null;
                setImageFile(next);
                setImagePreview(
                  next
                    ? URL.createObjectURL(next)
                    : editingId
                      ? items.find((item) => item.id === editingId)?.imageUrl || ""
                      : "",
                );
              }}
              className="mt-3 block w-full text-sm"
            />
          </label>
          {imagePreview && (
            <button
              type="button"
              onClick={() => setViewer({ src: imagePreview, name: "Instagram reel" })}
              className="block"
            >
              <img src={imagePreview} alt="" className="h-28 w-44 object-cover" />
              <span className="label-caps mt-2 inline-block text-primary">View photo</span>
            </button>
          )}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void save()}
              disabled={saving}
              className="label-caps bg-primary px-7 py-4 text-primary-foreground transition-colors hover:bg-foreground disabled:opacity-60"
            >
              {saving ? "Saving…" : editingId ? "Save Changes" : "Save Card"}
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
            <p className="label-caps text-primary">No cards yet</p>
            <p className="mt-3 text-muted-foreground">
              {placement === "work"
                ? "Add the first Work page reel."
                : placement === "about"
                  ? "Add the first About page reel."
                  : placement === "resources"
                    ? "Add the first Resources page reel."
                    : placement === "services"
                      ? "Add the first Services page reel."
                      : "Add the first Instagram card for the homepage."}
            </p>
          </div>
        ) : (
          <ul>
            {items.map((item, index) => (
              <li
                key={item.id}
                draggable
                onDragStart={() => setDragId(item.id)}
                onDragOver={(event) => onDragOver(event, item.id)}
                onDragEnd={() => setDragId(null)}
                className="flex items-center gap-4 border-b border-border px-4 py-4 last:border-b-0"
              >
                <span className="cursor-grab text-muted-foreground" aria-hidden="true">
                  <GripVertical size={18} />
                </span>
                <span className="label-caps w-6 text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                {item.imageUrl ? (
                  <button
                    type="button"
                    aria-label="View Instagram reel"
                    onClick={() => setViewer({ src: item.imageUrl, name: "Instagram reel" })}
                    className="h-12 w-16 overflow-hidden border border-border bg-secondary"
                  >
                    <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
                  </button>
                ) : (
                  <span className="flex h-12 w-16 items-center justify-center text-muted-foreground">
                    <ImageIcon size={18} className="opacity-30" />
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{item.link || "No reel link yet"}</span>
                </span>
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

      {viewer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/70 p-5"
          onClick={() => setViewer(null)}
        >
          <button
            type="button"
            aria-label="Close photo"
            className="absolute top-5 right-5 p-2 text-background transition-colors hover:text-primary"
            onClick={() => setViewer(null)}
          >
            <X size={22} />
          </button>
          <figure className="max-h-[90svh] max-w-[90vw] bg-background p-8" onClick={(event) => event.stopPropagation()}>
            <img src={viewer.src} alt="" className="max-h-[70svh] max-w-full object-contain" />
          </figure>
        </div>
      )}
    </div>
  );
}
