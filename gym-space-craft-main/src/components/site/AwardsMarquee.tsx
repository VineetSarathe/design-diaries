import { Reveal } from "./Reveal";
import { useClientLogos } from "@/hooks/use-client-logos";
import { mediaPreviewUrl } from "@/lib/media";

export function AwardsMarquee() {
  const { logos } = useClientLogos();
  const movingMarks = logos.length ? [...logos, ...logos] : [];

  return (
    <Reveal className="border-y border-background/15 py-8">
      <p className="label-caps mb-7 text-background/45">Selected studio network</p>
      {movingMarks.length > 0 && (
        <div className="group relative overflow-hidden">
          <span className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-foreground to-transparent md:w-28" />
          <span className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-foreground to-transparent md:w-28" />
            <div className="marquee-track items-center gap-10 group-hover:[animation-play-state:paused] md:gap-16">
              {movingMarks.map((mark, index) => (
                <img
                  key={`${mark.id}-${index}`}
                  src={mediaPreviewUrl(mark.imageUrl, 240)}
                  alt={`${mark.name} logo`}
                  loading="lazy"
                  className="h-10 w-auto max-h-14 shrink-0 object-contain md:h-12 md:max-h-16"
                />
              ))}
            </div>
        </div>
      )}
    </Reveal>
  );
}
