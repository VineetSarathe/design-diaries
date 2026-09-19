import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ImageIcon, X } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdminSession } from "@/hooks/use-admin-session";
import { adminApi, type Testimonial } from "@/lib/admin-api";
import { compressImage } from "@/lib/compress-image";

export const Route = createFileRoute("/admin/testimonials")({
  head: () => ({
    meta: [
      { title: "Testimonials | Design Diaries" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminTestimonialsPage,
});

const emptyForm = {
  name: "",
  company: "",
  designation: "",
  testimonial: "",
  rating: 5,
};

function stars(rating: number) {
  return "★★★★★☆☆☆☆☆".slice(5 - rating, 10 - rating);
}

function AdminTestimonialsPage() {
  const { admin, loading, logout } = useAdminSession({ required: true });
  const [items, setItems] = useState<Testimonial[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [removeImage, setRemoveImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewer, setViewer] = useState<{ src: string; name: string } | null>(null);

  async function refresh() {
    const res = await adminApi.listTestimonials();
    setItems(res.testimonials);
  }

  useEffect(() => {
    if (!admin) return;
    refresh().catch((err) => setError(err instanceof Error ? err.message : "Could not load testimonials"));
  }, [admin]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setFile(null);
    setPreview("");
    setRemoveImage(false);
    setShowForm(false);
  }

  function onPickFile(next: File | null) {
    setFile(next);
    setRemoveImage(false);
    if (!next) {
      setPreview(editingId ? items.find((item) => item.id === editingId)?.imageUrl || "" : "");
      return;
    }
    const url = URL.createObjectURL(next);
    setPreview(url);
  }

  function startCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setFile(null);
    setPreview("");
    setRemoveImage(false);
    setSaved(null);
    setError(null);
    setShowForm(true);
  }

  function startEdit(item: Testimonial) {
    setForm({
      name: item.name,
      company: item.company,
      designation: item.designation,
      testimonial: item.testimonial,
      rating: item.rating,
    });
    setEditingId(item.id);
    setFile(null);
    setPreview(item.imageUrl);
    setRemoveImage(false);
    setSaved(null);
    setError(null);
    setShowForm(true);
  }

  async function save() {
    if (saving) return;
    setSaving(true);
    setError(null);
    setSaved(null);
    try {
      if (form.name.trim().length < 2) throw new Error("Enter the person's name");
      if (form.testimonial.trim().length < 8) throw new Error("Enter the testimonial");

      const data = new FormData();
      data.set("name", form.name);
      data.set("company", form.company);
      data.set("designation", form.designation);
      data.set("testimonial", form.testimonial);
      data.set("rating", String(form.rating));
      if (file) data.set("image", await compressImage(file));
      if (editingId && removeImage && !file) data.set("removeImage", "true");

      const res = editingId
        ? await adminApi.updateTestimonial(editingId, data)
        : await adminApi.createTestimonial(data);
      await refresh();
      resetForm();
      setSaved(res.message || "Saved. The website will use this testimonial now.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save testimonial");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(item: Testimonial) {
    if (!window.confirm(`Delete the testimonial from ${item.name}?`)) return;
    setError(null);
    setSaved(null);
    try {
      await adminApi.deleteTestimonial(item.id);
      if (editingId === item.id) resetForm();
      await refresh();
      setSaved("Testimonial deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete testimonial");
    }
  }

  if (loading || !admin) {
    return <div className="min-h-svh bg-background" />;
  }

  return (
    <AdminShell admin={admin} onLogout={() => void logout()}>
      <section className="mx-auto max-w-[72rem] px-5 py-16 md:px-10">
        <p className="label-caps text-primary">CMS</p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1 className="display-lg">Testimonials</h1>
            <p className="mt-4 max-w-xl text-muted-foreground">
              These quotes appear on the homepage. Photo uploads go to Cloudinary; MongoDB stores only the image URL.
            </p>
          </div>
          <button
            type="button"
            onClick={startCreate}
            className="label-caps bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-foreground"
          >
            + Add Testimonial
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
            <h2 className="font-display text-2xl uppercase">{editingId ? "Edit testimonial" : "Add testimonial"}</h2>
            <label className="block">
              <span className="label-caps text-muted-foreground">Name</span>
              <input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                className="mt-2 w-full border-b border-input bg-transparent py-3 outline-none focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="label-caps text-muted-foreground">Company</span>
              <input
                value={form.company}
                onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))}
                className="mt-2 w-full border-b border-input bg-transparent py-3 outline-none focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="label-caps text-muted-foreground">Designation</span>
              <input
                value={form.designation}
                onChange={(event) => setForm((current) => ({ ...current, designation: event.target.value }))}
                className="mt-2 w-full border-b border-input bg-transparent py-3 outline-none focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="label-caps text-muted-foreground">Testimonial</span>
              <textarea
                rows={4}
                value={form.testimonial}
                onChange={(event) => setForm((current) => ({ ...current, testimonial: event.target.value }))}
                className="mt-2 w-full resize-y border-b border-input bg-transparent py-3 outline-none focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="label-caps text-muted-foreground">Rating</span>
              <select
                value={form.rating}
                onChange={(event) => setForm((current) => ({ ...current, rating: Number(event.target.value) }))}
                className="mt-2 w-full border-b border-input bg-transparent py-3 outline-none focus:border-primary"
              >
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {stars(value)} ({value})
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="label-caps text-muted-foreground">Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => onPickFile(event.target.files?.[0] ?? null)}
                className="mt-3 block w-full text-sm"
              />
            </label>
            {preview && !removeImage && (
              <button
                type="button"
                onClick={() => setViewer({ src: preview, name: form.name || "Photo" })}
                className="block"
              >
                <img src={preview} alt="Uploaded photo preview" className="h-28 w-28 object-cover" />
                <span className="label-caps mt-2 inline-block text-primary">View photo</span>
              </button>
            )}
            {editingId && preview && !file && (
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={removeImage}
                  onChange={(event) => {
                    setRemoveImage(event.target.checked);
                    if (event.target.checked) setFile(null);
                  }}
                />
                Remove current photo
              </label>
            )}
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void save()}
                disabled={saving}
                className="label-caps bg-primary px-7 py-4 text-primary-foreground transition-colors hover:bg-foreground disabled:opacity-60"
              >
                {saving ? "Saving…" : editingId ? "Save Changes" : "Save Testimonial"}
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

        <div className="mt-12 overflow-x-auto border border-border">
          {items.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="label-caps text-primary">No testimonials yet</p>
              <p className="mt-3 text-muted-foreground">Add the first quote to show it on the homepage.</p>
            </div>
          ) : (
            <table className="w-full min-w-[48rem] text-left text-sm">
              <thead className="border-b border-border bg-secondary/60">
                <tr>
                  {["Photo", "Name", "Company", "Rating", "Actions"].map((heading) => (
                    <th key={heading} className="label-caps px-4 py-3 font-medium text-muted-foreground">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-4">
                      {item.imageUrl ? (
                        <button
                          type="button"
                          aria-label={`View photo for ${item.name}`}
                          onClick={() => setViewer({ src: item.imageUrl, name: item.name })}
                          className="flex h-12 w-12 items-center justify-center border border-border bg-secondary text-primary transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
                        >
                          <ImageIcon size={18} />
                        </button>
                      ) : (
                        <span className="flex h-12 w-12 items-center justify-center text-muted-foreground">
                          <ImageIcon size={18} className="opacity-30" />
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 font-medium">{item.name}</td>
                    <td className="px-4 py-4">{item.company || "—"}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-primary">{stars(item.rating)}</td>
                    <td className="px-4 py-4">
                      <div className="flex gap-4">
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
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
          <figure className="max-h-[90svh] max-w-[90vw]" onClick={(event) => event.stopPropagation()}>
            <img
              src={viewer.src}
              alt={viewer.name}
              className="max-h-[80svh] max-w-full object-contain"
            />
            <figcaption className="label-caps mt-4 text-center text-background">{viewer.name}</figcaption>
          </figure>
        </div>
      )}
    </AdminShell>
  );
}
