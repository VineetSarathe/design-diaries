import { createFileRoute, Link } from "@tanstack/react-router";
import { useAdminSession } from "@/hooks/use-admin-session";
import { AdminShell } from "@/components/admin/AdminShell";
import { useEffect, useState } from "react";
import { adminApi, type LeadList } from "@/lib/admin-api";
import { LeadsTable } from "@/components/admin/LeadsTable";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Dashboard | Design Diaries" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminHomePage,
});

function AdminHomePage() {
  const { admin, loading, logout } = useAdminSession({ required: true });
  const [leads, setLeads] = useState<LeadList | null>(null);

  useEffect(() => {
    if (!admin) return;
    adminApi
      .listLeads({ limit: 5 })
      .then(setLeads)
      .catch(() => setLeads({ leads: [], total: 0, page: 1, limit: 5 }));
  }, [admin]);

  if (loading || !admin) {
    return <div className="min-h-svh bg-background" />;
  }

  return (
    <AdminShell admin={admin} onLogout={() => void logout()}>
      <section className="mx-auto max-w-[110rem] px-5 py-16 md:px-10">
        <p className="label-caps text-primary">Dashboard</p>
        <h1 className="display-lg mt-4">Welcome back</h1>
        <p className="mt-5 max-w-xl text-lg text-muted-foreground">
          Form submissions land here as they come in. Export anytime from Leads.
        </p>

        <div className="mt-10 grid gap-px bg-border sm:grid-cols-2 lg:max-w-xl">
          <div className="bg-background p-6">
            <p className="label-caps text-muted-foreground">Total leads</p>
            <p className="mt-3 font-display text-4xl">{leads?.total ?? "—"}</p>
          </div>
          <Link
            to="/admin/leads"
            className="cursor-pointer bg-background p-6 transition-colors hover:bg-secondary"
          >
            <p className="label-caps text-muted-foreground">Leads</p>
            <p className="mt-3 font-display text-2xl uppercase">View all →</p>
          </Link>
          <Link
            to="/admin/calls"
            className="cursor-pointer bg-background p-6 transition-colors hover:bg-secondary"
          >
            <p className="label-caps text-muted-foreground">Calls</p>
            <p className="mt-3 font-display text-2xl uppercase">View bookings →</p>
          </Link>
          <Link
            to="/admin/home"
            className="cursor-pointer bg-background p-6 transition-colors hover:bg-secondary"
          >
            <p className="label-caps text-muted-foreground">Homepage</p>
            <p className="mt-3 font-display text-2xl uppercase">Edit CMS →</p>
          </Link>
          <Link
            to="/admin/work"
            className="cursor-pointer bg-background p-6 transition-colors hover:bg-secondary"
          >
            <p className="label-caps text-muted-foreground">Work</p>
            <p className="mt-3 font-display text-2xl uppercase">Edit CMS →</p>
          </Link>
          <Link
            to="/admin/projects"
            className="cursor-pointer bg-background p-6 transition-colors hover:bg-secondary"
          >
            <p className="label-caps text-muted-foreground">Projects</p>
            <p className="mt-3 font-display text-2xl uppercase">Manage →</p>
          </Link>
          <Link
            to="/admin/blogs"
            className="cursor-pointer bg-background p-6 transition-colors hover:bg-secondary"
          >
            <p className="label-caps text-muted-foreground">Blogs</p>
            <p className="mt-3 font-display text-2xl uppercase">Manage →</p>
          </Link>
          <Link
            to="/admin/resources"
            className="cursor-pointer bg-background p-6 transition-colors hover:bg-secondary"
          >
            <p className="label-caps text-muted-foreground">Resources</p>
            <p className="mt-3 font-display text-2xl uppercase">Edit CMS →</p>
          </Link>
          <Link
            to="/admin/services"
            className="cursor-pointer bg-background p-6 transition-colors hover:bg-secondary"
          >
            <p className="label-caps text-muted-foreground">Services</p>
            <p className="mt-3 font-display text-2xl uppercase">Edit CMS →</p>
          </Link>
          <Link
            to="/admin/testimonials"
            className="cursor-pointer bg-background p-6 transition-colors hover:bg-secondary"
          >
            <p className="label-caps text-muted-foreground">Testimonials</p>
            <p className="mt-3 font-display text-2xl uppercase">Manage →</p>
          </Link>
          <Link
            to="/admin/recognition"
            className="cursor-pointer bg-background p-6 transition-colors hover:bg-secondary"
          >
            <p className="label-caps text-muted-foreground">Recognition</p>
            <p className="mt-3 font-display text-2xl uppercase">Manage →</p>
          </Link>
          <Link
            to="/admin/logos"
            className="cursor-pointer bg-background p-6 transition-colors hover:bg-secondary"
          >
            <p className="label-caps text-muted-foreground">Logos</p>
            <p className="mt-3 font-display text-2xl uppercase">Manage →</p>
          </Link>
          <Link
            to="/admin/about"
            className="cursor-pointer bg-background p-6 transition-colors hover:bg-secondary"
          >
            <p className="label-caps text-muted-foreground">About</p>
            <p className="mt-3 font-display text-2xl uppercase">Edit CMS →</p>
          </Link>
          <Link
            to="/admin/contact"
            className="cursor-pointer bg-background p-6 transition-colors hover:bg-secondary"
          >
            <p className="label-caps text-muted-foreground">Contact</p>
            <p className="mt-3 font-display text-2xl uppercase">Edit links →</p>
          </Link>
        </div>

        <div className="mt-14">
          <div className="mb-5 flex items-end justify-between gap-4">
            <h2 className="font-display text-2xl uppercase">Recent leads</h2>
            <Link to="/admin/leads" className="label-caps cursor-pointer text-primary transition-colors hover:text-foreground">
              Open leads
            </Link>
          </div>
          <LeadsTable leads={leads?.leads ?? []} />
        </div>
      </section>
    </AdminShell>
  );
}
