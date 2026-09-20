import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { VideoPlayButton } from "@/components/site/VideoPlayButton";

export type RecognitionMedia = {
  url: string;
  kind: "image" | "video";
};

export type RecognitionItem = {
  number: string;
  category: string;
  title: string;
  year: string;
  image: string;
  images?: string[];
  media?: RecognitionMedia[];
  description?: string;
  slug?: string;
  link?: string;
};

function isVideoSrc(url: string, kind?: string) {
  if (kind === "video") return true;
  return /\.(mp4|webm|mov)(\?|$)/i.test(url) || url.includes("/video/upload/");
}

type RecognitionCardProps = {
  item: RecognitionItem;
  active: boolean;
  onActivate: () => void;
  register: (node: HTMLElement | null) => void;
};

export function RecognitionCard({ item, active, onActivate, register }: RecognitionCardProps) {
  const gallery: RecognitionMedia[] = Array.from(
    new Map(
      (item.media?.length
        ? [{ url: item.image, kind: "image" as const }, ...item.media]
        : Array.from(new Set([item.image, ...(item.images ?? [])])).map((url) => ({
            url,
            kind: (isVideoSrc(url) ? "video" : "image") as const,
          }))
      ).map((entry) => [entry.url, entry]),
    ).values(),
  );
  const [imageIndex, setImageIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const swipeStart = useRef<number | null>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const current = gallery[imageIndex];
  const currentIsVideo = Boolean(current && isVideoSrc(current.url, current.kind));

  const advance = () => {
    if (gallery.length < 2) return;
    setImageIndex((currentIndex) => (currentIndex + 1) % gallery.length);
  };

  const changeImage = (direction: number) => {
    if (gallery.length < 2) return;
    setImageIndex((currentIndex) => (currentIndex + direction + gallery.length) % gallery.length);
  };

  useEffect(() => {
    if (!hovered || gallery.length < 2 || currentIsVideo) return;
    const timer = window.setTimeout(advance, 1000);
    return () => window.clearTimeout(timer);
  }, [hovered, gallery.length, imageIndex, currentIsVideo]);

  useEffect(() => {
    setPlaying(false);
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      video.muted = true;
      video.volume = 0;
      video.pause();
      if (index !== imageIndex) {
        try {
          video.currentTime = 0;
        } catch {
          /* ignore seek errors on unloaded sources */
        }
      }
    });
  }, [imageIndex]);

  useEffect(() => {
    const video = videoRefs.current[imageIndex];
    if (!currentIsVideo || !video) {
      if (!hovered) setPlaying(false);
      return;
    }
    video.muted = true;
    video.volume = 0;
    video.loop = false;
    if (!hovered) {
      video.pause();
      setPlaying(false);
      return;
    }
    void video
      .play()
      .then(() => setPlaying(true))
      .catch(() => {
        setPlaying(false);
        if (hovered) window.setTimeout(advance, 1000);
      });
  }, [hovered, imageIndex, currentIsVideo]);

  useEffect(() => {
    if (hovered || active) return;
    setPlaying(false);
    videoRefs.current.forEach((video) => video?.pause());
  }, [active, hovered]);

  const togglePlay = () => {
    const video = videoRefs.current[imageIndex];
    if (!video) return;
    onActivate();
    video.muted = true;
    video.volume = 0;
    if (!video.paused) {
      video.pause();
      setPlaying(false);
      return;
    }
    void video
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" && gallery.length > 1) swipeStart.current = event.clientX;
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (swipeStart.current === null || event.pointerType === "mouse") return;
    const distance = event.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(distance) > 42) changeImage(distance > 0 ? -1 : 1);
  };

  const cardContent = (
    <>
      <div
        className="relative z-20 aspect-[4/3] touch-pan-y overflow-hidden bg-muted md:aspect-[5/4]"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          swipeStart.current = null;
        }}
      >
        {gallery.map((entry, index) =>
          isVideoSrc(entry.url, entry.kind) ? (
            <video
              key={`${entry.url}-${index}`}
              ref={(node) => {
                videoRefs.current[index] = node;
              }}
              src={entry.url}
              muted
              playsInline
              preload="metadata"
              onPlay={() => {
                if (index === imageIndex) setPlaying(true);
              }}
              onPause={() => {
                if (index === imageIndex) setPlaying(false);
              }}
              onEnded={() => {
                if (index === imageIndex && hovered) advance();
              }}
              aria-label={`${item.title}, ${item.category.toLowerCase()}, ${item.year}${index ? `, video ${index + 1}` : ""}`}
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none",
                index === imageIndex ? "opacity-100" : "pointer-events-none opacity-0",
                active && index === imageIndex && "scale-[1.06]",
              )}
            />
          ) : (
            <img
              key={`${entry.url}-${index}`}
              src={entry.url}
              alt={`${item.title}, ${item.category.toLowerCase()}, ${item.year}${index ? `, view ${index + 1}` : ""}`}
              loading="lazy"
              width={960}
              height={768}
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none",
                index === imageIndex ? "opacity-100" : "pointer-events-none opacity-0",
                active && index === imageIndex && "scale-[1.06]",
              )}
            />
          ),
        )}
        <span
          className={cn(
            "pointer-events-none absolute inset-0 transition-colors duration-500 motion-reduce:transition-none",
            isVideoSrc(gallery[imageIndex]?.url, gallery[imageIndex]?.kind)
              ? active
                ? "bg-foreground/10"
                : "bg-foreground/5"
              : active
                ? "bg-foreground/25"
                : "bg-foreground/5",
          )}
        />
        <span className="label-caps absolute top-3 left-3 z-20 bg-foreground px-2.5 py-1.5 text-background">
          {item.number}
        </span>
        {currentIsVideo && !hovered && (
          <VideoPlayButton
            playing={playing}
            label={playing ? `Pause video of ${item.title}` : `Play video of ${item.title}`}
            onToggle={togglePlay}
          />
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={gallery.length > 1 ? `Next image of ${item.title}` : item.title}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            changeImage(1);
          }}
          onPointerDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          className={cn(
            "pointer-events-auto absolute top-3 right-3 z-30 h-10 w-10 rounded-full border backdrop-blur-sm hover:border-primary hover:bg-primary hover:text-primary-foreground",
            active
              ? "border-primary bg-primary text-primary-foreground"
              : "border-background/65 bg-foreground/15 text-background",
          )}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex min-h-44 flex-1 flex-col px-5 py-5">
        <div className="flex items-start justify-between gap-4">
          <p className={cn("label-caps transition-colors duration-500", active ? "text-primary" : "text-muted-foreground")}>
            {item.category}
          </p>
          <p className={cn("label-caps transition-colors duration-500", active ? "text-background/60" : "text-muted-foreground")}>
            {item.year}
          </p>
        </div>
        <h3 className={cn("display-md mt-3 transition-colors duration-500", active ? "text-background" : "text-foreground")}>
          {item.title}
        </h3>
        {item.description ? (
          <p
            className={cn(
              "mt-3 text-sm leading-relaxed transition-[opacity,color] duration-500",
              active ? "text-background/65 opacity-100" : "text-muted-foreground opacity-80",
            )}
          >
            {item.description}
          </p>
        ) : null}
        <div className={cn("mt-auto flex items-center justify-between border-t pt-4 transition-colors duration-500", active ? "border-background/20" : "border-border")}>
          <span className={cn("label-caps transition-colors duration-500", active ? "text-background/55" : "text-muted-foreground")}>
            View recognition
          </span>
          <ArrowRight className={cn("h-4 w-4 transition-[color,transform] duration-300 motion-reduce:transform-none", active ? "translate-x-1 text-primary" : "text-muted-foreground")} />
        </div>
      </div>
    </>
  );

  return (
    <article
      ref={register}
      onMouseEnter={() => {
        onActivate();
        setHovered(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
        setImageIndex(0);
        setPlaying(false);
      }}
      onFocusCapture={onActivate}
      data-active={active}
      className={cn(
        "group relative flex h-full snap-center flex-col overflow-hidden border transition-[transform,opacity,background-color,border-color] duration-500 ease-out focus-within:z-10 motion-reduce:transform-none motion-reduce:transition-none",
        "w-[84vw] shrink-0 sm:w-[58vw] md:w-[44vw] lg:w-[calc((100%-3rem)/3)]",
        active
          ? "z-10 scale-[1.02] border-foreground bg-foreground opacity-100 lg:scale-[1.03]"
          : "border-border bg-card opacity-80 hover:opacity-100",
      )}
    >
      {cardContent}
      <a
        href={item.link ?? (item.slug ? `/about#${item.slug}` : "/about#recognition")}
        aria-label={`View recognition: ${item.title}`}
        className="absolute inset-0 z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-primary"
      />
    </article>
  );
}

export function RecognitionCards({ items }: { items: RecognitionItem[] }) {
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const skipScrollSync = useRef(false);

  useEffect(() => {
    if (items.length === 0) setActive(0);
    else if (active > items.length - 1) setActive(items.length - 1);
  }, [active, items.length]);

  const select = (index: number) => {
    if (!items.length) return;
    const next = (index + items.length) % items.length;
    skipScrollSync.current = true;
    setActive(next);
    const track = trackRef.current;
    const card = cardRefs.current[next];
    if (track && card) {
      const cardLeft = card.offsetLeft;
      const cardRight = cardLeft + card.offsetWidth;
      const viewLeft = track.scrollLeft;
      const viewRight = viewLeft + track.clientWidth;
      if (cardLeft < viewLeft) {
        track.scrollTo({ left: cardLeft, behavior: "smooth" });
      } else if (cardRight > viewRight) {
        track.scrollTo({ left: cardRight - track.clientWidth, behavior: "smooth" });
      }
    }
    window.setTimeout(() => {
      skipScrollSync.current = false;
    }, 450);
  };

  const handleTrackScroll = () => {
    if (skipScrollSync.current || !trackRef.current) return;
    if (!window.matchMedia("(max-width: 767px)").matches) return;
    const center = trackRef.current.getBoundingClientRect().left + trackRef.current.clientWidth / 2;
    let nearest = 0;
    let distance = Number.POSITIVE_INFINITY;
    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const nextDistance = Math.abs(rect.left + rect.width / 2 - center);
      if (nextDistance < distance) {
        distance = nextDistance;
        nearest = index;
      }
    });
    setActive(nearest);
  };

  const handleKeys = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      select(active - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      select(active + 1);
    }
  };

  if (!items.length) return null;

  return (
    <div onKeyDown={handleKeys}>
        <div
          ref={trackRef}
          onScroll={handleTrackScroll}
          className="-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 py-4 [scrollbar-width:none] md:-mx-10 md:px-10 lg:mx-0 lg:gap-6 lg:overflow-x-auto lg:px-0 lg:py-5 [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item, index) => (
            <RecognitionCard
              key={`${item.number}-${item.title}`}
              item={item}
              active={active === index}
              onActivate={() => setActive(index)}
              register={(node) => {
                cardRefs.current[index] = node;
              }}
            />
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between pt-6 pb-2">
          <p className="label-caps hidden items-center gap-4 text-muted-foreground sm:flex">
            <span className="h-px w-12 bg-primary/45" />
            Spaces that move people
          </p>
          <div className="ml-auto flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Previous recognition"
              onClick={() => select(active - 1)}
              className="h-11 w-11 rounded-full border-border bg-transparent hover:border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <ArrowLeft />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Next recognition"
              onClick={() => select(active + 1)}
              className="h-11 w-11 rounded-full border-border bg-transparent hover:border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <ArrowRight />
            </Button>
            <span className="label-caps ml-3 min-w-16 text-muted-foreground" aria-live="polite">
              {String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </span>
          </div>
        </div>
    </div>
  );
}

export function RecognitionSection({ items }: { items: RecognitionItem[] }) {
  if (!items.length) return null;

  return (
    <section className="bg-secondary" aria-labelledby="recognition-heading">
      <div className="mx-auto max-w-[110rem] px-5 pt-16 pb-0 md:px-10 md:pt-24">
        <Reveal className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div>
            <p className="label-caps flex items-center gap-4 text-primary">
              Recognition
              <span className="h-px w-16 bg-primary/40" />
            </p>
            <h2 id="recognition-heading" className="display-statement mt-4 lg:whitespace-nowrap">
              Trusted Recognised
              <br />
              <span className="accent-italic">Making an impact</span>
              <span className="heading-rule" aria-hidden="true" />
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground lg:justify-self-end">
            Awards, press features and industry recognition that follow function-first work.
          </p>
        </Reveal>

        <RecognitionCards items={items} />
      </div>
      <div aria-hidden className="seam-sand-to-ink" />
    </section>
  );
}

export const Recognition = RecognitionSection;