import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdminSession } from "@/hooks/use-admin-session";
import { InstagramFeedCms } from "@/components/admin/InstagramFeedCms";

export const Route = createFileRoute("/admin/work")({
  head: () => ({
    meta: [
      { title: "Work Page | Design Diaries" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminWorkCmsPage,
});

function AdminWorkCmsPage() {
  const { admin, loading, logout } = useAdminSession({ required: true });

  if (loading || !admin) {
    return <div className="min-h-svh bg-background" />;
  }

  return (
    <AdminShell admin={admin} onLogout={() => void logout()}>
      <section className="mx-auto max-w-[52rem] px-5 py-16 md:px-10">
        <p className="label-caps text-primary">CMS</p>
        <h1 className="display-lg mt-4">Work Page</h1>
        <p className="mt-4 text-muted-foreground">
          These reels update the Work page EXPLORE OUR INSTAGRAM section. Homepage Instagram cards stay separate.
        </p>
        <div className="mt-12">
          <InstagramFeedCms
            ready={Boolean(admin)}
            placement="work"
            label="EXPLORE OUR INSTAGRAM"
            heading="Floors in motion"
            intro="Image and reel link. New cards go first. These reels appear only on the Work page."
            standalone
          />
        </div>
      </section>
    </AdminShell>
  );
}
