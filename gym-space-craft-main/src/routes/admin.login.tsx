import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { useAdminSession } from "@/hooks/use-admin-session";
import logoBlack from "@/assets/logo-black.png";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin | Design Diaries" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  useAdminSession({ redirectIfAuthed: true });

  return (
    <section className="admin-panel mx-auto flex min-h-svh max-w-lg flex-col justify-center px-5 py-16 text-foreground">
      <Link to="/" className="mb-10 inline-flex w-fit cursor-pointer">
        <img
          src={logoBlack}
          alt="Design Diaries"
          width={330}
          height={102}
          className="h-8 w-auto"
        />
      </Link>
      <p className="label-caps text-primary">Studio access</p>
      <h1 className="display-lg mt-4">Admin login</h1>
      <p className="mt-4 text-muted-foreground">Sign in to manage the studio dashboard.</p>
      <div className="mt-10">
        <AdminLoginForm />
      </div>
    </section>
  );
}
