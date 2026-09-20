import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

const items = [
  {
    text: "New project: The Strength Culture, Jammu",
    to: "/work/$slug" as const,
    params: { slug: "iron-standard" },
  },
  {
    text: "New guide: The Gym Layout Checklist — free download",
    to: "/resources/downloads/$slug" as const,
    params: { slug: "first-time-gym-owners-planning-checklist" },
  },
  {
    text: "Journal: What equipment spacing really costs you",
    to: "/resources/blog/$slug" as const,
    params: { slug: "from-equipment-to-experience-the-evolution-of-fitness-spaces-in-india" },
  },
];

export function PromoBanner() {
  const [i, setI] = useState(0);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, []);

  const item = items[i] ?? items[0]!;

  if (!open) return null;

  return (
    <div className="relative z-[60] bg-foreground text-background">
      <div className="mx-auto flex max-w-[110rem] items-center justify-center gap-3 px-10 py-2.5 text-center">
        <Link
          key={i}
          to={item.to}
          params={item.params}
          className="animate-in fade-in label-caps text-[0.625rem] duration-700 hover:text-primary"
        >
          {item.text} <span className="ml-2">→</span>
        </Link>
        <button
          aria-label="Dismiss announcement"
          onClick={() => setOpen(false)}
          className="absolute right-4 p-1 text-background/60 transition-colors hover:text-background"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
