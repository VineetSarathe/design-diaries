import { useRef, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Instagram } from "lucide-react";
import { Reveal } from "./Reveal";
import { useContactSettings } from "@/hooks/use-contact-settings";
import { useInstagramFeed } from "@/hooks/use-instagram-feed";
import { ProjectCard } from "./ProjectCard";
import { useProjects } from "@/hooks/use-projects";
import type { InstagramCard } from "@/lib/admin-api";
import { mediaPreviewUrl } from "@/lib/media";
import gallery1 from "@/assets/gallery-1.jpg";
import caseImg from "@/assets/case-study.jpg";
import p5 from "@/assets/project-5.jpg";
import p6 from "@/assets/project-6.jpg";

export function ProjectsStrip({
  label = "Selected Work",
  title = "The floors behind the thinking.",
  slugs,
  limit = 3,
}: {
  label?: string;
  title?: string;
  slugs?: string[];
  limit?: number;
}) {
  const { projects } = useProjects();
  const shown = (slugs ? projects.filter((p) => slugs.includes(p.slug)) : projects).slice(0, limit);
  return (
    <section className="mx-auto max-w-[110rem] px-5 py-20 md:px-10 md:py-28">
      <Reveal className="flex flex-col items-center text-center">
        <p className="label-caps text-primary">{label}</p>
        <h2 className="display-statement mt-5">{title}</h2>
        <Link to="/work" className="label-caps link-underline mt-7 hover:text-primary">
          View all interior projects
        </Link>
      </Reveal>
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p, i) => (
          <Reveal key={p.slug} delay={i * 90}>
            <ProjectCard project={p} number={i + 1} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const fallbackReels: InstagramCard[] = [
  { id: "1", caption: "Zoning a floor in 40 seconds", link: "", imageUrl: gallery1, sortOrder: 1 },
  { id: "2", caption: "Why we test the section, not just the plan", link: "", imageUrl: p5, sortOrder: 2 },
  { id: "3", caption: "Turf lane placement, explained on site", link: "", imageUrl: p6, sortOrder: 3 },
  { id: "4", caption: "Material call: rubber vs. vinyl at year five", link: "", imageUrl: caseImg, sortOrder: 4 },
];

export function ReelsSection({
  label = "EXPLORE OUR INSTAGRAM",
  title = "Floors in motion.",
  placement = "work",
}: {
  label?: string;
  title?: ReactNode;
  placement?: "work" | "resources" | "services";
}) {
  const { instagram } = useContactSettings();
  const { items } = useInstagramFeed(placement, fallbackReels);
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollNext() {
    const el = trackRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const styles = window.getComputedStyle(el);
    const gap = Number.parseFloat(styles.columnGap || styles.gap) || 16;
    const step = card ? card.offsetWidth + gap : el.clientWidth * 0.75;
    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 8) {
      el.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }
    el.scrollBy({ left: step, behavior: "smooth" });
  }

  return (
    <section className="bg-secondary">
      <div className="mx-auto max-w-[110rem] px-5 py-20 md:px-10 md:py-28">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label-caps text-primary">{label}</p>
            <h2 className="display-lg mt-5">{title}</h2>
          </div>
          <a
            href={instagram}
            target="_blank"
            rel="noreferrer noopener"
            className="label-caps link-underline inline-flex items-center gap-2 hover:text-primary"
          >
            <Instagram className="h-4 w-4" /> Follow the studio
          </a>
        </Reveal>

        <div
          ref={trackRef}
          className="mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((r, i) => (
            <Reveal
              key={r.id}
              delay={i * 80}
              className="w-[calc((100%-1rem)/2)] shrink-0 snap-start lg:w-[calc((100%-3rem)/4)]"
            >
              <a
                href={r.link || instagram}
                target="_blank"
                rel="noreferrer noopener"
                className="group block"
              >
                <div className="relative aspect-[9/16] overflow-hidden bg-muted">
                  <img
                    src={mediaPreviewUrl(r.imageUrl, 640)}
                    alt={`Placeholder reel — ${r.caption}`}
                    loading="lazy"
                    decoding="async"
                    width={640}
                    height={800}
                    className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                  />
                  <Instagram className="absolute top-4 right-4 h-5 w-5 text-background/80" />
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            aria-label="See next reel"
            onClick={scrollNext}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-border bg-transparent transition-colors duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

export function FaqSection({
  items,
  title = "Questions we're asked first.",
  id,
}: {
  items: { q: string; a: string }[];
  title?: string;
  id?: string;
}) {
  return (
    <section id={id} className="mx-auto max-w-[110rem] scroll-mt-24 px-5 py-20 md:px-10 md:py-28">
      <Reveal className="flex items-center gap-6">
        <h2 className="display-lg shrink-0">FAQ</h2>
        <span className="h-px flex-1 bg-border" />
      </Reveal>
      {title ? (
        <Reveal>
          <p className="mt-5 max-w-2xl text-muted-foreground">{title}</p>
        </Reveal>
      ) : null}
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {items.map((f, i) => (
          <Reveal key={f.q} delay={i * 50}>
            <details className="group h-full border border-border">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-[0.95rem] leading-snug [&::-webkit-details-marker]:hidden">
                <span>{f.q}</span>
                <span className="shrink-0 text-lg leading-none text-primary transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="border-t border-border px-5 py-4 text-sm text-muted-foreground">{f.a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function PageHero({
  label,
  title,
  intro,
  image,
  imageAlt,
}: {
  label: string;
  title: string;
  intro: string;
  image: string;
  imageAlt: string;
}) {
  return (
    <section className="relative flex min-h-[62svh] items-end overflow-hidden bg-foreground">
      <img
        src={image}
        alt={imageAlt}
        width={1920}
        height={1080}
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />
      <div className="relative mx-auto w-full max-w-[110rem] px-5 pt-32 pb-14 text-background md:px-10 md:pb-20">
        <Reveal>
          <p className="label-caps text-primary">{label}</p>
          <h1 className="display-lg mt-5 max-w-4xl">{title}</h1>
          <p className="mt-6 max-w-xl text-background/80">{intro}</p>
        </Reveal>
      </div>
    </section>
  );
}
