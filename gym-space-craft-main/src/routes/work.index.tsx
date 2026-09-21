import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Clock } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { ProjectCard } from "@/components/site/ProjectCard";
import { CtaBanner, Testimonial } from "@/components/site/CtaBanner";
import { FaqSection, ReelsSection } from "@/components/site/Sections";
import { useProjects } from "@/hooks/use-projects";
import { useBlogs } from "@/hooks/use-blogs";
import { posts as fallbackPosts } from "@/data/resources";
import { projectFaqs } from "@/data/projects";
import { categoriesFromProjects } from "@/lib/cms-project";
import { isVideoSrc, mediaPlaybackUrl, mediaPreviewUrl } from "@/lib/media";
import workHero from "@/assets/work-hero.jpg";
import p5 from "@/assets/project-5.jpg";
import { loadRouteSeo, routePageSeo } from "@/lib/page-seo";

export const Route = createFileRoute("/work/")({
  loader: () => loadRouteSeo("/work"),
  head: ({ loaderData }) => routePageSeo("/work", undefined, loaderData),
  component: WorkListing,
});

function WorkListing() {
  const { projects } = useProjects();
  const { posts } = useBlogs(fallbackPosts);
  const featuredPosts = posts.slice(0, 3);
  const tabs = useMemo(() => ["All", ...categoriesFromProjects(projects)], [projects]);
  const [active, setActive] = useState("All");
  const [heroSrc, setHeroSrc] = useState<string | null>(null);
  const shown = active === "All" ? projects : projects.filter((p) => p.category === active);
  const heroIsVideo = Boolean(heroSrc && isVideoSrc(heroSrc));
  const heroPreview = heroSrc ? mediaPreviewUrl(heroSrc, 1280) : workHero;
  const heroPlayback = heroSrc && heroIsVideo ? mediaPlaybackUrl(heroSrc, 960) : "";

  return (
    <>
      {/* Hero banner */}
      <section className="relative flex min-h-[62svh] items-end overflow-hidden bg-foreground">
        <img
          src={heroPreview}
          alt="Gym interior project preview"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover opacity-50 transition-opacity duration-500"
        />
        {heroIsVideo && heroPlayback ? (
          <video
            key={heroPlayback}
            src={heroPlayback}
            poster={heroPreview}
            muted
            autoPlay
            playsInline
            preload="none"
            className="absolute inset-0 h-full w-full object-cover opacity-50"
          />
        ) : null}
        <span className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/35 to-foreground/20" />
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

      {/* Filters + grid */}
      <section className="mx-auto max-w-[110rem] px-5 py-16 md:px-10 md:py-20">
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
              <ProjectCard project={p} number={i + 1} onPreviewChange={setHeroSrc} />
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
        image={p5}
        imageAlt="Full-width view of a completed gym training floor"
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

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {featuredPosts.map((p, i) => (
            <Reveal key={p.slug} delay={i * 90}>
              <Link
                to="/resources/blog/$slug"
                params={{ slug: p.slug }}
                className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <img
                    src={p.image}
                    alt={p.imageAlt || `Cover image — ${p.title}`}
                    loading="lazy"
                    width={1400}
                    height={1000}
                    className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                  />
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <span className="label-caps bg-secondary px-3 py-1.5 text-primary">
                    {p.category}
                  </span>
                  <span className="label-caps inline-flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" /> {p.readTime}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-2xl uppercase leading-tight transition-colors duration-300 group-hover:text-primary">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground">{p.excerpt}</p>
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
