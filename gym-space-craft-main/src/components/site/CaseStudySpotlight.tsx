import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Grip, Play } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";

export type CaseStudyImage = { src: string; alt: string; video?: string };

type Props = {
  eyebrow?: string;
  index?: string;
  meta: string;
  titleTop: string;
  titleBottom: string;
  kicker: string;
  summary: string;
  href: string;
  images: CaseStudyImage[];
  metrics: { v: string; l: string }[];
  note: string;
  journey: { n: string; t: string; d: string }[];
  journeyBackground: string;
};

export function CaseStudySpotlight({
  eyebrow = "Case study",
  index = "01 / Our gym projects",
  meta,
  titleTop,
  titleBottom,
  kicker,
  summary,
  href,
  images,
  metrics,
  note,
  journey,
  journeyBackground,
}: Props) {
  const [active, setActive] = useState(0);
  const [stage, setStage] = useState(0);
  const [journeyPaused, setJourneyPaused] = useState(false);
  const total = images.length;
  const go = (dir: number) => setActive((i) => (i + dir + total) % total);
  const current = images[active] ?? images[0]!;

  const selectStage = (index: number) => {
    setStage(index);
    setJourneyPaused(true);
  };

  useEffect(() => {
    if (total < 2) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % total), 1500);
    return () => window.clearInterval(id);
  }, [total]);

  useEffect(() => {
    if (!journey.length || journeyPaused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setStage((i) => (i + 1) % journey.length), 3200);
    return () => window.clearInterval(id);
  }, [journey.length, journeyPaused]);

  useEffect(() => {
    if (!journeyPaused) return;
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const id = window.setTimeout(() => setJourneyPaused(false), 4000);
    return () => window.clearTimeout(id);
  }, [journeyPaused, stage]);


  return (
    <section className="relative">
      {/* top bar */}
      <div className="bg-background">
        <div className="mx-auto flex max-w-[110rem] items-center justify-between gap-6 px-5 py-5 md:px-10">
          <p className="label-caps flex items-center gap-4 text-primary">
            {eyebrow}
            <span className="hidden h-px w-20 bg-primary/50 sm:block" />
          </p>
          <p className="label-caps flex items-center gap-3 text-muted-foreground">
            {index}
            <Grip size={16} className="text-foreground" aria-hidden />
          </p>
        </div>
      </div>

      {/* hero */}
      <div className="relative bg-foreground">
        <div className="relative grid lg:grid-cols-[minmax(0,1fr)_9.5rem]">
          <div className="relative min-h-[24rem] overflow-hidden sm:min-h-[28rem] lg:min-h-[38rem]">
            <span
              aria-hidden="true"
              className="absolute top-0 left-0 z-20 h-[3px] bg-primary transition-[width] duration-500"
              style={{ width: `${((active + 1) / Math.max(total, 1)) * 100}%` }}
            />
            {current.video ? (
              <video
                key={current.video}
                src={current.video}
                poster={current.src}
                autoPlay
                muted
                loop
                playsInline
                aria-label={current.alt}
                className="absolute inset-0 h-full w-full animate-[fade-in_300ms_ease-out] object-cover"
              />
            ) : (
              <img
                key={current.src}
                src={current.src}
                alt={current.alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full animate-[fade-in_300ms_ease-out] object-cover"
              />
            )}
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-foreground via-foreground/70 to-foreground/10" />
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />

            <div className="relative flex h-full flex-col justify-center px-5 py-14 md:px-10 md:py-20">
              <Reveal className="max-w-xl">
                <p className="label-caps text-background/70">{meta}</p>
                <h2 className="display-xl mt-5 text-background">
                  {titleTop}
                  <br />
                  <span className="text-primary">{titleBottom}</span>
                </h2>
                <span className="mt-6 block h-px w-16 bg-primary" />
                <p className="label-caps mt-6 whitespace-pre-line text-background">{kicker}</p>
                <p className="mt-5 max-w-md text-sm leading-relaxed text-background/70 md:text-base">
                  {summary}
                </p>
                <Link
                  to={href}
                  className="label-caps group/cta mt-8 inline-flex items-center gap-4 border border-background/40 px-7 py-4 text-background transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground active:scale-[0.98]"
                >
                  See full case study
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover/cta:translate-x-1"
                  />
                </Link>
              </Reveal>

              <div className="relative z-20 mt-5 flex flex-row flex-nowrap items-center gap-3 lg:absolute lg:right-10 lg:bottom-10 lg:mt-0">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous case study image"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-background/50 text-background transition-colors duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <ArrowLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next case study image"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-background/50 text-background transition-colors duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* thumbnail rail */}
          <div className="flex gap-3 overflow-x-auto px-5 pb-6 lg:flex-col lg:justify-center lg:overflow-visible lg:px-4 lg:py-10">
            {images.map((img, i) => (
              <button
                key={img.src + i}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show image ${i + 1}`}
                aria-current={i === active}
                className="group flex shrink-0 items-center gap-3"
              >
                <span
                  className={`label-caps hidden w-5 text-right lg:block ${
                    i === active ? "text-primary" : "text-background/40"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`relative block h-14 w-24 overflow-hidden border transition-all duration-300 lg:h-16 lg:w-full ${
                    i === active
                      ? "border-primary opacity-100"
                      : "border-background/20 opacity-60 group-hover:opacity-100"
                  }`}
                >
                  <img
                    src={img.src}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  {img.video && (
                    <span className="absolute inset-0 flex items-center justify-center bg-foreground/40">
                      <Play size={14} className="text-background" aria-hidden />
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* metrics rail */}
      <div className="bg-secondary">
        <div className="mx-auto grid max-w-[110rem] grid-cols-4 gap-x-4 gap-y-8 px-5 py-10 md:px-10 lg:grid-cols-5 lg:gap-x-8">
          {metrics.map((m, i) => (
            <Reveal
              key={m.l}
              delay={i * 90}
              className="group min-w-0"
            >
              <p className="font-display text-[1.35rem] leading-none tracking-tight text-foreground transition-colors duration-500 group-hover:text-primary sm:text-3xl md:text-5xl">
                {m.v}
              </p>
              <p className="label-caps mt-2 whitespace-pre-line text-[0.52rem] leading-[1.35] tracking-[0.14em] text-muted-foreground sm:mt-3 sm:text-[0.6875rem] sm:tracking-[0.26em]">
                {m.l}
              </p>
            </Reveal>
          ))}
          <Reveal delay={metrics.length * 90} className="col-span-4 lg:col-span-1">
            <p className="text-sm leading-relaxed text-muted-foreground">{note}</p>
            <span className="mt-4 block h-px w-12 bg-primary" />
          </Reveal>
        </div>
      </div>

      {/* journey */}
      <div className="relative overflow-hidden bg-foreground">
        <img
          src={journeyBackground}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <span className="pointer-events-none absolute inset-0 bg-foreground/75" />
        <div className="relative mx-auto max-w-[110rem] px-5 py-12 md:px-10 md:py-16">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="label-caps flex items-center gap-4 text-primary">
              The journey
              <span className="hidden h-px w-20 bg-primary/50 sm:block" />
            </p>
            <p className="label-caps text-background/70">From challenge to impact</p>
          </div>

          <div className="mt-10 grid gap-y-6 md:grid-cols-2 lg:grid-cols-4">
            {journey.map((c, i) => {
              const on = stage === i;
              return (
                <Reveal
                  key={c.n}
                  delay={i * 100}
                  className={`group relative ${
                    i === 0 ? "" : "lg:border-l lg:border-background/20"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => selectStage(i)}
                    onMouseEnter={() => selectStage(i)}
                    onMouseLeave={() => {
                      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
                        setJourneyPaused(false);
                      }
                    }}
                    aria-pressed={on}
                    className={`relative w-full cursor-pointer appearance-none border-0 px-4 py-5 text-center text-inherit transition-all duration-500 group-hover:translate-x-1 sm:px-5 sm:py-6 md:text-left lg:px-8 ${
                      on ? "bg-background/6" : "bg-transparent"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute top-0 left-0 h-[2px] bg-primary transition-all duration-700 ease-out ${
                        on ? "w-full opacity-100" : "w-0 opacity-0"
                      }`}
                    />
                    <span
                      className={`font-display text-4xl leading-none transition-colors duration-500 sm:text-5xl md:text-6xl ${
                        on ? "text-primary" : "text-background/35"
                      }`}
                    >
                      {c.n}
                    </span>
                    <span
                      className={`label-caps mt-6 block transition-colors duration-500 ${
                        on ? "text-primary" : "text-background"
                      }`}
                    >
                      {c.t}
                    </span>
                    <span
                      className={`mx-auto mt-3 block max-w-xs text-sm leading-relaxed transition-colors duration-500 md:mx-0 ${
                        on ? "text-background/90" : "text-background/50"
                      }`}
                    >
                      {c.d}
                    </span>
                  </button>
                </Reveal>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
