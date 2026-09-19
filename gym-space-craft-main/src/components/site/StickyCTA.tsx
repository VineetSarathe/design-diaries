import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function StickyCTA() {
  const [show, setShow] = useState(false);
  const [overFooter, setOverFooter] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = document.getElementById("site-footer-legal");
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setOverFooter(entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Link
      to="/start-a-project"
      className={cn(
        "label-caps fixed right-8 z-40 hidden bg-primary px-6 py-4 text-primary-foreground shadow-lg transition-all duration-500 hover:bg-foreground active:scale-[0.97] md:block",
        overFooter ? "bottom-28" : "bottom-8",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
      )}
    >
      Start a Project
    </Link>
  );
}
