import { cn } from "@/lib/utils";

/** Full-bleed oversized statement band — a scrolling manifesto line between sections. */
export function Statement({
  words,
  tone = "ink",
  blend,
  className,
}: {
  words: string[];
  tone?: "ink" | "cream";
  blend?: "sand";
  className?: string;
}) {
  const row = [...words, ...words];
  const blendSand = blend === "sand";
  return (
    <section
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden",
        blendSand ? "border-t border-background/10 bg-[var(--ink)] pt-6 pb-5 md:pt-8 md:pb-6 text-background" : "py-6 md:py-8",
        !blendSand && tone === "ink"
          ? "border-t border-b border-background/10 bg-foreground text-background"
          : "",
        !blendSand && tone === "cream"
          ? "border-y border-border bg-secondary text-foreground"
          : "",
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
