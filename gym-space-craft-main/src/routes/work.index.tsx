import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Reveal } from "@/components/site/Reveal";
import { ProjectCard } from "@/components/site/ProjectCard";
import { CtaBanner, Testimonial } from "@/components/site/CtaBanner";
import { Seam } from "@/components/site/PageKit";
import { FaqSection, ReelsSection } from "@/components/site/Sections";
import { useProjects } from "@/hooks/use-projects";
import { projectFaqs } from "@/data/projects";
import { categoriesFromProjects } from "@/lib/cms-project";
import workHero from "@/assets/work-hero.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import caseImg from "@/assets/case-study.jpg";
import p6 from "@/assets/project-6.jpg";

export const Route = createFileRoute("/work/")({
  head: () => ({
    meta: [
      { title: "Gym & Fitness Studio Projects | Design Diaries" },
      {
        name: "description",
        content:
          "Gym & fitness interior design projects, designed around real use. Browse gym projects and fitness studios by Design Diaries, Indore.",
      },
      { property: "og:title", content: "Our Work | Design Diaries" },
      {
        property: "og:description",
        content: "Gym & fitness interior design projects, designed around real use.",
      },
    ],
  }),
  component: WorkListing,
});

const teasers = [
  {
    kind: "Blog",
    title: "Rack spacing: the 2.4m rule and when to break it",
    meta: "6 min read",
    img: gallery1,
  },
  {
    kind: "Download",
    title: "Gym floor planning checklist — pre-lease edition",
    meta: "PDF · 12 pages",
    img: caseImg,
  },
  {
    kind: "Blog",
    title: "What a 7am rush tells you about your layout",
    meta: "4 min read",
    img: p6,
  },
];

function WorkListing() {
  const { projects } = useProjects();
  const tabs = useMemo(() => ["All", ...categoriesFromProjects(projects)], [projects]);
  const [active, setActive] = useState("All");
  const shown = active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <>
      {/* Hero banner */}
      <section className="relative flex min-h-[62svh] items-end overflow-hidden bg-foreground">
        <img
          src={workHero}
          alt="Placeholder: warm-toned gym interior with oak slat ceiling and terracotta accent wall"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="relative mx-auto w-full max-w-[110rem] px-5 pt-32 pb-14 text-background md:px-10 md:pb-20">
          <Reveal>
            <p className="label-caps text-primary">Our Work</p>
            <h1 className="display-lg mt-5 max-w-4xl">
              Gym & fitness interior design projects, designed around real use
            </h1>
            <p className="mt-6 max-w-xl text-background/80">
              Explore fitness & gym interior design projects developed from real needs, from what
              each level had to solve to the design decisions that changed the way the space works.
            </p>
          </Reveal>
        </div>
      </section>

      <Seam to="cream" />

      {/* Filters + grid */}
      <section className="mx-auto max-w-[110rem] px-5 py-20 md:px-10 md:py-28">
        <Reveal className="flex flex-wrap items-center gap-3 border-b border-border pb-6">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActive(t)}
              aria-pressed={active === t}
              className={`label-caps px-5 py-3 transition-all duration-300 active:scale-[0.98] ${
                active === t
                  ? "bg-foreground text-background"
                  : "bg-secondary text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
          <span className="label-caps ml-auto text-muted-foreground">
            {shown.length} {shown.length === 1 ? "project" : "projects"}
          </span>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p, i) => (
            <Reveal key={p.slug} delay={i * 90}>
              <ProjectCard project={p} number={i + 1} />
            </Reveal>
          ))}
        </div>
      </section>

      {projects[0]?.testimonial?.quote && (
        <Testimonial
          quote={projects[0].testimonial.quote}
          author={projects[0].testimonial.author}
          role={projects[0].testimonial.role}
        />
      )}

      <CtaBanner
        compact
        label="Start a Project"
        title="Have a space in mind?"
        body="Tell us about your gym, fitness or wellness space, including the floor area, city and what you plan to build. We will help you explore the right design approach for your project."
        cta="Start a Project →"
      />

      {/* Blogs / downloads teaser */}
      <section className="mx-auto max-w-[110rem] px-5 py-20 md:px-10 md:py-28">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label-caps text-primary">Resources</p>
            <h2 className="display-lg mt-5">Read the thinking</h2>
          </div>
          <Link to="/resources" className="label-caps link-underline hover:text-primary">
            All resources
          </Link>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {teasers.map((t, i) => (
            <Reveal key={t.title} delay={i * 90}>
              <Link to="/resources" className="group block">
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <img
                    src={t.img}
                    alt={`Placeholder image — ${t.title}`}
                    loading="lazy"
                    width={1400}
                    height={1000}
                    className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                  />
                </div>
                <p className="label-caps mt-4 text-primary">{t.kind}</p>
                <h3 className="mt-2 font-display text-2xl uppercase transition-colors duration-300 group-hover:text-primary">
                  {t.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{t.meta}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Reels */}
      <ReelsSection title="Floors in motion" placement="work" />

      <FaqSection items={projectFaqs} title="About our work" />
    </>
  );
}
