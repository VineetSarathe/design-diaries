import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { GripVertical, ImageIcon, ImagePlus, Trash2, X } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdminSession } from "@/hooks/use-admin-session";
import { adminApi, type AdminProject } from "@/lib/admin-api";
import { PROJECT_CATEGORIES } from "@/lib/cms-project";
import { compressImage } from "@/lib/compress-image";
import { useProjects } from "@/hooks/use-projects";
import { SeoFields } from "@/components/admin/SeoFields";

export const Route = createFileRoute("/admin/projects")({
  head: () => ({
    meta: [
      { title: "Projects | Design Diaries" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminProjectsPage,
});

type FormState = {
  name: string;
  slug: string;
  category: string;
  cardLabel: string;
  location: string;
  area: string;
  year: string;
  clientType: string;
  insight: string;
  hideCardMeta: boolean;
  reviewQuote: string;
  reviewAuthor: string;
  reviewRole: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  seoCanonical: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  slug: "",
  category: "Gym Projects",
  cardLabel: "GYM INTERIOR",
  location: "",
  area: "",
  year: "",
  clientType: "",
  insight: "",
  hideCardMeta: true,
  reviewQuote: "",
  reviewAuthor: "",
  reviewRole: "",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  seoCanonical: "",
};

type ExtraSlot = {
  id: string;
  originalUrl: string;
  preview: string;
  file?: File;
};

const REQUIRED_PROJECT_IMAGE_WIDTH = 1010;
const REQUIRED_PROJECT_IMAGE_HEIGHT = 793;
const REQUIRED_PROJECT_IMAGE_LABEL = `${REQUIRED_PROJECT_IMAGE_WIDTH} × ${REQUIRED_PROJECT_IMAGE_HEIGHT}px`;
const CANVA_PROJECT_IMAGE_LABEL = "577 × 453px";

function newSlotId() {
  return `slot-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function isImageUpload(file: File) {
  return file.type.startsWith("image/");
}

function readImageSize(file: File) {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read the image size"));
    };
    image.src = url;
  });
}

async function assertProjectImageSize(file: File) {
  if (!isImageUpload(file)) return;
  const { width, height } = await readImageSize(file);
  if (width !== REQUIRED_PROJECT_IMAGE_WIDTH || height !== REQUIRED_PROJECT_IMAGE_HEIGHT) {
    throw new Error(
      `Use Canva size ${CANVA_PROJECT_IMAGE_LABEL}; exported file must be ${REQUIRED_PROJECT_IMAGE_LABEL}. This file is ${width} × ${height}px.`,
    );
  }
}

function AdminProjectsPage() {
  const { admin, loading, logout } = useAdminSession({ required: true });
  const { refreshProjects } = useProjects();
  const [items, setItems] = useState<AdminProject[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [slugTouched, setSlugTouched] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [cardFile, setCardFile] = useState<File | null>(null);
  const [cardPreview, setCardPreview] = useState("");
  const [extraSlots, setExtraSlots] = useState<ExtraSlot[]>([]);
  const [replaceSlotId, setReplaceSlotId] = useState<string | null>(null);
  const replaceSlotIdRef = useRef<string | null>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewer, setViewer] = useState<{ src: string; name: string } | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [orderDirty, setOrderDirty] = useState(false);

  async function refresh() {
    const res = await adminApi.listProjects();
    setItems(res.projects);
    setOrderDirty(false);
  }

  useEffect(() => {
    if (!admin) return;
    refresh().catch((err) => setError(err instanceof Error ? err.message : "Could not load projects"));
  }, [admin]);

  function resetForm() {
    setForm(EMPTY_FORM);
    setSlugTouched(false);
    setEditingId(null);
    setCardFile(null);
    setCardPreview("");
    setExtraSlots([]);
    setReplaceSlotId(null);
    setShowForm(false);
  }

  function startCreate() {
    setForm(EMPTY_FORM);
    setSlugTouched(false);
    setEditingId(null);
    setCardFile(null);
    setCardPreview("");
    setExtraSlots([]);
    setReplaceSlotId(null);
    setError(null);
    setSaved(null);
    setShowForm(true);
  }

  function startEdit(item: AdminProject) {
    setForm({
      name: item.name,
      slug: item.slug,
      category: item.category,
      cardLabel: item.cardLabel,
      location: item.location,
      area: item.area,
      year: item.year,
      clientType: item.clientType,
      insight: item.insight,
      hideCardMeta: item.hideCardMeta,
      reviewQuote: item.reviewQuote || "",
      reviewAuthor: item.reviewAuthor || "",
      reviewRole: item.reviewRole || "",
      seoTitle: item.seoTitle || "",
      seoDescription: item.seoDescription || "",
      seoKeywords: item.seoKeywords || "",
      seoCanonical: item.seoCanonical || "",
    });
    setSlugTouched(true);
    setEditingId(item.id);
    setCardFile(null);
    setCardPreview(item.cardUrl);
    setExtraSlots(
      item.images.map((image, index) => ({
        id: `${image.url}-${index}`,
        originalUrl: image.url,
        preview: image.url,
      })),
    );
    setReplaceSlotId(null);
    setError(null);
    setSaved(null);
    setShowForm(true);
  }

  function pickReplacement(id: string) {
    replaceSlotIdRef.current = id;
    setReplaceSlotId(id);
    window.setTimeout(() => replaceInputRef.current?.click(), 0);
  }

  async function onReplaceFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    const slotId = replaceSlotIdRef.current;
    event.target.value = "";
    if (!file || !slotId) return;
    setError(null);
    try {
      await assertProjectImageSize(file);
      const preview = URL.createObjectURL(file);
      setExtraSlots((current) =>
        current.map((slot) => (slot.id === slotId ? { ...slot, file, preview, originalUrl: "" } : slot)),
      );
      replaceSlotIdRef.current = null;
      setReplaceSlotId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Use Canva size ${CANVA_PROJECT_IMAGE_LABEL}; exported file must be ${REQUIRED_PROJECT_IMAGE_LABEL}.`);
    }
  }

  async function addExtraFiles(files: File[]) {
    if (!files.length) return;
    setError(null);
    try {
      await Promise.all(files.map(assertProjectImageSize));
      setExtraSlots((current) => [
        ...current,
        ...files.map((file) => ({
        id: newSlotId(),
        originalUrl: "",
        preview: URL.createObjectURL(file),
        file,
        })),
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Use Canva size ${CANVA_PROJECT_IMAGE_LABEL}; exported file must be ${REQUIRED_PROJECT_IMAGE_LABEL}.`);
    }
  }

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === "name" && !slugTouched) next.slug = slugify(String(value));
      return next;
    });
  }

  async function save() {
    if (saving) return;
    setSaving(true);
    setError(null);
    setSaved(null);
    try {
      if (form.name.trim().length < 2) throw new Error("Enter the project name");
      if (form.slug.trim().length < 2) throw new Error("Enter a valid project slug");
      if (form.insight.trim().length < 8) throw new Error("Enter the project description");
      if (!editingId && !cardFile) throw new Error("Please upload a project photo");

      const data = new FormData();
      data.set("name", form.name);
      data.set("slug", form.slug);
      data.set("category", form.category);
      data.set("cardLabel", form.cardLabel);
      data.set("location", form.location);
      data.set("area", form.area);
      data.set("year", form.year);
      data.set("clientType", form.clientType);
      data.set("insight", form.insight);
      data.set("reviewQuote", form.reviewQuote);
      data.set("reviewAuthor", form.reviewAuthor);
      data.set("reviewRole", form.reviewRole);
      data.set("seoTitle", form.seoTitle);
      data.set("seoDescription", form.seoDescription);
      data.set("seoKeywords", form.seoKeywords);
      data.set("seoCanonical", form.seoCanonical);
      data.set("hideCardMeta", String(form.hideCardMeta));
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
      if (cardFile) data.set("card", await compressImage(cardFile));

      const res = editingId
        ? await adminApi.updateProject(editingId, data)
        : await adminApi.createProject(data);

      const savedProject = res.project;
      setCardFile(null);
      setReplaceSlotId(null);
      if (savedProject) {
        setEditingId(savedProject.id);
        setForm({
          name: savedProject.name,
          slug: savedProject.slug,
          category: savedProject.category,
          cardLabel: savedProject.cardLabel,
          location: savedProject.location,
          area: savedProject.area,
          year: savedProject.year,
          clientType: savedProject.clientType,
          insight: savedProject.insight,
          hideCardMeta: savedProject.hideCardMeta,
          reviewQuote: savedProject.reviewQuote || "",
          reviewAuthor: savedProject.reviewAuthor || "",
          reviewRole: savedProject.reviewRole || "",
          seoTitle: savedProject.seoTitle || "",
          seoDescription: savedProject.seoDescription || "",
          seoKeywords: savedProject.seoKeywords || "",
          seoCanonical: savedProject.seoCanonical || "",
        });
        setCardPreview(savedProject.cardUrl);
        setExtraSlots(
          savedProject.images.map((image, index) => ({
            id: `${image.url}-${index}`,
            originalUrl: image.url,
            preview: image.url,
          })),
        );
        setShowForm(true);
      } else {
        resetForm();
      }
      setSaved(res.message || "Saved. This card will update everywhere it appears.");
      try {
        await Promise.all([refresh(), refreshProjects()]);
      } catch {
        // Project is already saved.
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save project");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(item: AdminProject) {
    if (!window.confirm(`Delete ${item.name}? It will be removed from every page.`)) return;
    setError(null);
    setSaved(null);
    try {
      await adminApi.deleteProject(item.id);
      if (editingId === item.id) resetForm();
      await Promise.all([refresh(), refreshProjects()]);
      setSaved("Project deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete project");
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
      const res = await adminApi.reorderProjects(
        items.map((item, index) => ({ id: item.id, sortOrder: index + 1 })),
      );
      setItems(res.projects);
      setOrderDirty(false);
      await refreshProjects();
      setSaved("Order saved. All project lists will use this sequence.");
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
            <h1 className="display-lg">Projects</h1>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Add, edit or remove a project card. The same details update on the homepage, Work
              listing, menus and case study pages. Each card's review also appears in Recognise the work.
            </p>
          </div>
          <button
            type="button"
            onClick={startCreate}
            className="label-caps bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-foreground"
          >
            + Add Project
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
            <h2 className="font-display text-2xl uppercase">{editingId ? "Edit project" : "Add project"}</h2>
            <label className="block">
              <span className="label-caps text-muted-foreground">Name</span>
              <input
                value={form.name}
                onChange={(event) => setField("name", event.target.value)}
                className="mt-2 w-full border-b border-input bg-transparent py-3 outline-none focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="label-caps text-muted-foreground">Slug</span>
              <input
                value={form.slug}
                onChange={(event) => {
                  setSlugTouched(true);
                  setField("slug", slugify(event.target.value));
                }}
                className="mt-2 w-full border-b border-input bg-transparent py-3 outline-none focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="label-caps text-muted-foreground">Category</span>
              <select
                value={form.category}
                onChange={(event) => setField("category", event.target.value)}
                className="mt-2 w-full border-b border-input bg-transparent py-3 outline-none focus:border-primary"
              >
                {PROJECT_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="label-caps text-muted-foreground">Card Label</span>
              <input
                value={form.cardLabel}
                onChange={(event) => setField("cardLabel", event.target.value)}
                className="mt-2 w-full border-b border-input bg-transparent py-3 outline-none focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="label-caps text-muted-foreground">Client / Type</span>
              <input
                value={form.clientType}
                onChange={(event) => setField("clientType", event.target.value)}
                className="mt-2 w-full border-b border-input bg-transparent py-3 outline-none focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="label-caps text-muted-foreground">Location</span>
              <input
                value={form.location}
                onChange={(event) => setField("location", event.target.value)}
                className="mt-2 w-full border-b border-input bg-transparent py-3 outline-none focus:border-primary"
              />
            </label>
            <div className="grid gap-8 sm:grid-cols-2">
              <label className="block">
                <span className="label-caps text-muted-foreground">Area</span>
                <input
                  value={form.area}
                  onChange={(event) => setField("area", event.target.value)}
                  className="mt-2 w-full border-b border-input bg-transparent py-3 outline-none focus:border-primary"
                />
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
              <span className="label-caps text-muted-foreground">Description</span>
              <textarea
                rows={4}
                value={form.insight}
                onChange={(event) => setField("insight", event.target.value)}
                className="mt-2 w-full border-b border-input bg-transparent py-3 outline-none focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="label-caps text-muted-foreground">Review quote</span>
              <textarea
                rows={3}
                value={form.reviewQuote}
                onChange={(event) => setField("reviewQuote", event.target.value)}
                className="mt-2 w-full resize-y border-b border-input bg-transparent py-3 outline-none focus:border-primary"
              />
            </label>
            <div className="grid gap-8 sm:grid-cols-2">
              <label className="block">
                <span className="label-caps text-muted-foreground">Review name</span>
                <input
                  value={form.reviewAuthor}
                  onChange={(event) => setField("reviewAuthor", event.target.value)}
                  className="mt-2 w-full border-b border-input bg-transparent py-3 outline-none focus:border-primary"
                />
              </label>
              <label className="block">
                <span className="label-caps text-muted-foreground">Review role</span>
                <input
                  value={form.reviewRole}
                  onChange={(event) => setField("reviewRole", event.target.value)}
                  className="mt-2 w-full border-b border-input bg-transparent py-3 outline-none focus:border-primary"
                />
              </label>
            </div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.hideCardMeta}
                onChange={(event) => setField("hideCardMeta", event.target.checked)}
                className="h-4 w-4 accent-primary"
              />
              <span className="text-sm">Hide area / year on the card</span>
            </label>
            <SeoFields
              title={form.seoTitle}
              description={form.seoDescription}
              keywords={form.seoKeywords}
              canonical={form.seoCanonical}
              onChange={(field, value) => setField(field, value)}
            />
            <label className="block">
              <span className="label-caps text-muted-foreground">Main Photo</span>
              <span className="mt-1 block text-xs text-muted-foreground">
                Canva size: {CANVA_PROJECT_IMAGE_LABEL}. Upload file accepted: {REQUIRED_PROJECT_IMAGE_LABEL}.
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={async (event) => {
                  const next = event.target.files?.[0] ?? null;
                  event.target.value = "";
                  setError(null);
                  if (!next) {
                    setCardFile(null);
                    setCardPreview(editingId ? items.find((item) => item.id === editingId)?.cardUrl || "" : "");
                    return;
                  }
                  try {
                    await assertProjectImageSize(next);
                    setCardFile(next);
                    setCardPreview(URL.createObjectURL(next));
                  } catch (err) {
                    setCardFile(null);
                    setError(err instanceof Error ? err.message : `Use Canva size ${CANVA_PROJECT_IMAGE_LABEL}; exported file must be ${REQUIRED_PROJECT_IMAGE_LABEL}.`);
                    setCardPreview(editingId ? items.find((item) => item.id === editingId)?.cardUrl || "" : "");
                  }
                }}
                className="mt-3 block w-full text-sm"
              />
            </label>
            {cardPreview && (
              <button type="button" onClick={() => setViewer({ src: cardPreview, name: form.name || "Photo" })} className="block">
                <img src={cardPreview} alt="" className="h-28 w-36 object-cover" />
                <span className="label-caps mt-2 inline-block text-primary">View photo</span>
              </button>
            )}
            <div className="block">
              <span className="label-caps text-muted-foreground">More Photos / Videos</span>
              <span className="mt-1 block text-xs text-muted-foreground">
                Photos should be Canva size {CANVA_PROJECT_IMAGE_LABEL}; exported file accepted: {REQUIRED_PROJECT_IMAGE_LABEL}. Videos can stay MP4 / WEBM / MOV.
              </span>
              <input
                type="file"
                multiple
                accept="image/*,video/mp4,video/webm,video/quicktime"
                onChange={(event) => {
                  void addExtraFiles(Array.from(event.target.files ?? []));
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
                      onClick={() => setViewer({ src: slot.preview, name: form.name || "Photo" })}
                      className="block h-full w-full"
                    >
                      <img src={slot.preview} alt="" className="h-full w-full object-cover" />
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
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void save()}
                disabled={saving}
                className="label-caps bg-primary px-7 py-4 text-primary-foreground transition-colors hover:bg-foreground disabled:opacity-60"
              >
                {saving ? "Saving…" : editingId ? "Save Changes" : "Save Project"}
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
              <p className="label-caps text-primary">No projects yet</p>
              <p className="mt-3 text-muted-foreground">Add the first project card to show it on the website.</p>
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
                  <span className="label-caps w-6 text-muted-foreground">{index + 1}</span>
                  {item.cardUrl ? (
                    <button
                      type="button"
                      aria-label={`View ${item.name}`}
                      onClick={() => setViewer({ src: item.cardUrl, name: item.name })}
                      className="h-14 w-16 overflow-hidden border border-border bg-secondary"
                    >
                      <img src={item.cardUrl} alt="" className="h-full w-full object-cover" key={item.updatedAt || item.cardUrl} />
                    </button>
                  ) : (
                    <span className="flex h-14 w-16 items-center justify-center text-muted-foreground">
                      <ImageIcon size={18} className="opacity-30" />
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{item.name}</span>
                    <span className="block text-sm text-muted-foreground">
                      {item.location || item.category}
                    </span>
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
            {/\.(mp4|webm|mov)(\?|$)/i.test(viewer.src) || viewer.src.includes("/video/upload/") ? (
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
