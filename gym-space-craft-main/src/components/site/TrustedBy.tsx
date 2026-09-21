import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";
import { useClientLogos } from "@/hooks/use-client-logos";
import { mediaPreviewUrl } from "@/lib/media";

/** Studio network logo rail. */
export function TrustedBy({ compact = false }: { compact?: boolean }) {
  const { logos } = useClientLogos();
  const row = logos.length ? [...logos, ...logos] : [];

  return (
    <section className={cn(compact ? "border-b border-border bg-background" : "bg-transparent")}>
      <div className={cn("mx-auto max-w-[110rem] px-5 md:px-10", compact ? "pt-14 pb-12 md:pt-20 md:pb-16" : "pt-6 pb-16 md:pt-10 md:pb-24")}>
        <Reveal>
          <div className="max-w-4xl">
            <p className="label-caps text-primary">Studio network</p>
            {compact ? (
              <h2 className="display-lg mt-4">Built with the brands that trust us</h2>
            ) : (
            <h2 className="display-statement mt-6">
              Built with the brands
              <br />
              <span className="text-primary">that trust us</span>
            </h2>
            )}
          </div>
        </Reveal>
        {row.length > 0 && (
          <div className={cn("relative overflow-hidden py-8", compact ? "mt-7" : "mt-14")}>
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
            <div className="logo-rail items-center gap-8 sm:gap-10 md:gap-12">
              {row.map((logo, i) => (
                <img
                  key={`${logo.id}-${i}`}
                  src={mediaPreviewUrl(logo.imageUrl, 400)}
                  alt={`${logo.name} logo`}
                  loading="lazy"
                  className="h-12 w-auto max-h-16 shrink-0 object-contain sm:h-14 sm:max-h-20 md:h-16 md:max-h-24"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
