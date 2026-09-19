import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { LeadsTable } from "@/components/admin/LeadsTable";
import { useAdminSession } from "@/hooks/use-admin-session";
import { SOURCE_LABELS, adminApi, type LeadList, type LeadSource } from "@/lib/admin-api";

export const Route = createFileRoute("/admin/leads")({
  head: () => ({
    meta: [
      { title: "Leads | Design Diaries" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLeadsPage,
});

const PAGE_SIZE = 50;

function AdminLeadsPage() {
  const { admin, loading, logout } = useAdminSession({ required: true });
  const [q, setQ] = useState("");
  const [source, setSource] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<LeadList | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function readFilters() {
    const form = formRef.current;
    if (!form) return { q, source, from, to };
    const data = new FormData(form);
    return {
      q: String(data.get("q") ?? "").trim(),
      source: String(data.get("source") ?? ""),
      from: String(data.get("from") ?? ""),
      to: String(data.get("to") ?? ""),
    };
  }

  useEffect(() => {
    if (!admin) return;
    let cancelled = false;
    setError(null);
    adminApi
      .listLeads({ page, limit: PAGE_SIZE, q, source, from, to })
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load leads");
      });
    return () => {
      cancelled = true;
    };
  }, [admin, page, q, source, from, to]);

  async function onExport() {
    const filters = readFilters();
    setQ(filters.q);
    setSource(filters.source);
    setFrom(filters.from);
    setTo(filters.to);
    setPage(1);
    setExporting(true);
    try {
      const blob = await adminApi.exportLeads(filters);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download =
        filters.from && filters.to
          ? `leads-${filters.from}-to-${filters.to}.csv`
          : `leads-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not export leads");
    } finally {
      setExporting(false);
    }
  }

  if (loading || !admin) {
    return <div className="min-h-svh bg-background" />;
  }

  const total = data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <AdminShell admin={admin} onLogout={() => void logout()}>
      <section className="mx-auto max-w-[110rem] px-5 py-16 md:px-10">
        <p className="label-caps text-primary">Enquiries</p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1 className="display-lg">Leads</h1>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Every Contact, Enquiry, Project and Download form lands here automatically.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void onExport()}
            disabled={exporting || total === 0}
            className="label-caps bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-foreground disabled:opacity-50"
          >
            {exporting ? "Exporting…" : "Export CSV"}
          </button>
        </div>

        <form
          ref={formRef}
          className="mt-10 flex flex-wrap items-end gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            setPage(1);
            setQ(String(form.get("q") ?? "").trim());
            setSource(String(form.get("source") ?? ""));
            setFrom(String(form.get("from") ?? ""));
            setTo(String(form.get("to") ?? ""));
          }}
        >
          <input
            name="q"
            defaultValue={q}
            placeholder="Search name, email, phone"
            className="min-w-[16rem] flex-1 border-b border-input bg-transparent py-3 outline-none transition-colors focus:border-primary"
          />
          <select
            name="source"
            defaultValue={source}
            className="border-b border-input bg-transparent py-3 outline-none focus:border-primary"
          >
            <option value="">All sources</option>
            {(Object.keys(SOURCE_LABELS) as LeadSource[]).map((key) => (
              <option key={key} value={key}>
                {SOURCE_LABELS[key]}
              </option>
            ))}
          </select>
          <label className="block">
            <span className="label-caps text-[0.65rem] text-muted-foreground">From</span>
            <input
              name="from"
              type="date"
              defaultValue={from}
              className="mt-1 block border-b border-input bg-transparent py-3 outline-none focus:border-primary"
            />
          </label>
          <label className="block">
            <span className="label-caps text-[0.65rem] text-muted-foreground">To</span>
            <input
              name="to"
              type="date"
              defaultValue={to}
              className="mt-1 block border-b border-input bg-transparent py-3 outline-none focus:border-primary"
            />
          </label>
          <button
            type="submit"
            className="label-caps border border-input px-5 py-3 transition-colors hover:border-primary hover:text-primary"
          >
            Filter
          </button>
        </form>

        <p className="label-caps mt-8 text-muted-foreground">{total} lead{total === 1 ? "" : "s"}</p>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
        <div className="mt-5">
          <LeadsTable leads={data?.leads ?? []} />
        </div>

        {pageCount > 1 && (
          <div className="mt-8 flex items-center gap-4">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((value) => value - 1)}
              className="label-caps border border-input px-4 py-2 disabled:opacity-40"
            >
              Previous
            </button>
            <p className="text-sm text-muted-foreground">
              Page {page} of {pageCount}
            </p>
            <button
              type="button"
              disabled={page >= pageCount}
              onClick={() => setPage((value) => value + 1)}
              className="label-caps border border-input px-4 py-2 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </section>
    </AdminShell>
  );
}
