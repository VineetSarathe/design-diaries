import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  Award,
  BookOpen,
  Briefcase,
  FileText,
  Film,
  Home,
  LayoutDashboard,
  Library,
  LogOut,
  Mail,
  Menu,
  MessageSquareQuote,
  PanelsTopLeft,
  Phone,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminUser } from "@/lib/admin-api";
import logoBlack from "@/assets/logo-black.png";

const NAV = [
  { label: "Dashboard", to: "/admin" as const, icon: LayoutDashboard },
  { label: "Leads", to: "/admin/leads" as const, icon: Users },
  { label: "Calls", to: "/admin/calls" as const, icon: Phone },
  { label: "Homepage", to: "/admin/home" as const, icon: Home },
  { label: "Work", to: "/admin/work" as const, icon: Film },
  { label: "Projects", to: "/admin/projects" as const, icon: Briefcase },
  { label: "Blogs", to: "/admin/blogs" as const, icon: FileText },
  { label: "Resources", to: "/admin/resources" as const, icon: Library },
  { label: "Services", to: "/admin/services" as const, icon: Sparkles },
  { label: "Testimonials", to: "/admin/testimonials" as const, icon: MessageSquareQuote },
  { label: "Recognition", to: "/admin/recognition" as const, icon: Award },
  { label: "Logos", to: "/admin/logos" as const, icon: PanelsTopLeft },
  { label: "About", to: "/admin/about" as const, icon: BookOpen },
  { label: "Contact", to: "/admin/contact" as const, icon: Mail },
];

function isActive(pathname: string, to: string) {
  if (to === "/admin") return pathname === "/admin" || pathname === "/admin/";
  return pathname.startsWith(to);
}

export function AdminShell({
  admin,
  onLogout,
  children,
}: {
  admin: AdminUser;
  onLogout: () => void;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const sync = () => setOpen(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  function closeIfMobile() {
    if (window.matchMedia("(min-width: 1024px)").matches) return;
    setOpen(false);
  }

  return (
    <div className="admin-panel min-h-svh bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="flex h-[4.25rem] items-center justify-between gap-4 px-5 md:px-8">
          <Link to="/admin" className="flex cursor-pointer items-center gap-3" onClick={closeIfMobile}>
            <img src={logoBlack} alt="Design Diaries" width={330} height={102} className="h-7 w-auto" />
            <span className="label-caps text-foreground">Admin</span>
          </Link>
          <div className="flex items-center gap-3">
            <p className="hidden text-sm text-foreground sm:block">{admin.email}</p>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
              className="cursor-pointer p-2 text-foreground transition-colors hover:text-primary"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 top-[4.25rem] z-30 bg-foreground/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-[4.25rem] right-0 bottom-0 z-40 flex w-64 flex-col overflow-hidden border-l border-border bg-background transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-6">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={closeIfMobile}
                className={cn(
                  "label-caps flex cursor-pointer items-center gap-3 px-4 py-3.5 text-[0.72rem] tracking-[0.18em] transition-colors hover:text-primary",
                  active ? "bg-secondary text-primary" : "text-foreground",
                )}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          onClick={onLogout}
          className="label-caps flex shrink-0 cursor-pointer items-center gap-3 border-t border-border px-7 py-5 text-left text-[0.72rem] tracking-[0.18em] text-foreground transition-colors hover:text-primary"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </aside>

      <div className={cn("transition-[padding] duration-300", open && "lg:pr-64")}>{children}</div>
    </div>
  );
}
