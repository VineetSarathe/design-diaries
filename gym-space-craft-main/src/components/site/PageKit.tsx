import { useEffect, useRef, useState, type ReactNode } from "react";
import { Reveal, useInView } from "./Reveal";
import { cn } from "@/lib/utils";

/** Thin gradient seam so a cream section flows into a dark one (and back). */
export function Seam({ to = "dark" }: { to?: "dark" | "cream" }) {
  return <div aria-hidden className={to === "dark" ? "seam-to-dark" : "seam-to-cream"} />;
}

/** Full-bleed dark band used to give every page the homepage's 60% dark rhythm. */
export function DarkBand({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("blend-ink text-background", className)}>
      <div className="mx-auto max-w-[110rem] px-5 py-20 md:px-10 md:py-28">{children}</div>
    </section>
  );
}

export function SectionHead({
  label,
  title,
  intro,
  align = "left",
  tone = "dark",
}: {
  label: string;
  title: ReactNode;
  intro?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
}) {
  return (
    <Reveal className={cn(align === "center" && "flex flex-col items-center text-center")}>
      <p className="label-caps text-primary">{label}</p>
      <h2 className={cn("display-lg mt-4", align === "center" ? "max-w-4xl" : "max-w-3xl")}>
        {title}
      </h2>
      {intro && (
        <p
          className={cn(
            "mt-5 max-w-xl",
            tone === "dark" ? "text-background/70" : "text-muted-foreground",
          )}
        >
          {intro}
        </p>
      )}
    </Reveal>
  );
}

/** Cinematic page hero with parallax, staged reveal and an optional meta rail. */
export function CinematicHero({
  label,
  title,
  intro,
  image,
  imageAlt,
  meta,
  children,
}: {
  label: string;
  title: ReactNode;
  intro?: string;
  image: string;
  imageAlt: string;
  meta?: { k: string; v: string }[];
  children?: ReactNode;
}) {
  const [stage, setStage] = useState(0);
  const [offset, setOffset] = useState(0);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const a = setTimeout(() => setStage(1), 100);
    const b = setTimeout(() => setStage(2), 620);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.bottom < 0) return;
        setOffset(Math.min(90, Math.max(-90, -r.top * 0.12)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[74svh] items-end overflow-hidden bg-foreground"
    >
      <img
        src={image}
        alt={imageAlt}
        width={1920}
        height={1080}
        className="absolute inset-0 h-[118%] w-full object-cover transition-all duration-[1600ms] ease-out"
        style={{
          opacity: stage >= 2 ? 0.55 : 0,
          transform: `translateY(${offset}px) scale(${stage >= 2 ? 1 : 1.08})`,
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/55 to-foreground/25"
      />
      <div
        className="relative mx-auto w-full max-w-[110rem] px-5 pt-32 pb-14 text-background transition-all duration-[900ms] ease-out md:px-10 md:pb-20"
        style={{
          opacity: stage >= 1 ? 1 : 0,
          transform: stage >= 1 ? "translateY(0)" : "translateY(26px)",
        }}
      >
        <p className="label-caps text-primary">{label}</p>
        <h1 className="display-xl mt-4 max-w-4xl">{title}</h1>
        {intro && <p className="mt-6 max-w-xl text-background/75">{intro}</p>}
        {children}
        {meta && meta.length > 0 && (
          <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-background/15 pt-8 md:grid-cols-4 lg:max-w-4xl">
            {meta.map((m, i) => (
              <div
                key={`${i}-${m.v}`}
                className="transition-all duration-700 ease-out"
                style={{
                  transitionDelay: `${400 + i * 110}ms`,
                  opacity: stage >= 2 ? 1 : 0,
                  transform: stage >= 2 ? "none" : "translateY(14px)",
                }}
              >
                {m.k ? <dt className="label-caps text-background/50">{m.k}</dt> : null}
                <dd className={m.k ? "mt-2 font-display text-lg uppercase" : "font-display text-lg uppercase"}>
                  {m.v}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}

/** Row of normal-size visuals with hover zoom and captions. */
export function VisualBand({
  items,
  tone = "dark",
  columns = 3,
}: {
  items: { src: string; alt: string; caption?: string }[];
  tone?: "dark" | "light";
  columns?: 2 | 3 | 4;
}) {
  const { ref, visible } = useInView<HTMLDivElement>(0.12);
  return (
    <div
      ref={ref}
      className={cn(
        "grid gap-5",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "grid-cols-2 lg:grid-cols-4",
      )}
    >
      {items.map((it, i) => (
        <figure
          key={it.src + i}
          style={{ transitionDelay: `${i * 110}ms` }}
          className={cn(
            "group transition-all duration-700 ease-out",
            visible ? "translate-y-0 opacity-100" : "translate-y-7 opacity-0",
          )}
        >
          <div
            className={cn(
              "relative aspect-[4/3] overflow-hidden border",
              tone === "dark" ? "border-background/15 bg-foreground" : "border-border bg-muted",
            )}
          >
            <img
              src={it.src}
              alt={it.alt}
              loading="lazy"
              width={1200}
              height={900}
              className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-foreground/45 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-700 group-hover:w-full"
            />
          </div>
          {it.caption && (
            <figcaption
              className={cn(
                "mt-3 text-sm",
                tone === "dark" ? "text-background/60" : "text-muted-foreground",
              )}
            >
              {it.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}

/** Alternating image + copy feature row. */
export function SplitFeature({
  index,
  label,
  title,
  body,
  image,
  imageAlt,
  points,
  flip = false,
  tone = "dark",
}: {
  index?: string;
  label?: string;
  title: string;
  body: string;
  image: string;
  imageAlt: string;
  points?: string[];
  flip?: boolean;
  tone?: "dark" | "light";
}) {
  return (
    <Reveal
      className={cn(
        "grid items-center gap-8 border-t py-12 md:grid-cols-2 md:gap-14",
        tone === "dark" ? "border-background/15" : "border-border",
      )}
    >
      <div className={cn("group relative overflow-hidden", flip && "md:order-2")}>
        <img
          src={image}
          alt={imageAlt}
          loading="lazy"
          width={1200}
          height={900}
          className="aspect-[5/4] w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.04]"
        />
        {index && (
          <span className="label-caps absolute top-4 left-4 bg-foreground px-3 py-1.5 text-background">
            {index}
          </span>
        )}
      </div>
      <div>
        {label && <p className="label-caps text-primary">{label}</p>}
        <h3 className="display-md mt-4">{title}</h3>
        <p
          className={cn(
            "mt-4 leading-relaxed",
            tone === "dark" ? "text-background/70" : "text-muted-foreground",
          )}
        >
          {body}
        </p>
        {points && (
          <ul className="mt-6 space-y-2">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-primary" />
                <span className={tone === "dark" ? "text-background/70" : "text-muted-foreground"}>
                  {p}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ *
 * Editorial Immersive Showcase primitives
 * ------------------------------------------------------------------ */

/** Cinematic opening spread: statement column + layered imagery + proof rail. */
export function EditorialSpread({
  label,
  title,
  intro,
  primary,
  primaryAlt,
  secondary,
  secondaryAlt,
  caption,
  meta,
}: {
  label: string;
  title: ReactNode;
  intro?: string;
  primary: string;
  primaryAlt: string;
  secondary?: string;
  secondaryAlt?: string;
  caption?: string;
  meta?: { k: string; v: string }[];
}) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const a = setTimeout(() => setStage(1), 80);
    const b = setTimeout(() => setStage(2), 520);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-foreground text-background">
      <div className="mx-auto max-w-[110rem] px-5 pt-28 pb-16 md:px-10 md:pt-36 md:pb-24">
        <div
          className="flex items-center gap-4 border-b border-background/15 pb-5 transition-all duration-700 ease-out"
          style={{ opacity: stage >= 1 ? 1 : 0, transform: stage >= 1 ? "none" : "translateY(12px)" }}
        >
          <span className="h-1.5 w-1.5 bg-primary" />
          <p className="label-caps text-primary">{label}</p>
        </div>

        <div className="grid items-center gap-10 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div
            className="transition-all duration-[900ms] ease-out"
            style={{
              opacity: stage >= 1 ? 1 : 0,
              transform: stage >= 1 ? "none" : "translateY(28px)",
            }}
          >
            <h1 className="display-xl max-w-2xl">{title}</h1>
            {intro && <p className="mt-6 max-w-lg text-background/70">{intro}</p>}
            {meta && meta.length > 0 && (
              <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-background/15 pt-8 md:max-w-xl">
                {meta.map((m, i) => (
                  <div
                    key={`${i}-${m.v}`}
                    className="transition-all duration-700 ease-out"
                    style={{
                      transitionDelay: `${360 + i * 110}ms`,
                      opacity: stage >= 2 ? 1 : 0,
                      transform: stage >= 2 ? "none" : "translateY(14px)",
                    }}
                  >
                    {m.k ? <dt className="label-caps text-background/45">{m.k}</dt> : null}
                    <dd className={m.k ? "mt-2 font-display text-base uppercase" : "font-display text-base uppercase"}>
                      {m.v}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          <div className="relative">
            <div className="relative overflow-hidden">
              <img
                src={primary}
                alt={primaryAlt}
                width={1200}
                height={1400}
                className="aspect-[4/3] w-full object-cover transition-all duration-[1500ms] ease-out lg:aspect-[3/4]"
                style={{
                  opacity: stage >= 1 ? 1 : 0,
                  transform: stage >= 2 ? "scale(1)" : "scale(1.07)",
                }}
              />
              <span aria-hidden className="pointer-events-none absolute inset-0 bg-foreground/15" />
            </div>
            {secondary && (
              <div
                className="relative -mt-16 ml-auto w-1/2 overflow-hidden border-4 border-foreground transition-all duration-[1100ms] ease-out sm:w-2/5"
                style={{
                  transitionDelay: "520ms",
                  opacity: stage >= 2 ? 1 : 0,
                  transform: stage >= 2 ? "none" : "translateY(24px)",
                }}
              >
                <img
                  src={secondary}
                  alt={secondaryAlt ?? ""}
                  loading="lazy"
                  width={800}
                  height={600}
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            )}
            {caption && (
              <p className="mt-5 max-w-xs text-sm text-background/55">{caption}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Numbered chapter marker with a rule — used to segment each page into acts. */
export function Chapter({
  n,
  label,
  title,
  intro,
  tone = "dark",
  align = "left",
}: {
  n: string;
  label: string;
  title: ReactNode;
  intro?: string;
  tone?: "dark" | "light";
  align?: "left" | "center";
}) {
  return (
    <Reveal className={cn(align === "center" && "flex flex-col items-center text-center")}>
      <div className="flex items-center gap-4">
        <span className="font-display text-sm text-primary">{n}</span>
        <span
          aria-hidden
          className={cn("h-px w-12", tone === "dark" ? "bg-background/30" : "bg-border")}
        />
        <p className="label-caps text-primary">{label}</p>
      </div>
      <h2 className={cn("display-lg mt-6", align === "center" ? "max-w-4xl" : "max-w-3xl")}>
        {title}
      </h2>
      {intro && (
        <p
          className={cn(
            "mt-5 max-w-xl",
            tone === "dark" ? "text-background/70" : "text-muted-foreground",
          )}
        >
          {intro}
        </p>
      )}
    </Reveal>
  );
}

/** Art-directed image panel: number over image, copy always readable. */
export function OffsetPanel({
  n,
  title,
  text,
  image,
  imageAlt,
  delay = 0,
}: {
  n: string;
  title: string;
  text: string;
  image: string;
  imageAlt: string;
  delay?: number;
}) {
  return (
    <Reveal delay={delay} className="group h-full">
      <article className="relative flex h-full min-h-[20rem] flex-col overflow-hidden bg-foreground lg:min-h-[26rem]">
        <img
          src={image}
          alt={imageAlt}
          loading="lazy"
          width={1200}
          height={960}
          className="absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-[1100ms] ease-out group-hover:scale-[1.05]"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground via-foreground/40 to-transparent"
        />
        <div className="relative z-10 flex h-full min-h-[20rem] flex-1 flex-col p-4 lg:min-h-[26rem] lg:p-5">
          <span className="font-display text-4xl leading-none text-primary lg:text-[2.75rem]">{n}</span>
          <div className="mt-auto pt-8">
            <h3 className="font-display text-[0.95rem] uppercase leading-snug text-background lg:text-base">
              {title}
            </h3>
            <p className="mt-2.5 text-[0.8rem] leading-relaxed text-background/90 transition-colors duration-500 lg:text-[0.82rem] lg:text-background/0 lg:group-hover:text-background/80 lg:group-focus-within:text-background/80">
              {text}
            </p>
            <span
              aria-hidden
              className="mt-4 block h-0.5 w-12 bg-primary transition-all duration-700 lg:w-0 lg:group-hover:w-24 lg:group-focus-within:w-24"
            />
          </div>
        </div>
      </article>
    </Reveal>
  );
}

/** Wide pull-quote / manifesto block with an image bleeding behind it. */
export function ManifestoBlock({
  label,
  lines,
  image,
  imageAlt,
  footnote,
}: {
  label: string;
  lines: ReactNode[];
  image: string;
  imageAlt: string;
  footnote?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-foreground text-background">
      <img
        src={image}
        alt={imageAlt}
        loading="lazy"
        width={1920}
        height={1080}
        className="absolute inset-0 h-full w-full object-cover opacity-25"
      />
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-foreground via-foreground/70 to-foreground"
      />
      <div className="relative mx-auto max-w-[110rem] px-5 py-24 md:px-10 md:py-32">
        <Reveal>
          <p className="label-caps text-primary">{label}</p>
          <div className="mt-8 space-y-2">
            {lines.map((l, i) => (
              <p
                key={i}
                className={cn("display-statement leading-[1.05]", i % 2 === 1 && "md:pl-[12%]")}
              >
                {l}
              </p>
            ))}
          </div>
          {footnote && <p className="mt-10 max-w-xl text-background/65">{footnote}</p>}
        </Reveal>
      </div>
    </section>
  );
}

/** Editorial ledger row set — awards, press, certifications as one typographic system. */
export function LedgerList({
  caption,
  rows,
}: {
  caption: string;
  rows: { title: string; meta: string; url?: string }[];
}) {
  return (
    <div>
      <p className="label-caps text-background/45">{caption}</p>
      <ul className="mt-6">
        {rows.map((r, i) => {
          const inner = (
            <>
              <span className="flex items-baseline gap-4">
                <span className="font-display text-xs text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-lg uppercase transition-colors duration-300 group-hover:text-primary">
                  {r.title}
                </span>
              </span>
              <span className="inline-flex items-center gap-2 text-sm text-background/55">
                {r.meta}
              </span>
            </>
          );
          return (
            <Reveal
              key={r.title}
              delay={i * 70}
              as="li"
              className="group relative border-t border-background/15"
            >
              <span
                aria-hidden
                className="absolute top-0 left-0 h-px w-0 bg-primary transition-all duration-700 group-hover:w-full"
              />
              {r.url ? (
                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex flex-wrap items-baseline justify-between gap-4 py-5"
                >
                  {inner}
                </a>
              ) : (
                <div className="flex flex-wrap items-baseline justify-between gap-4 py-5">
                  {inner}
                </div>
              )}
            </Reveal>
          );
        })}
      </ul>
    </div>
  );
}
