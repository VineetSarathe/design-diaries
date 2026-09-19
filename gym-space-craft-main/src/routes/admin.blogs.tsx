import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GripVertical, ImageIcon, ImagePlus, Plus, Search, Trash2, X } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdminSession } from "@/hooks/use-admin-session";
import { adminApi, type AdminBlog } from "@/lib/admin-api";
import { compressImage } from "@/lib/compress-image";
import { blogCategories } from "@/data/resources";
import { SITE_NAME, blogCanonical } from "@/lib/seo";

export const Route = createFileRoute("/admin/blogs")({
  head: () => ({
    meta: [
      { title: "Blogs | Design Diaries" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminBlogsPage,
});

type PointState = {
  id: string;
  heading: string;
  text: string;
  originalUrl: string;
  preview: string;
  file?: File;
};

type SectionState = {
  id: string;
  heading: string;
  text: string;
  points: PointState[];
};

type FormState = {
  title: string;
  slug: string;
  category: string;
  readTime: string;
  excerpt: string;
  highlight: string;
  projectSlug: string;
  imageAlt: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  seoCanonical: string;
};

const EMPTY_FORM: FormState = {
  title: "",
  slug: "",
  category: "Wellness Space Design",
  readTime: "4 min",
  excerpt: "",
  highlight: "",
  projectSlug: "",
  imageAlt: "",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  seoCanonical: "",
};

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function emptySection(): SectionState {
  return { id: newId(), heading: "", text: "", points: [] };
}

function emptyPoint(): PointState {
  return { id: newId(), heading: "", text: "", originalUrl: "", preview: "" };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function countHint(value: string, max: number) {
  const n = value.trim().length;
  return { n, over: n > max };
}

function AdminBlogsPage() {
  const { admin, loading, logout } = useAdminSession({ required: true });
  const [items, setItems] = useState<AdminBlog[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [slugTouched, setSlugTouched] = useState(false);
  const [sections, setSections] = useState<SectionState[]>([emptySection()]);
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
    const res = await adminApi.listBlogs();
    setItems(res.posts);
    setOrderDirty(false);
  }

  useEffect(() => {
    if (!admin) return;
    refresh().catch((err) => setError(err instanceof Error ? err.message : "Could not load articles"));
  }, [admin]);

  function resetForm() {
    setForm(EMPTY_FORM);
    setSlugTouched(false);
    setSections([emptySection()]);
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

  function startEdit(item: AdminBlog) {
    setForm({
      title: item.title,
      slug: item.slug,
      category: item.category,
      readTime: item.readTime,
      excerpt: item.excerpt,
      highlight: item.highlight || "",
      projectSlug: item.projectSlug || "",
      imageAlt: item.imageAlt || "",
      seoTitle: item.seoTitle || "",
      seoDescription: item.seoDescription || "",
      seoKeywords: item.seoKeywords || "",
      seoCanonical: item.seoCanonical || "",
    });
    setSlugTouched(true);
    setSections(
      item.body.length
        ? item.body.map((section) => ({
            id: newId(),
            heading: section.heading,
            text: section.text || "",
            points: (section.points || []).map((point) => ({
              id: newId(),
              heading: point.heading,
              text: point.text,
              originalUrl: point.imageUrl || "",
              preview: point.imageUrl || "",
            })),
          }))
        : [emptySection()],
    );
    setEditingId(item.id);
    setImageFile(null);
    setImagePreview(item.imageUrl);
    setError(null);
    setSaved(null);
    setShowForm(true);
  }

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === "title" && !slugTouched) next.slug = slugify(String(value));
      return next;
    });
  }

  function updateSection(id: string, patch: Partial<SectionState>) {
    setSections((current) => current.map((section) => (section.id === id ? { ...section, ...patch } : section)));
  }

  function updatePoint(sectionId: string, pointId: string, patch: Partial<PointState>) {
    setSections((current) =>
      current.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              points: section.points.map((point) => (point.id === pointId ? { ...point, ...patch } : point)),
            }
          : section,
      ),
    );
  }

  async function save() {
    if (saving) return;
    setSaving(true);
    setError(null);
    setSaved(null);
    try {
      if (form.title.trim().length < 2) throw new Error("Enter the article title");
      if (form.category.trim().length < 2) throw new Error("Enter the category");
      if (form.excerpt.trim().length < 2) throw new Error("Enter the card excerpt");
      if (!editingId && !imageFile) throw new Error("Please upload a cover image");

      const pointFiles: File[] = [];
      const body = sections
        .map((section) => ({
          heading: section.heading.trim(),
          text: section.text.trim(),
          points: section.points
            .map((point) => {
              const heading = point.heading.trim();
              const text = point.text.trim();
              if (!heading && !text) return null;
              if (point.file) pointFiles.push(point.file);
              return {
                heading,
                text,
                image: point.file ? "__file__" : point.originalUrl || "",
              };
            })
            .filter((point): point is { heading: string; text: string; image: string } => point != null),
        }))
        .filter((section) => section.heading);
      if (!body.length) throw new Error("Add at least one article section");

      const data = new FormData();
      data.set("title", form.title);
      data.set("slug", form.slug || slugify(form.title));
      data.set("category", form.category);
      data.set("readTime", form.readTime);
      data.set("excerpt", form.excerpt);
      data.set("highlight", form.highlight);
      data.set("projectSlug", form.projectSlug);
      data.set("imageAlt", form.imageAlt);
      data.set("seoTitle", form.seoTitle);
      data.set("seoDescription", form.seoDescription);
      data.set("seoKeywords", form.seoKeywords);
      data.set("seoCanonical", form.seoCanonical);
      data.set("body", JSON.stringify(body));
      if (imageFile) data.set("image", await compressImage(imageFile));
      for (const file of pointFiles) {
        data.append("pointImages", await compressImage(file));
      }

      const res = editingId ? await adminApi.updateBlog(editingId, data) : await adminApi.createBlog(data);
      const savedItem = res.post;
      setImageFile(null);
      if (savedItem) {
        startEdit(savedItem);
      } else {
        resetForm();
      }
      setSaved(res.message || "Saved. The Resources cards and article page will use this.");
      await refresh().catch(() => undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save article");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(item: AdminBlog) {
    if (!window.confirm(`Delete ${item.title}?`)) return;
    setError(null);
    setSaved(null);
    try {
      await adminApi.deleteBlog(item.id);
      if (editingId === item.id) resetForm();
      await refresh();
      setSaved("Article deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete article");
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

  const previewTitle = form.seoTitle.trim() || (form.title.trim() ? `${form.title.trim()} | ${SITE_NAME}` : "Article title | Design Diaries");
  const previewDescription = form.seoDescription.trim() || form.excerpt.trim() || "Search result ke neeche ye short description dikhegi.";
  const previewUrl = form.seoCanonical.trim() || (form.slug ? blogCanonical(form.slug) : "https://designdiaries.in/resources/blog/...");
  const titleCount = countHint(form.seoTitle, 60);
  const descCount = countHint(form.seoDescription, 160);

  async function onSaveOrder() {
    setSavingOrder(true);
    setError(null);
    setSaved(null);
    try {
      const res = await adminApi.reorderBlogs(items.map((item, index) => ({ id: item.id, sortOrder: index + 1 })));
      setItems(res.posts);
      setOrderDirty(false);
      setSaved("Order saved. The Resources listing will use this sequence.");
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
            <h1 className="display-lg">Blogs</h1>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Card fields match the Resources listing. Open an article to edit the inner page, including the cover image.
            </p>
          </div>
          <button
            type="button"
            onClick={startCreate}
            className="label-caps bg-primary px-7 py-4 text-primary-foreground transition-colors hover:bg-foreground"
          >
            + Add Article
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
            <h2 className="font-display text-2xl uppercase">{editingId ? "Edit article" : "Add article"}</h2>

            <label className="block">
              <span className="label-caps text-muted-foreground">Title</span>
              <input
                value={form.title}
                onChange={(event) => setField("title", event.target.value)}
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
            <div className="grid gap-8 sm:grid-cols-2">
              <label className="block">
                <span className="label-caps text-muted-foreground">Category</span>
                <input
                  list="blog-categories"
                  value={form.category}
                  onChange={(event) => setField("category", event.target.value)}
                  className="mt-2 w-full border-b border-input bg-transparent py-3 outline-none focus:border-primary"
                />
                <datalist id="blog-categories">
                  {blogCategories.map((category) => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </label>
              <label className="block">
                <span className="label-caps text-muted-foreground">Read time</span>
                <input
                  value={form.readTime}
                  onChange={(event) => setField("readTime", event.target.value)}
                  placeholder="4 min"
                  className="mt-2 w-full border-b border-input bg-transparent py-3 outline-none focus:border-primary"
                />
              </label>
            </div>
            <label className="block">
              <span className="label-caps text-muted-foreground">Excerpt</span>
              <textarea
                rows={3}
                value={form.excerpt}
                onChange={(event) => setField("excerpt", event.target.value)}
                className="mt-2 w-full border-b border-input bg-transparent py-3 outline-none focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="label-caps text-muted-foreground">Closing highlight</span>
              <textarea
                rows={2}
                value={form.highlight}
                onChange={(event) => setField("highlight", event.target.value)}
                placeholder="The gym should not be an add-on. It should be part of the experience"
                className="mt-2 w-full border-b border-input bg-transparent py-3 outline-none focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="label-caps text-muted-foreground">Linked project slug</span>
              <input
                value={form.projectSlug}
                onChange={(event) => setField("projectSlug", event.target.value)}
                placeholder="iron-standard"
                className="mt-2 w-full border-b border-input bg-transparent py-3 outline-none focus:border-primary"
              />
            </label>

            <div>
              <span className="label-caps text-muted-foreground">Cover image</span>
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
              {imagePreview && (
                <button
                  type="button"
                  onClick={() => setViewer({ src: imagePreview, name: form.title || "Cover" })}
                  className="mt-4 block cursor-pointer"
                >
                  <img src={imagePreview} alt="" className="aspect-[16/10] h-36 w-auto object-cover" />
                  <span className="label-caps mt-2 inline-block text-primary">View photo</span>
                </button>
              )}
            </div>

            <div className="space-y-6 border border-border p-5 md:p-6">
              <div>
                <p className="label-caps text-primary">SEO for this article</p>
                <h3 className="mt-2 font-display text-xl uppercase text-foreground">Search and share settings</h3>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  Ye fields Google, WhatsApp aur Instagram preview ke liye hain. Website pe article ka look same rahega.
                  Koi box khali chhodo to title, excerpt aur cover photo automatically use honge.
                </p>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="border border-border bg-secondary/50 p-4">
                  <p className="label-caps inline-flex items-center gap-2 text-foreground">
                    <Search className="h-3.5 w-3.5 text-primary" />
                    Google pe aisa dikhega
                  </p>
                  <p className="mt-4 truncate text-xs text-muted-foreground">{previewUrl}</p>
                  <p className="mt-1 text-lg leading-snug text-primary">{previewTitle}</p>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{previewDescription}</p>
                </div>
                <div className="border border-border bg-secondary/50 p-4">
                  <p className="label-caps text-foreground">Link share pe aisa dikhega</p>
                  <div className="mt-4 flex gap-3">
                    {imagePreview ? (
                      <img src={imagePreview} alt="" className="h-16 w-20 shrink-0 object-cover" />
                    ) : (
                      <div className="flex h-16 w-20 shrink-0 items-center justify-center border border-dashed border-input text-[10px] uppercase text-muted-foreground">
                        Cover
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{previewTitle}</p>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{previewDescription}</p>
                    </div>
                  </div>
                </div>
              </div>

              <label className="block">
                <span className="label-caps text-foreground">1. Google headline</span>
                <p className="mt-1 text-sm text-muted-foreground">
                  Search result ki blue heading. Page ke andar wali badi heading nahi badlegi.
                </p>
                <input
                  value={form.seoTitle}
                  onChange={(event) => setField("seoTitle", event.target.value)}
                  placeholder={`${form.title || "Article title"} | Design Diaries`}
                  className="mt-2 w-full border-b border-input bg-transparent py-3 text-foreground outline-none focus:border-primary"
                />
                <p className={`mt-1 text-xs ${titleCount.over ? "text-destructive" : "text-muted-foreground"}`}>
                  {titleCount.n ? `${titleCount.n}/60 characters — 50 to 60 best rehta hai` : "Khali hai to article title use hogi"}
                </p>
              </label>

              <label className="block">
                <span className="label-caps text-foreground">2. Short description</span>
                <p className="mt-1 text-sm text-muted-foreground">
                  Google heading ke neeche 1–2 line. Empty ho to card wala excerpt use hoga.
                </p>
                <textarea
                  rows={3}
                  value={form.seoDescription}
                  onChange={(event) => setField("seoDescription", event.target.value)}
                  placeholder={form.excerpt || "Uses the card excerpt if empty"}
                  className="mt-2 w-full border-b border-input bg-transparent py-3 text-foreground outline-none focus:border-primary"
                />
                <p className={`mt-1 text-xs ${descCount.over ? "text-destructive" : "text-muted-foreground"}`}>
                  {descCount.n ? `${descCount.n}/160 characters — 140 to 160 best rehta hai` : "Khali hai to excerpt use hogi"}
                </p>
              </label>

              <label className="block">
                <span className="label-caps text-foreground">3. Keywords</span>
                <p className="mt-1 text-sm text-muted-foreground">
                  Comma se alag karke likho. Example: gym interior design, hotel gym, recovery space
                </p>
                <input
                  value={form.seoKeywords}
                  onChange={(event) => setField("seoKeywords", event.target.value)}
                  placeholder="gym interior design, recovery space, India"
                  className="mt-2 w-full border-b border-input bg-transparent py-3 text-foreground outline-none focus:border-primary"
                />
              </label>

              <label className="block">
                <span className="label-caps text-foreground">4. Main URL</span>
                <p className="mt-1 text-sm text-muted-foreground">
                  Is article ka asli link. Mostly khali chhodo — slug se automatic banega.
                </p>
                <input
                  value={form.seoCanonical}
                  onChange={(event) => setField("seoCanonical", event.target.value)}
                  placeholder={form.slug ? blogCanonical(form.slug) : "Leave empty to use this article URL"}
                  className="mt-2 w-full border-b border-input bg-transparent py-3 text-foreground outline-none focus:border-primary"
                />
              </label>

              <label className="block">
                <span className="label-caps text-foreground">5. Photo description</span>
                <p className="mt-1 text-sm text-muted-foreground">
                  Cover photo mein kya dikh raha hai, short mein. Google aur share preview ke liye.
                </p>
                <input
                  value={form.imageAlt}
                  onChange={(event) => setField("imageAlt", event.target.value)}
                  placeholder={form.title || "Describe the cover image"}
                  className="mt-2 w-full border-b border-input bg-transparent py-3 text-foreground outline-none focus:border-primary"
                />
              </label>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <span className="label-caps text-muted-foreground">Article sections</span>
                <button
                  type="button"
                  onClick={() => setSections((current) => [...current, emptySection()])}
                  className="label-caps inline-flex items-center gap-2 text-primary"
                >
                  <Plus size={14} /> Add section
                </button>
              </div>
              {sections.map((section, index) => (
                <div key={section.id} className="space-y-4 border border-border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="label-caps text-muted-foreground">Section {String(index + 1).padStart(2, "0")}</span>
                    {sections.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setSections((current) => current.filter((item) => item.id !== section.id))}
                        className="p-1 text-muted-foreground hover:text-destructive"
                        aria-label="Remove section"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <label className="block">
                    <span className="label-caps text-muted-foreground">Heading</span>
                    <input
                      value={section.heading}
                      onChange={(event) => updateSection(section.id, { heading: event.target.value })}
                      className="mt-2 w-full border-b border-input bg-transparent py-3 outline-none focus:border-primary"
                    />
                  </label>
                  <label className="block">
                    <span className="label-caps text-muted-foreground">Text</span>
                    <textarea
                      rows={3}
                      value={section.text}
                      onChange={(event) => updateSection(section.id, { text: event.target.value })}
                      className="mt-2 w-full border-b border-input bg-transparent py-3 outline-none focus:border-primary"
                    />
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="label-caps text-muted-foreground">Points</span>
                      <button
                        type="button"
                        onClick={() =>
                          updateSection(section.id, { points: [...section.points, emptyPoint()] })
                        }
                        className="label-caps text-primary"
                      >
                        + Add point
                      </button>
                    </div>
                    {section.points.map((point) => (
                      <div key={point.id} className="space-y-3 border border-border/70 p-3">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              updateSection(section.id, {
                                points: section.points.filter((item) => item.id !== point.id),
                              })
                            }
                            className="p-1 text-muted-foreground hover:text-destructive"
                            aria-label="Remove point"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <input
                          value={point.heading}
                          onChange={(event) => updatePoint(section.id, point.id, { heading: event.target.value })}
                          placeholder="Point heading"
                          className="w-full border-b border-input bg-transparent py-2 outline-none focus:border-primary"
                        />
                        <textarea
                          rows={2}
                          value={point.text}
                          onChange={(event) => updatePoint(section.id, point.id, { text: event.target.value })}
                          placeholder="Point text"
                          className="w-full border-b border-input bg-transparent py-2 outline-none focus:border-primary"
                        />
                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          <label className="label-caps inline-flex cursor-pointer items-center gap-2 text-primary">
                            <ImagePlus size={14} />
                            {point.preview ? "Replace image" : "Add image"}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(event) => {
                                const file = event.target.files?.[0];
                                event.target.value = "";
                                if (!file) return;
                                updatePoint(section.id, point.id, {
                                  file,
                                  preview: URL.createObjectURL(file),
                                  originalUrl: "",
                                });
                              }}
                            />
                          </label>
                          {point.preview && (
                            <>
                              <button
                                type="button"
                                onClick={() => setViewer({ src: point.preview, name: point.heading || "Point image" })}
                                className="h-14 w-20 overflow-hidden border border-border bg-secondary"
                              >
                                <img src={point.preview} alt="" className="h-full w-full object-cover" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  updatePoint(section.id, point.id, { file: undefined, preview: "", originalUrl: "" })
                                }
                                className="p-1 text-muted-foreground hover:text-destructive"
                                aria-label="Remove point image"
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void save()}
                disabled={saving}
                className="label-caps bg-primary px-7 py-4 text-primary-foreground transition-colors hover:bg-foreground disabled:opacity-60"
              >
                {saving ? "Saving…" : editingId ? "Save Changes" : "Save Article"}
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
              <p className="label-caps text-primary">No articles yet</p>
              <p className="mt-3 text-muted-foreground">Add the first journal card.</p>
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
                      {item.category} · {item.readTime}
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
            <img src={viewer.src} alt={viewer.name} className="max-h-[70svh] max-w-full object-contain" />
            <figcaption className="label-caps mt-4 text-center">{viewer.name}</figcaption>
          </figure>
        </div>
      )}
    </AdminShell>
  );
}
