import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { GripVertical, ImageIcon, ImagePlus, Trash2, X } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdminSession } from "@/hooks/use-admin-session";
import { adminApi, type Recognition } from "@/lib/admin-api";
import { compressImage } from "@/lib/compress-image";

export const Route = createFileRoute("/admin/recognition")({
  head: () => ({
    meta: [
      { title: "Recognition | Design Diaries" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminRecognitionPage,
});

const CATEGORIES = ["Publication", "Award", "Event"] as const;

type FormState = {
  title: string;
  category: string;
  year: string;
  description: string;
  link: string;
};

const EMPTY_FORM: FormState = {
  title: "",
  category: "Award",
  year: "",
  description: "",
  link: "/about#recognition",
};

type ExtraSlot = {
  id: string;
  originalUrl: string;
  preview: string;
  file?: File;
};

function isVideoSrc(url: string, file?: File) {
  if (file?.type.startsWith("video/")) return true;
  return /\.(mp4|webm|mov)(\?|$)/i.test(url) || url.includes("/video/upload/");
}

function newSlotId() {
  return `slot-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function AdminRecognitionPage() {
  const { admin, loading, logout } = useAdminSession({ required: true });
  const [items, setItems] = useState<Recognition[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [extraSlots, setExtraSlots] = useState<ExtraSlot[]>([]);
  const [saving, setSaving] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewer, setViewer] = useState<{ src: string; name: string } | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [orderDirty, setOrderDirty] = useState(false);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const replaceSlotIdRef = useRef<string | null>(null);

  async function refresh() {
    const res = await adminApi.listRecognitions();
    setItems(res.items);
    setOrderDirty(false);
  }

  useEffect(() => {
    if (!admin) return;
    refresh().catch((err) => setError(err instanceof Error ? err.message : "Could not load recognition"));
  }, [admin]);

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setImageFile(null);
    setImagePreview("");
    setExtraSlots([]);
    setShowForm(false);
  }

  function startCreate() {
    resetForm();
    setError(null);
    setSaved(null);
    setShowForm(true);
  }

  function startEdit(item: Recognition) {
    setForm({
      title: item.title,
      category: item.category,
      year: item.year,
      description: item.description || "",
      link: item.link || "/about#recognition",
    });
    setEditingId(item.id);
    setImageFile(null);
    setImagePreview(item.imageUrl);
    setExtraSlots(
      item.images.map((image, index) => ({
        id: `${image.url}-${index}`,
        originalUrl: image.url,
        preview: image.url,
      })),
    );
    setError(null);
    setSaved(null);
    setShowForm(true);
  }

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function pickReplacement(id: string) {
    replaceSlotIdRef.current = id;
    window.setTimeout(() => replaceInputRef.current?.click(), 0);
  }

  function onReplaceFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    const slotId = replaceSlotIdRef.current;
    event.target.value = "";
    if (!file || !slotId) return;
    const preview = URL.createObjectURL(file);
    setExtraSlots((current) =>
      current.map((slot) => (slot.id === slotId ? { ...slot, file, preview, originalUrl: "" } : slot)),
    );
    replaceSlotIdRef.current = null;
  }

  function addExtraFiles(files: File[]) {
    if (!files.length) return;
    setExtraSlots((current) => [
      ...current,
      ...files.map((file) => ({
        id: newSlotId(),
        originalUrl: "",
        preview: URL.createObjectURL(file),
        file,
      })),
    ]);
  }

  async function save() {
    if (saving) return;
    setSaving(true);
    setError(null);
    setSaved(null);
    try {
      if (form.title.trim().length < 2) throw new Error("Enter the recognition title");
      if (form.category.trim().length < 2) throw new Error("Enter the category");
      if (!editingId && !imageFile) throw new Error("Please upload a recognition photo");

      const data = new FormData();
      data.set("title", form.title);
      data.set("category", form.category);
      data.set("year", form.year);
      data.set("description", form.description);
      data.set("link", form.link || "/about#recognition");
      if (extraSlots.length) {
        const extraOrder: string[] = [];
        const newFiles: File[] = [];
        for (const slot of extraSlots) {
          if (slot.file) {
            extraOrder.push("__file__");
            newFiles.push(await compressImage(slot.file));
          } else if (slot.originalUrl) {
            extraOrder.push(slot.originalUrl);
          }
        }
        data.set("extraOrder", JSON.stringify(extraOrder));
        newFiles.forEach((file) => data.append("images", file));
      } else {
        data.set("extraOrder", JSON.stringify([]));
      }
      if (imageFile) data.set("image", await compressImage(imageFile));

      const res = editingId
        ? await adminApi.updateRecognition(editingId, data)
        : await adminApi.createRecognition(data);

      const savedItem = res.item;
      setImageFile(null);
      if (savedItem) {
        setEditingId(savedItem.id);
        setForm({
          title: savedItem.title,
          category: savedItem.category,
          year: savedItem.year,
          description: savedItem.description || "",
          link: savedItem.link || "/about#recognition",
        });
        setImagePreview(savedItem.imageUrl);
        setExtraSlots(
          savedItem.images.map((image, index) => ({
            id: `${image.url}-${index}`,
            originalUrl: image.url,
            preview: image.url,
          })),
        );
        setShowForm(true);
      } else {
        resetForm();
      }
      setSaved(res.message || "Saved. Homepage and About will use this card.");
      await refresh().catch(() => undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save recognition");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(item: Recognition) {
    if (!window.confirm(`Delete ${item.title}?`)) return;
    setError(null);
    setSaved(null);
    try {
      await adminApi.deleteRecognition(item.id);
      if (editingId === item.id) resetForm();
      await refresh();
      setSaved("Recognition deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete recognition");
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
      const res = await adminApi.reorderRecognitions(
        items.map((item, index) => ({ id: item.id, sortOrder: index + 1 })),
      );
      setItems(res.items);
      setOrderDirty(false);
      setSaved("Order saved. Homepage and About will use this sequence.");
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
            <h1 className="display-lg">Recognition</h1>
            <p className="mt-4 max-w-xl text-muted-foreground">
              These cards appear on the homepage Recognition carousel and the About page Awards list. Drag to reorder, then save.
            </p>
          </div>
          <button
            type="button"
            onClick={startCreate}
            className="label-caps bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-foreground"
          >
            + Add Recognition
          </button>
        </div>

        {error && <p className="mt-6 text-sm text-destructive">{error}</p>}
        {saved && <p className="mt-6 text-sm text-muted-foreground">{saved}</p>}

        {showForm && (
          <form
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              void save();
            }}
            className="mt-10 space-y-8 border border-border p-6 md:p-8"
          >
            <h2 className="font-display text-2xl uppercase">{editingId ? "Edit recognition" : "Add recognition"}</h2>
            <label className="block">
              <span className="label-caps text-muted-foreground">Title</span>
              <input
                value={form.title}
                onChange={(event) => setField("title", event.target.value)}
                className="mt-2 w-full border-b border-input bg-transparent py-3 outline-none focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="label-caps text-muted-foreground">Supporting copy</span>
              <textarea
                value={form.description}
                onChange={(event) => setField("description", event.target.value)}
                rows={3}
                className="mt-2 w-full resize-y border-b border-input bg-transparent py-3 outline-none focus:border-primary"
                placeholder="Shown under the title, above View recognition"
              />
            </label>
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className="label-caps text-muted-foreground">Category</span>
                <select
                  value={form.category}
                  onChange={(event) => setField("category", event.target.value)}
                  className="mt-2 w-full border-b border-input bg-transparent py-3 outline-none focus:border-primary"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="label-caps text-muted-foreground">Year</span>
                <input
                  value={form.year}
                  onChange={(event) => setField("year", event.target.value)}
                  className="mt-2 w-full border-b border-input bg-transparent py-3 outline-none focus:border-primary"
                />
              </label>
            </div>
            <label className="block">
              <span className="label-caps text-muted-foreground">Link</span>
              <input
                value={form.link}
                onChange={(event) => setField("link", event.target.value)}
                className="mt-2 w-full border-b border-input bg-transparent py-3 outline-none focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="label-caps text-muted-foreground">Main Photo</span>
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
                onClick={() => setViewer({ src: imagePreview, name: form.title || "Photo" })}
                className="block"
              >
                <img src={imagePreview} alt="" className="h-28 w-36 object-cover" />
                <span className="label-caps mt-2 inline-block text-primary">View photo</span>
              </button>
            )}
            <div className="block">
              <span className="label-caps text-muted-foreground">More Photos / Videos</span>
              <input
                type="file"
                multiple
                accept="image/*,video/mp4,video/webm,video/quicktime"
                onChange={(event) => {
                  addExtraFiles(Array.from(event.target.files ?? []));
                  event.target.value = "";
                }}
                className="mt-3 block w-full text-sm"
              />
              <input
                ref={replaceInputRef}
                type="file"
                accept="image/*,video/mp4,video/webm,video/quicktime"
                className="hidden"
                onChange={onReplaceFile}
              />
            </div>
            {extraSlots.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {extraSlots.map((slot) => (
                  <div key={slot.id} className="relative h-20 w-24 overflow-hidden border border-border">
                    <button
                      type="button"
                      onClick={() => setViewer({ src: slot.preview, name: form.title || "Photo" })}
                      className="block h-full w-full"
                    >
                      {isVideoSrc(slot.preview, slot.file) ? (
                        <video src={slot.preview} muted playsInline className="h-full w-full object-cover" />
                      ) : (
                        <img src={slot.preview} alt="" className="h-full w-full object-cover" />
                      )}
                    </button>
                    <div className="absolute top-1 right-1 flex flex-col gap-1">
                      <button
                        type="button"
                        aria-label="Replace photo"
                        title="Replace"
                        onClick={() => pickReplacement(slot.id)}
                        className="bg-foreground/80 p-1 text-background transition-colors hover:bg-primary hover:text-primary-foreground"
                      >
                        <ImagePlus size={12} />
                      </button>
                      <button
                        type="button"
                        aria-label="Remove photo"
                        title="Remove"
                        onClick={() => setExtraSlots((current) => current.filter((item) => item.id !== slot.id))}
                        className="bg-foreground/80 p-1 text-background transition-colors hover:bg-destructive hover:text-white"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void save()}
                disabled={saving}
                className="label-caps bg-primary px-7 py-4 text-primary-foreground transition-colors hover:bg-foreground disabled:opacity-60"
              >
                {saving ? "Saving…" : editingId ? "Save Changes" : "Save Recognition"}
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
              <p className="label-caps text-primary">No recognition yet</p>
              <p className="mt-3 text-muted-foreground">Add the first award, publication or event card.</p>
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
                      aria-label={`View ${item.title}`}
                      onClick={() => setViewer({ src: item.imageUrl, name: item.title })}
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
                    <span className="block font-medium">{item.title}</span>
                    <span className="label-caps text-[0.65rem] text-muted-foreground">
                      {item.category} · {item.year}
                    </span>
                    {item.description ? (
                      <span className="mt-1 block truncate text-sm text-muted-foreground">{item.description}</span>
                    ) : null}
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
      </section>

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
            {isVideoSrc(viewer.src) ? (
              <video src={viewer.src} controls autoPlay playsInline className="max-h-[70svh] max-w-full" />
            ) : (
              <img src={viewer.src} alt={viewer.name} className="max-h-[70svh] max-w-full object-contain" />
            )}
            <figcaption className="label-caps mt-4 text-center">{viewer.name}</figcaption>
          </figure>
        </div>
      )}
    </AdminShell>
  );
}
