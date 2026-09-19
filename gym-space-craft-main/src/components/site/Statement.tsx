import { cn } from "@/lib/utils";

/** Full-bleed oversized statement band — a scrolling manifesto line between sections. */
export function Statement({
  words,
  tone = "ink",
  className,
}: {
  words: string[];
  tone?: "ink" | "cream";
  className?: string;
}) {
  const row = [...words, ...words];
  return (
    <section
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden border-y py-6 md:py-8",
        tone === "ink"
          ? "border-background/10 bg-foreground text-background"
          : "border-border bg-secondary text-foreground",
        className,
      )}
    >
      <div className="marquee-track items-center gap-10 md:gap-14">
        {row.map((w, i) => (
          <span key={`${w}-${i}`} className="flex shrink-0 items-center gap-10 md:gap-14">
            <span
              className={cn(
                "display-statement",
                i % 2 === 1 ? "text-primary" : "opacity-90",
              )}
            >
              {w}
            </span>
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          </span>
        ))}
      </div>
    </section>
  );
}
