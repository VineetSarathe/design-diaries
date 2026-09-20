import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Crosshair, MoveRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";
import { VideoPlayButton } from "@/components/site/VideoPlayButton";
import { isVideoSrc, mediaPlaybackUrl, mediaPreviewUrl } from "@/lib/media";
import type { Project } from "@/data/projects";

type StoryKey = keyof Project["study"];

const chapters: { key: StoryKey; label: string; question: string }[] = [
  { key: "brief", label: "The brief", question: "What needed to be built" },
  { key: "user", label: "The user", question: "Who the space needed to serve" },
  { key: "challenge", label: "The constraint", question: "What stood in the way" },
  { key: "decisions", label: "The move", question: "What changed in the plan" },
  { key: "outcome", label: "The result", question: "What improved in use" },
  { key: "learning", label: "The learning", question: "What we take forward" },
];

export function ProjectVisualStory({ project }: { project: Project }) {
  const visuals = useMemo(() => {
    const source = [
      { src: project.hero, alt: `${project.name} main training floor`, caption: project.insight },
      { src: project.card, alt: `${project.name} interior`, caption: "The designed floor in use" },
      ...project.gallery,
      ...(project.plan ? [project.plan] : []),
    ];
    return source.filter((item, index) => source.findIndex((candidate) => candidate.src === item.src) === index);
  }, [project]);

  const [activeVisual, setActiveVisual] = useState(0);
  const [playing, setPlaying] = useState(false);
  const active = visuals[activeVisual];

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const currentIsVideo = Boolean(active?.src && isVideoSrc(active.src));
  const previewSrc = active?.src ? mediaPreviewUrl(active.src, 1400) : "";
  const playbackSrc = active?.src && currentIsVideo ? mediaPlaybackUrl(active.src, 1280) : "";

  useEffect(() => {
    if (visuals.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (currentIsVideo) return;
    const timer = window.setInterval(() => setActiveVisual((value) => (value + 1) % visuals.length), 4200);
    return () => window.clearInterval(timer);
  }, [visuals.length, currentIsVideo]);

  useEffect(() => {
    setPlaying(false);
    const video = videoRef.current;
    if (video) {
      video.pause();
      try {
        video.currentTime = 0;
      } catch {
        /* ignore */
      }
    }
    const next = visuals[(activeVisual + 1) % Math.max(visuals.length, 1)];
    if (!next?.src) return;
    const img = new Image();
    img.src = mediaPreviewUrl(next.src, 1400);
  }, [activeVisual, currentIsVideo, visuals]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!currentIsVideo || !video) return;
    if (!video.paused) {
      video.pause();
      setPlaying(false);
      return;
    }
    video.muted = false;
    video.volume = 1;
    void video
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  };

  const move = (direction: number) => {
    setActiveVisual((value) => (value + direction + visuals.length) % visuals.length);
  };

  return (
    <>
      <section className="blend-ink overflow-hidden text-background">
        <div className="mx-auto max-w-[110rem] px-5 py-20 md:px-10 md:py-28">
          <Reveal className="grid items-end gap-8 border-b border-background/15 pb-10 lg:grid-cols-[0.65fr_1.35fr]">
            <div>
              <p className="label-caps text-primary">Inside the project</p>
              <p className="mt-5 max-w-sm text-background/60">
                {project.detail?.visualIntro ??
                  "A visual walkthrough of the floor logic materials and decisions behind the finished space"}
              </p>
            </div>
            <h2 className="display-statement max-w-5xl lg:text-right">
              {project.detail?.visualHeadline ?? (
                <>
                  Built around <span className="accent-italic">how people move</span>
                </>
              )}
            </h2>
          </Reveal>

          <div className="mt-10 lg:aspect-[16/8]">
            <div className="grid h-full gap-4 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,0.35fr)]">
              <Reveal className="relative h-full min-h-[18rem] min-w-0 overflow-hidden border border-background/15 bg-foreground">
                <div className="relative h-full min-h-[18rem] aspect-[4/3] sm:aspect-[16/9] lg:aspect-auto">
                  {previewSrc ? (
                    <img
                      key={previewSrc}
                      src={previewSrc}
                      alt={active?.alt}
                      loading="eager"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover opacity-75"
                    />
                  ) : null}
                  {currentIsVideo && playbackSrc ? (
                    <video
                      ref={videoRef}
                      src={playbackSrc}
                      poster={previewSrc}
                      loop
                      playsInline
                      preload="none"
                      onPlay={() => setPlaying(true)}
                      onPause={() => setPlaying(false)}
                      className={cn(
                        "absolute inset-0 h-full w-full object-cover",
                        playing ? "opacity-75" : "opacity-0",
                      )}
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-foreground/10" />
                  {currentIsVideo && (
                    <VideoPlayButton
                      playing={playing}
                      label={playing ? `Pause video of ${project.name}` : `Play video of ${project.name}`}
                      onToggle={togglePlay}
                    />
                  )}
                  <div className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-5 p-5 md:p-8">
                    <div className="max-w-lg">
                      <p className="label-caps text-primary">Frame 0{activeVisual + 1}</p>
                      <p className="mt-2 text-sm text-background/80 md:text-base">{active?.caption ?? active?.alt}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button type="button" variant="ghost" size="icon" onClick={() => move(-1)} aria-label="Previous project image" className="rounded-full border border-background/30 bg-foreground/35 text-background hover:border-primary hover:bg-foreground/60 hover:text-primary">
                        <ArrowLeft size={16} />
                      </Button>
                      <Button type="button" variant="ghost" size="icon" onClick={() => move(1)} aria-label="Next project image" className="rounded-full border border-background/30 bg-foreground/35 text-background hover:border-primary hover:bg-foreground/60 hover:text-primary">
                        <ArrowRight size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </Reveal>

              <div className="grid min-h-0 min-w-0 grid-cols-3 gap-3 lg:h-full lg:grid-cols-1 lg:grid-rows-3">
                {visuals.slice(0, 3).map((visual, index) => (
                  <Button
                    type="button"
                    variant="ghost"
                    key={visual.src}
                    onClick={() => setActiveVisual(index)}
                    aria-label={`Show project image ${index + 1}`}
                    aria-pressed={index === activeVisual}
                    className={cn(
                      "group relative h-auto min-h-0 min-w-0 overflow-hidden rounded-none border p-0 transition-colors duration-500 hover:bg-transparent lg:h-full",
                      index === activeVisual ? "border-primary" : "border-background/15 hover:border-background/45",
                    )}
                  >
                    <img src={mediaPreviewUrl(visual.src, 400)} alt="" loading="lazy" decoding="async" className="aspect-square h-full w-full object-cover opacity-60 transition-all duration-700 group-hover:scale-105 group-hover:opacity-90 lg:aspect-auto" />
                    <span className="label-caps absolute top-3 left-3 text-background">0{index + 1}</span>
                    <span className={cn("absolute inset-x-0 bottom-0 h-0.5 origin-left bg-primary transition-transform duration-700", index === activeVisual ? "scale-x-100" : "scale-x-0")} />
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="blend-cream-bottom overflow-hidden">
        <div className="mx-auto max-w-[110rem] px-5 py-20 md:px-10 md:py-28">
          <Reveal className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <div>
              <p className="label-caps text-primary">The case study</p>
              <h2 className="display-lg mt-4">Six decisions from shell to opening</h2>
            </div>
            <p className="max-w-xl text-muted-foreground lg:justify-self-end">
              The project is shown in the same order it was solved — beginning with the business brief and ending with what the studio carried forward
            </p>
          </Reveal>

          <div className="mt-14">
            {chapters.map((chapter, index) => {
              const visual = visuals[index % visuals.length];
              return (
                <Reveal key={chapter.key} delay={(index % 3) * 70} className="group grid gap-6 border-t border-border py-9 md:grid-cols-[5rem_0.65fr_1fr] md:gap-10 lg:py-12">
                  <div className="flex items-start justify-between md:block">
                    <span className="font-serif text-4xl italic text-primary">0{index + 1}</span>
                    <span className="mt-3 hidden h-px w-8 bg-primary transition-all duration-700 group-hover:w-14 md:block" />
                  </div>
                  <div>
                    <p className="label-caps text-primary">{chapter.label}</p>
                    <h3 className="mt-3 font-display text-xl uppercase leading-tight">{chapter.question}</h3>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-[11rem_minmax(0,1fr)] sm:items-center">
                    {visual && (
                      <div className="aspect-[4/3] w-full min-h-[7.5rem] shrink-0 overflow-hidden border border-border">
                        <img src={mediaPreviewUrl(visual.src, 360)} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      </div>
                    )}
                    <p className="leading-relaxed text-muted-foreground">{project.study[chapter.key]}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

export function ProjectPlanFeature({ project }: { project: Project }) {
  if (!project.plan) return null;
  return (
    <section className="blend-ink overflow-hidden text-background">
      <div className="mx-auto grid max-w-[110rem] gap-10 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
        <Reveal className="group relative overflow-hidden border border-background/15 bg-background/5">
          <img src={project.plan.src} alt={project.plan.alt} loading="lazy" className="aspect-[4/3] w-full object-cover opacity-80 transition-transform duration-[1200ms] group-hover:scale-[1.035]" />
          <div aria-hidden className="absolute top-[24%] left-[28%] h-20 w-28 border border-primary/75 shadow-[0_0_30px_color-mix(in_oklab,var(--primary)_30%,transparent)] transition-transform duration-700 group-hover:translate-x-3 md:h-28 md:w-40" />
          <div aria-hidden className="absolute top-[42%] left-[48%] flex h-10 w-10 items-center justify-center rounded-full border border-primary bg-foreground/70 text-primary">
            <Crosshair size={18} className="animate-pulse" />
          </div>
          <p className="label-caps absolute bottom-4 left-4 bg-foreground/80 px-3 py-2 text-primary">Zoning study</p>
        </Reveal>
        <Reveal delay={100}>
          <p className="label-caps text-primary">Plan before palette</p>
          <h2 className="display-lg mt-4">
            {project.detail?.planHeadline ?? "The drawing that unlocked the floor"}
          </h2>
          <p className="mt-6 max-w-lg leading-relaxed text-background/65">{project.plan.caption}</p>
          <div className="mt-9 flex items-center gap-4 border-t border-background/15 pt-6">
            <MoveRight className="text-primary" size={22} />
            <p className="label-caps text-background/65">
              {project.detail?.planTags ?? "Movement equipment sightlines operations"}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function ProjectOutcomeRail({ project }: { project: Project }) {
  const outcomes = (
    project.detail?.outcomes ?? [
      { k: "Project insight", v: project.insight },
      { k: "Footprint", v: project.area },
      { k: "Completed", v: project.year },
      { k: "Format", v: project.clientType },
    ]
  ).filter((item) => item.v);
  return (
    <section className="border-y border-border bg-card">
      <div
        className={cn(
          "mx-auto grid max-w-[110rem] sm:grid-cols-2",
          outcomes.length === 1 && "lg:grid-cols-1",
          outcomes.length === 2 && "lg:grid-cols-2",
          outcomes.length === 3 && "lg:grid-cols-3",
          outcomes.length >= 4 && "lg:grid-cols-4",
        )}
      >
        {outcomes.map((item, index) => (
          <Reveal key={item.k} delay={index * 70} className="group border-b border-border px-5 py-8 sm:border-r lg:border-b-0 md:px-8">
            <p className="label-caps text-primary">0{index + 1} {item.k}</p>
            <p className="mt-4 font-display text-base uppercase leading-snug transition-transform duration-500 group-hover:translate-x-1">{item.v}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}