import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";
import { useClientLogos } from "@/hooks/use-client-logos";

/** Performance trust field: statement, proof link and pausable partner rail. */
export function TrustedBy({ compact = false }: { compact?: boolean }) {
  const { logos } = useClientLogos();
  const row = logos.length ? [...logos, ...logos] : [];

  return (
    <section className="border-b border-border bg-background">
      <div className={cn("mx-auto max-w-[110rem] px-5 md:px-10", compact ? "py-12 md:py-16" : "py-16 md:py-24")}>
        <Reveal>
          <div className="max-w-4xl">
            <p className="label-caps text-primary">Studio network</p>
            {compact ? (
              <h2 className="display-lg mt-4">Brands seen across our floors</h2>
            ) : (
              <h2 className="display-statement mt-6">
                Spaces Built
                <br />
                <span className="text-primary">Through Collaboration</span>
              </h2>
            )}
          </div>
        </Reveal>
        {row.length > 0 && (
          <div className={cn("group relative overflow-hidden py-8", compact ? "mt-7" : "mt-14")}>
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
            <div className="marquee-track items-center gap-8 group-hover:[animation-play-state:paused] sm:gap-10 md:gap-12">
              {row.map((logo, i) => (
                <span
                  key={`${logo.id}-${i}`}
                  className="h-16 w-16 shrink-0 overflow-hidden rounded-full sm:h-20 sm:w-20 md:h-24 md:w-24"
                >
                  <img
                    src={logo.imageUrl}
                    alt={`${logo.name} logo`}
                    loading="lazy"
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
