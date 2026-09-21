import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ArrowUpRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";
import { isVideoSrc, mediaPlaybackUrl, mediaPreviewUrl } from "@/lib/media";
import { VideoPlayButton } from "@/components/site/VideoPlayButton";

export type ProjectCardData = {
  slug: string;
  name: string;
  category: string;
  location: string;
  area: string;
  year: string;
  insight: string;
  images: string[];
  captions?: string[];
  clientType?: string;
  cardLabel?: string;
  hideCardMeta?: boolean;
};

function imagesFromProject(project: Project) {
  if (project.cardImages) {
    return Array.from(new Set(project.cardImages.filter(Boolean)));
  }
  return Array.from(
    new Set(
      [
        project.card,
        project.hero,
        ...project.gallery.map((image) => image.src),
        ...(project.plan ? [project.plan.src] : []),
      ].filter(Boolean),
    ),
  );
}

function captionFor(project: Project, src: string) {
  const fromGallery = project.gallery.find((image) => image.src === src)?.caption;
  if (fromGallery) return fromGallery;
  if (project.plan?.src === src) return project.plan.caption;
  return project.insight;
}

export function toProjectCardData(project: Project): ProjectCardData {
  const images = imagesFromProject(project);
  return {
    slug: project.slug,
    name: project.name,
    category: project.category,
    location: project.location,
    area: project.area,
    year: project.year,
    insight: project.insight,
    images,
    captions: images.map((src) => captionFor(project, src)),
    clientType: project.clientType,
    cardLabel: project.cardLabel,
    hideCardMeta: project.hideCardMeta,
  };
}

export function ProjectCard({
  project,
  number = 1,
  className,
  onPreviewChange,
  uncropped = false,
}: {
  project: Project | ProjectCardData;
  number?: number;
  className?: string;
  onPreviewChange?: (src: string | null) => void;
  uncropped?: boolean;
}) {
  const card = useMemo(
    () => ("images" in project ? project : toProjectCardData(project)),
    [project],
  );
  const images = card.images.length ? card.images : [];
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [isTouchUi, setIsTouchUi] = useState(false);
  const [mobileInView, setMobileInView] = useState(false);
  const cycling = isTouchUi ? mobileInView : hovered;
  const safeActive = images.length ? Math.min(active, images.length - 1) : 0;
  const swipeStart = useRef<number | null>(null);
  const didSwipe = useRef(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cardRef = useRef<HTMLElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const activeSrc = images[safeActive];
  const activeCaption = card.captions?.[safeActive] || card.insight;
  const activeIsVideo = Boolean(activeSrc && isVideoSrc(activeSrc));
  const previewSrc = activeSrc ? mediaPreviewUrl(activeSrc, uncropped ? 1400 : 800) : "";
  const playbackSrc = activeSrc && activeIsVideo ? mediaPlaybackUrl(activeSrc, 720) : "";
  const eager = number <= 3;
  const showVideo = Boolean(activeIsVideo && (playing || cycling));

  const advance = () => {
    if (images.length < 2) return;
    setActive((current) => (current + 1) % images.length);
  };

  useEffect(() => {
    if (!cycling || images.length < 2 || activeIsVideo) return;
    const timer = window.setTimeout(advance, 1400);
    return () => window.clearTimeout(timer);
  }, [cycling, images.length, safeActive, activeIsVideo]);

  const previewCb = useRef(onPreviewChange);
  previewCb.current = onPreviewChange;

  useEffect(() => {
    if (!cycling) {
      previewCb.current?.(null);
      return;
    }
    if (activeSrc) previewCb.current?.(activeSrc);
  }, [cycling, activeSrc]);

  useEffect(() => () => previewCb.current?.(null), []);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none)");
    const sync = () => setIsTouchUi(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = cardRef.current;
    if (!el || !isTouchUi) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const on = Boolean(entry?.isIntersecting && (entry.intersectionRatio ?? 0) >= 0.45);
        setMobileInView(on);
        if (!on) {
          setActive(0);
          setPlaying(false);
        }
      },
      { threshold: [0.45, 0.65, 0.85] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [isTouchUi]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !activeIsVideo) {
      setPlaying(false);
      return;
    }
    video.muted = true;
    video.volume = 0;
    if (!cycling) {
      video.pause();
      try {
        video.currentTime = 0;
      } catch {
        /* ignore */
      }
      setPlaying(false);
      return;
    }
    void video
      .play()
      .then(() => setPlaying(true))
      .catch(() => {
        setPlaying(false);
        if (cycling) window.setTimeout(advance, 1000);
      });
  }, [cycling, safeActive, activeIsVideo, playbackSrc]);

  useEffect(() => {
    const next = images[(safeActive + 1) % Math.max(images.length, 1)];
    if (!next || images.length < 2) return;
    const img = new Image();
    img.src = mediaPreviewUrl(next, 800);
  }, [images, safeActive]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!activeIsVideo || !video) return;
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

  const showPrevious = () => {
    if (images.length < 2) return;
    setActive((current) => (current - 1 + images.length) % images.length);
  };

  const showNext = () => {
    if (images.length < 2) return;
    setActive((current) => (current + 1) % images.length);
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") {
      swipeStart.current = event.clientX;
      didSwipe.current = false;
    }
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (swipeStart.current === null || event.pointerType === "mouse") return;
    const distance = event.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(distance) < 42) return;
    didSwipe.current = true;
    if (distance > 0) showPrevious();
    else showNext();
  };

  return (
    <article
      ref={cardRef}
      className={cn(
        "group relative z-0 flex h-full w-full min-w-0 cursor-pointer flex-col border border-border bg-card transition-[transform,border-color,box-shadow,background-color] duration-500 ease-out hover:z-20 hover:-translate-y-2 hover:scale-[1.03] hover:border-foreground hover:bg-foreground hover:shadow-[0_40px_80px_-40px_rgba(0,0,0,0.65)] focus-within:z-20 focus-within:-translate-y-2 focus-within:scale-[1.03] focus-within:border-foreground focus-within:bg-foreground motion-reduce:transform-none motion-reduce:transition-none",
        isTouchUi &&
          mobileInView &&
          "z-20 border-foreground bg-foreground shadow-[0_40px_80px_-40px_rgba(0,0,0,0.65)]",
        className,
      )}
      onMouseEnter={() => {
        if (isTouchUi) return;
        setHovered(true);
      }}
      onMouseLeave={() => {
        if (isTouchUi) return;
        setHovered(false);
        setActive(0);
        setPlaying(false);
      }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        swipeStart.current = null;
      }}
    >
      <div
        className={cn(
          "relative touch-pan-y overflow-hidden bg-foreground",
          uncropped ? "min-h-[12rem]" : "aspect-[5/4]",
        )}
      >
        {previewSrc ? (
          <img
            key={previewSrc}
            src={previewSrc}
            alt={`${card.name} in ${card.location}`}
            loading={eager ? "eager" : "lazy"}
            fetchPriority={eager ? "high" : "low"}
            decoding="async"
            width={uncropped ? 1400 : 800}
            height={uncropped ? 1050 : 640}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className={cn(
              "transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none",
              uncropped
                ? "relative z-0 h-auto w-full object-contain object-center"
                : cn(
                    "absolute inset-0 h-full w-full object-cover",
                    (cycling || (isTouchUi && mobileInView)) && "scale-[1.12]",
                    "group-hover:scale-[1.12]",
                  ),
            )}
          />
        ) : null}
        {activeIsVideo && playbackSrc ? (
          <video
            ref={videoRef}
            src={playbackSrc}
            poster={previewSrc}
            muted
            playsInline
            preload="none"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => {
              setPlaying(false);
              if (cycling) advance();
            }}
            onError={() => {
              setPlaying(false);
              if (cycling) window.setTimeout(advance, 1000);
            }}
            aria-label={`${card.name} in ${card.location}, video ${safeActive + 1}`}
            className={cn(
              "absolute inset-0 h-full w-full",
              uncropped ? "object-contain" : "object-cover",
              showVideo ? "opacity-100" : "opacity-0",
            )}
          />
        ) : null}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-foreground/0 transition-colors duration-500 group-hover:bg-foreground/55 group-focus-within:bg-foreground/55 motion-reduce:transition-none",
            isTouchUi && mobileInView && "bg-foreground/55",
          )}
        />

        <span className="label-caps absolute top-3 left-3 z-20 bg-foreground px-2.5 py-1.5 text-background">
          {String(number).padStart(2, "0")}
        </span>

        <span
          className={cn(
            "absolute top-3 right-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-background/65 bg-foreground/15 text-background backdrop-blur-sm transition-[background-color,border-color,color] duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground group-focus-within:border-primary group-focus-within:bg-primary group-focus-within:text-primary-foreground",
            isTouchUi && mobileInView && "border-primary bg-primary text-primary-foreground",
          )}
        >
          <ArrowUpRight
            className={cn(
              "h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-focus-within:translate-x-0.5 group-focus-within:-translate-y-0.5 motion-reduce:transform-none",
              isTouchUi && mobileInView && "translate-x-0.5 -translate-y-0.5",
            )}
          />
        </span>

        {images.length > 1 && (
          <div className="pointer-events-none absolute inset-x-3 top-1/2 z-30 hidden -translate-y-1/2 grid-cols-[auto_1fr_auto] items-center opacity-0 transition-opacity duration-300 md:grid md:group-hover:opacity-100 md:group-focus-within:opacity-100">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Previous image of ${card.name}`}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                showPrevious();
              }}
              className="pointer-events-auto h-9 w-9 shrink-0 rounded-full border border-background/55 bg-foreground/35 text-background shadow-none backdrop-blur-sm hover:border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <ArrowLeft />
            </Button>

            <span className="pointer-events-none" />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Next image of ${card.name}`}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                showNext();
              }}
              className="pointer-events-auto h-9 w-9 shrink-0 rounded-full border border-background/55 bg-foreground/35 text-background shadow-none backdrop-blur-sm hover:border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <ArrowRight />
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col px-5 pt-5 pb-4 transition-colors duration-500">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-4">
          <div className="min-w-0">
            <p className="label-caps text-primary">{card.cardLabel ?? card.category}</p>
            <h3
              className={cn(
                "display-md mt-2 text-foreground transition-colors duration-500 group-hover:text-background group-focus-within:text-background",
                isTouchUi && mobileInView && "text-background",
              )}
            >
              {card.name}
            </h3>
          </div>
          {card.clientType ? (
            <p
              className={cn(
                "label-caps max-w-full leading-snug tracking-[0.12em] text-muted-foreground transition-colors duration-500 group-hover:text-background/60 group-focus-within:text-background/60 sm:max-w-[11rem] sm:text-right sm:tracking-[0.2em] [word-break:break-word]",
                isTouchUi && mobileInView && "text-background/60",
              )}
            >
              {card.clientType}
            </p>
          ) : null}
        </div>

        <p
          className={cn(
            "mt-4 text-sm leading-relaxed text-muted-foreground transition-colors duration-500 group-hover:text-background/75 group-focus-within:text-background/75",
            isTouchUi && mobileInView && "text-background/75",
          )}
        >
          {activeCaption}
        </p>

        {(card.location || (!card.hideCardMeta && (card.area || card.year))) && (
          <div
            className={cn(
              "label-caps mt-5 grid grid-cols-[minmax(0,1fr)_auto] gap-4 border-t border-border pt-4 text-muted-foreground transition-colors duration-500 group-hover:border-background/25 group-hover:text-background/70 group-focus-within:border-background/25 group-focus-within:text-background/70",
              isTouchUi && mobileInView && "border-background/25 text-background/70",
            )}
          >
            <span className="min-w-0">{card.location}</span>
            {!card.hideCardMeta && (card.area || card.year) && (
              <span className="shrink-0 text-right">
                {[card.area, card.year].filter(Boolean).join(" · ")}
              </span>
            )}
          </div>
        )}

        {images.length > 1 && (
          <div
            className="relative z-20 mt-4 flex w-full min-w-0 gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label={`${card.name} image gallery`}
          >
            {images.slice(0, 3).map((src, index) => (
              <Button
                key={`${src}-thumbnail-${index}`}
                type="button"
                variant="ghost"
                aria-label={`Show image ${index + 1} of ${card.name}`}
                aria-pressed={safeActive === index}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setActive(index);
                }}
                className={cn(
                  "relative h-12 w-14 min-w-14 flex-1 shrink overflow-hidden rounded-none border bg-muted p-0 shadow-none transition-[border-color,opacity] duration-300 hover:bg-muted focus-visible:ring-primary sm:h-14",
                  safeActive === index
                    ? "border-primary opacity-100"
                    : "border-border opacity-65 hover:border-foreground/50 hover:opacity-100",
                )}
              >
                <img
                  src={mediaPreviewUrl(src, 160)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.04] motion-reduce:transition-none"
                />
                {isVideoSrc(src) && (
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-foreground/20">
                    <Play className="h-3.5 w-3.5 fill-background text-background" />
                  </span>
                )}
                {safeActive === index && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />}
              </Button>
            ))}
          </div>
        )}
      </div>

      <Link
        to="/work/$slug"
        params={{ slug: card.slug }}
        aria-label={`View ${card.name} case study`}
        onClick={(event) => {
          if (!didSwipe.current) return;
          event.preventDefault();
          didSwipe.current = false;
        }}
        className="absolute inset-0 z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      />

      {activeIsVideo && !cycling && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-50 aspect-[5/4]">
          <VideoPlayButton
            playing={playing}
            label={playing ? `Pause video of ${card.name}` : `Play video of ${card.name}`}
            onToggle={togglePlay}
          />
        </div>
      )}
    </article>
  );
}
