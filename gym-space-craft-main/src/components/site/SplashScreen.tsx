import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const hide = window.setTimeout(() => setVisible(false), 1100);
    const remove = window.setTimeout(() => setMounted(false), 1550);
    return () => {
      window.clearTimeout(hide);
      window.clearTimeout(remove);
    };
  }, []);

  if (!visible && !mounted) return null;

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "fixed inset-0 z-[200] flex items-center justify-center bg-black transition-opacity duration-400 ease-out",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <div className="flex h-[1.35em] w-full items-center justify-center overflow-hidden text-4xl md:text-5xl">
        <p className="splash-word text-center font-display font-bold uppercase text-white">
          DESIGNDIARIES
        </p>
      </div>
    </div>
  );
}
