import { useEffect, useRef, useState } from "react";
import { useInView } from "./Reveal";
import { cn } from "@/lib/utils";
import s1 from "@/assets/floorplan.jpg";
import s2 from "@/assets/why-materials.jpg";
import s3 from "@/assets/gym-layout.jpg";
import s4 from "@/assets/project-2.jpg";
import s5 from "@/assets/project-3.jpg";
import s6 from "@/assets/gallery-1.jpg";

export type MethodStep = { k: string; d: string; img?: string };

const imgs = [s1, s2, s3, s4, s5, s6];

const defaultSteps: MethodStep[] = [
  { k: "Understand", d: "Know your people, goals and opportunities." },
  { k: "Research", d: "Study the context, user behaviour and spatial possibilities." },
  { k: "Plan", d: "Develop a clear spatial and functional strategy." },
  { k: "Design", d: "Bring the vision to life with intentional aesthetic design." },
  { k: "Build", d: "Oversee the design intent through execution and attention to detail." },
  { k: "Learn", d: "Measure. Refine. Evolve. With every project." },
];

/* Wavy path across a 1200 x 96 viewbox, peaking/dipping between the six
   column centers (centres at x = 100, 300, 500, 700, 900, 1100). */
const WAVE_PATH =
  "M0 48 C 40 48, 65 20, 100 20 S 165 76, 200 76 S 265 20, 300 20 S 365 76, 400 76 S 465 20, 500 20 S 565 76, 600 76 S 665 20, 700 20 S 765 76, 800 76 S 865 20, 900 20 S 965 76, 1000 76 S 1065 20, 1100 20 S 1170 60, 1200 48";

/* Node y at each column centre (alternating peaks and dips). */
const NODE_Y = [20, 76, 20, 76, 20, 76];

/**
 * Horizontal method timeline: a wave line threads six numbered stages,
 * each with a small still and caption beneath.
 */
export function SagrikaMethod({
  steps = defaultSteps,
  label = "The",
  title = "Sagrika",
  titleAccent = "Method",
  kicker = "From concept to completion",
  description = "Our gym interior design process brings together spatial planning, design development and brand thinking to create a space that works beautifully from day one.",
  className,
}: {
  steps?: MethodStep[];
  label?: string;
  title?: string;
  titleAccent?: string;
  kicker?: string;
  description?: string;
  className?: string;
}) {
  const { ref, visible } = useInView<HTMLDivElement>(0.2);
  const [hovered, setHovered] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [auto, setAuto] = useState(0);
  /* Position of the travelling "snake" head as a 0–1 fraction of the path. */
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const pathRef = useRef<SVGPathElement | null>(null);
  const [pathLen, setPathLen] = useState(0);

  const frac = (i: number) => (i + 0.5) / steps.length;
  const active = hovered ?? auto;

  useEffect(() => {
    if (pathRef.current) setPathLen(pathRef.current.getTotalLength());
  }, []);

  useEffect(() => {
    const i = hovered ?? auto;
    progressRef.current = frac(i);
    setProgress(frac(i));
  }, [auto, hovered, steps.length]);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setAuto((current) => (current + 1) % steps.length);
    }, 500);
    return () => window.clearInterval(timer);
  }, [paused, steps.length]);

  const setActive = (i: number | null) => {
    setHovered(i);
    if (i !== null) setAuto(i);
  };

  const head =
    pathLen && pathRef.current
      ? pathRef.current.getPointAtLength(Math.min(1, Math.max(0, progress)) * pathLen)
      : null;

  return (
    <section className={cn("blend-ink relative overflow-hidden text-background", className)}>
      {/* oversized outlined watermark word */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-6 right-0 hidden origin-right font-display leading-none whitespace-nowrap uppercase select-none md:block"
        style={{
          fontSize: "clamp(6rem, 15vw, 15rem)",
          color: "transparent",
          WebkitTextStroke: "1px rgba(255,255,255,0.07)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateX(0)" : "translateX(6%)",
          transition: "opacity 1400ms ease-out, transform 1600ms ease-out",
        }}
      >
        Method
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent"
      />

      <div className="relative mx-auto max-w-[110rem] px-5 py-16 md:px-10 md:py-24">
        {/* Heading */}
        <div
          className="transition-all duration-1000 ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateX(70px)",
            transition:
              "opacity 1000ms cubic-bezier(0.22, 1, 0.36, 1), transform 1000ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-primary" />
            <p className="label-caps text-background/45">{label}</p>
          </div>
          <div className="mt-4 grid items-center gap-8 lg:grid-cols-[minmax(0,max-content)_minmax(0,1fr)] lg:gap-12">
            <h2 className="display-statement whitespace-nowrap text-[clamp(2.2rem,5.2vw,5.2rem)]">
              <span className="text-primary">{title}</span>{" "}
              <span className="text-background">{titleAccent}</span>
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-background/55 lg:justify-self-end lg:text-right">
              {description}
            </p>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-5">
            <p className="label-caps text-background/40">{kicker}</p>
            <span className="h-px flex-1 bg-background/12" />
            <p className="label-caps invisible select-none" aria-hidden="true">
              Six stages · One standard
            </p>
          </div>
        </div>


        <div ref={ref} className="mt-12">
          {/* Number + title row */}
          <div className="hidden grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid lg:grid-cols-6 lg:gap-x-5">
            {steps.map((s, i) => {
              const on = active === i;
              return (
                <button
                  type="button"
                  key={s.k}
                  className="group text-left"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "none" : "translateY(16px)",
                    transition: `opacity 700ms ease-out ${i * 100}ms, transform 700ms ease-out ${i * 100}ms`,
                  }}
                >
                  <span className="condensed-caps block text-sm text-background/40">
                    0{i + 1}
                  </span>
                  <span
                    className={cn(
                      "mt-1 block font-display text-base uppercase tracking-wide transition-colors duration-500 md:text-lg",
                      on ? "text-primary" : "text-background/80",
                    )}
                  >
                    {s.k}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Wave connector with node dots (desktop) */}
          <div className="relative mt-4 hidden h-24 lg:block" aria-hidden="true">
            <svg
              viewBox="0 0 1200 96"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
            >
              <path
                ref={pathRef}
                d={WAVE_PATH}
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.25"
                strokeWidth="1.5"
                className="text-background"
                vectorEffect="non-scaling-stroke"
                style={{
                  strokeDasharray: 1500,
                  strokeDashoffset: visible ? 0 : 1500,
                  transition: "stroke-dashoffset 2400ms ease-out 300ms",
                }}
              />
              {/* travelling trail drawn behind the head */}
              {pathLen > 0 && (
                <path
                  d={WAVE_PATH}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-primary"
                  vectorEffect="non-scaling-stroke"
                  style={{
                    strokeDasharray: pathLen,
                    strokeDashoffset: pathLen * (1 - progress),
                    opacity: visible ? 1 : 0,
                  }}
                />
              )}
            </svg>
            {/* snake head */}
            {head && (
              <span
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${(head.x / 1200) * 100}%`,
                  top: `${(head.y / 96) * 100}%`,
                  opacity: visible ? 1 : 0,
                }}
              >
                <span className="block h-4 w-4 rounded-full bg-primary shadow-[0_0_0_6px_color-mix(in_oklab,var(--primary)_25%,transparent)]" />
              </span>
            )}
            {steps.map((s, i) => {
              const on = active === i;
              return (
                <span
                  key={s.k}
                  className={cn(
                    "absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-all duration-500",
                    on
                      ? "scale-125 border-primary bg-primary"
                      : "border-background/60 bg-foreground",
                  )}
                  style={{
                    left: `${((i + 0.5) / steps.length) * 100}%`,
                    top: `${((NODE_Y[i % NODE_Y.length] ?? 48) / 96) * 100}%`,
                    opacity: visible ? 1 : 0,
                    transition: `opacity 600ms ease-out ${500 + i * 140}ms, transform 300ms, background-color 300ms, border-color 300ms`,
                  }}
                />
              );
            })}
          </div>

          {/* Simple rule connector for smaller screens */}
          <div className="h-px w-full bg-background/15 lg:hidden" aria-hidden="true" />

          {/* Image + caption row */}
          <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 lg:mt-8 lg:grid-cols-6 lg:gap-x-5 lg:gap-y-10">
            {steps.map((s, i) => {
              const on = active === i;
              return (
                <button
                  type="button"
                  key={s.k}
                  onMouseEnter={() => {
                    setPaused(true);
                    setActive(i);
                  }}
                  onMouseLeave={() => {
                    setPaused(false);
                    setActive(null);
                  }}
                  onFocus={() => {
                    setPaused(true);
                    setActive(i);
                  }}
                  onBlur={() => {
                    setPaused(false);
                    setActive(null);
                  }}
                  className={cn(
                    "group relative text-left transition-transform duration-700 ease-out",
                    on ? "z-10 lg:scale-[1.06]" : "lg:scale-100",
                  )}
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? undefined : "translateY(24px)",
                    transition: `opacity 800ms ease-out ${200 + i * 110}ms, transform 700ms cubic-bezier(0.22,1,0.36,1)`,
                  }}
                >
                  <span
                    className={cn(
                      "relative block overflow-hidden border bg-foreground/5 transition-all duration-700 ease-out",
                      on
                        ? "border-primary shadow-[0_0_0_1px_var(--primary),0_30px_70px_-40px_color-mix(in_oklab,var(--primary)_80%,transparent)]"
                        : "border-background/20 hover:border-background/35",
                    )}
                  >
                    <span className="relative block aspect-[4/5] overflow-hidden bg-background/5">
                      <img
                        src={s.img ?? imgs[i % imgs.length]}
                        alt={`${s.k} stage of the Sagrika method`}
                        loading="lazy"
                        width={600}
                        height={750}
                        className={cn(
                          "h-full w-full object-cover transition-all duration-[900ms] ease-out",
                          on
                            ? "scale-110 opacity-100 saturate-100"
                            : "scale-100 opacity-80 saturate-[0.75]",
                        )}
                      />
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-0 transition-opacity duration-700",
                          on ? "opacity-0" : "opacity-100 bg-foreground/25",
                        )}
                      />
                      <span
                        className={cn(
                          "condensed-caps absolute top-3 left-3 text-xs transition-colors duration-500",
                          on ? "text-primary" : "text-background/75",
                        )}
                      >
                        0{i + 1}
                      </span>
                    </span>
                    <span className="block px-3 pt-3 pb-4">
                      <span
                        className={cn(
                          "block font-display text-sm uppercase tracking-wide transition-colors duration-500",
                          on ? "text-primary" : "text-background/90",
                        )}
                      >
                        {s.k}
                      </span>
                      <span
                        className={cn(
                          "mt-2 block text-xs leading-relaxed transition-all duration-700",
                          on
                            ? "translate-y-0 text-background opacity-100"
                            : "translate-y-0 text-background/65 opacity-100",
                        )}
                      >
                        {s.d}
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
