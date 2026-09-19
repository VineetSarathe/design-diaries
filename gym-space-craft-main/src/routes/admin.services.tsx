import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdminSession } from "@/hooks/use-admin-session";
import { InstagramFeedCms } from "@/components/admin/InstagramFeedCms";

export const Route = createFileRoute("/admin/services")({
  head: () => ({
    meta: [
      { title: "Services Page | Design Diaries" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminServicesCmsPage,
});

function AdminServicesCmsPage() {
  const { admin, loading, logout } = useAdminSession({ required: true });

  if (loading || !admin) {
    return <div className="min-h-svh bg-background" />;
  }

  return (
    <AdminShell admin={admin} onLogout={() => void logout()}>
      <section className="mx-auto max-w-[52rem] px-5 py-16 md:px-10">
        <p className="label-caps text-primary">CMS</p>
        <h1 className="display-lg mt-4">Services Page</h1>
        <p className="mt-4 text-muted-foreground">
          These reels update the Services page EXPLORE OUR INSTAGRAM section. Work and Resources reels stay separate.
        </p>
        <div className="mt-12">
          <InstagramFeedCms
            ready={Boolean(admin)}
            placement="services"
            label="EXPLORE OUR INSTAGRAM"
            heading="Floors in motion"
            intro="Image and reel link. New cards go first. These reels appear only on the Services page."
            standalone
          />
        </div>
      </section>
    </AdminShell>
  );
}
