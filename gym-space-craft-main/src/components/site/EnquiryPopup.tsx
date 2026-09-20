import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useStartProjectLink } from "@/hooks/use-start-project-link";

const KEY = "dd-enquiry-popup-shown";

export function EnquiryPopup() {
  const [open, setOpen] = useState(false);
  const startProject = useStartProjectLink();

  useEffect(() => {
    if (sessionStorage.getItem(KEY)) return;
    const onScroll = () => {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (pct > 0.35) {
        setOpen(true);
        sessionStorage.setItem(KEY, "1");
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm">
      <div className="animate-in fade-in zoom-in-95 relative w-full max-w-md border border-border bg-card p-8 duration-500">
        <button
          aria-label="Close"
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 p-1 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X size={18} />
        </button>
        <p className="label-caps text-primary">Planning a gym?</p>
        <h3 className="mt-4 font-display text-3xl leading-tight uppercase">
          Tell us about your space
        </h3>
        <p className="mt-3 text-sm text-muted-foreground">
          Share your floor area, city and what you plan to build. Sagrika will review it and get back with an initial view on your space layout.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to={startProject.to}
            hash={startProject.hash}
            onClick={(event) => {
              startProject.onClick?.(event);
              setOpen(false);
            }}
            className="label-caps bg-primary px-6 py-3.5 text-primary-foreground transition-all duration-300 hover:bg-foreground active:scale-[0.97]"
          >
            Start a Project
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="label-caps px-4 py-3.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
