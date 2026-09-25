import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { ProjectCard, toProjectCardData } from "@/components/site/ProjectCard";
import { CtaBanner, Testimonial } from "@/components/site/CtaBanner";
import { ProjectOutcomeRail, ProjectPlanFeature, ProjectVisualStory } from "@/components/site/ProjectStory";
import {
  CinematicHero,
  DarkBand,
} from "@/components/site/PageKit";
import { getProject, type Project } from "@/data/projects";
import { API_BASE } from "@/lib/api";
import { cmsToProject, type CmsProject } from "@/lib/cms-project";
import { useProjects } from "@/hooks/use-projects";
import { breadcrumbJsonLd, pageSeo, absoluteUrl, blogShareImage, withCmsSeo } from "@/lib/seo";

async function loadProject(slug: string): Promise<Project> {
  const base = API_BASE;
  let apiMiss = false;
  try {
    const res = await fetch(`${base}/projects/${encodeURIComponent(slug)}`);
    if (res.status === 404) apiMiss = true;
    else if (res.ok) {
      const data = (await res.json()) as { ok?: boolean; project?: CmsProject };
      if (data.ok && data.project) return cmsToProject(data.project, getProject(slug));
    }
  } catch {
    apiMiss = false;
  }
  if (apiMiss) throw notFound();
  const project = getProject(slug);
  if (!project) throw notFound();
  return project;
}

export const Route = createFileRoute("/work/$slug")({
  loader: async ({ params }) => {
    const project = await loadProject(params.slug);
    return { project };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return pageSeo({
        title: "Project not found | Design Diaries",
        description: "This gym project could not be found.",
        path: `/work/${params.slug}`,
        noindex: true,
      });
    }
    const p = loaderData.project;
    const title = `${p.name}, ${p.location} — ${p.category} | Design Diaries`;
    const description = `${p.area} ${p.category.toLowerCase()} in ${p.location}, ${p.year}. ${p.insight}`;
    const image = p.hero || p.card;
    const path = `/work/${p.slug}`;
    return withCmsSeo(
      {
        title,
        description,
        path,
        image,
        type: "article",
        jsonLd: [
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Work", path: "/work" },
            { name: p.name, path },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: p.name,
            description,
            image: blogShareImage(image),
            url: absoluteUrl(path),
          },
        ],
      },
      p,
    );
  },
  component: ProjectDetail,
});

function DiscussCta({ className = "", invert = false }: { className?: string; invert?: boolean }) {
  return (
    <Link
      to="/start-a-project"
      className={`label-caps inline-block bg-primary px-7 py-4 text-primary-foreground transition-all duration-300 active:scale-[0.98] ${
        invert ? "hover:bg-background hover:text-foreground" : "hover:bg-foreground"
      } ${className}`}
    >
      Discuss a Similar Space
    </Link>
  );
}

function ProjectDetail() {
  const { project: loaded } = Route.useLoaderData() as { project: Project };
  const { projects, getProject } = useProjects();
  const fromList = getProject(loaded.slug);
  const project =
    fromList && fromList.gallery.length >= loaded.gallery.length ? fromList : loaded;
  const related = projects.filter((p) => p.slug !== project.slug).slice(0, 3);
  const heroSlides = toProjectCardData(project).images;
  const pageLabel =
    (project.cardLabel ?? project.category) === "GYM INTERIOR DESIGN PROJECTS"
      ? "GYM INTERIOR"
      : (project.cardLabel ?? project.category);

  return (
    <>
      <CinematicHero
        label={pageLabel}
        title={project.detail?.title ?? `${project.name}${project.location ? ` · ${project.location}` : ""}`}
        intro={project.insight}
        image={project.hero || heroSlides[0] || project.card}
        images={heroSlides}
        imageAlt={`${project.name}${project.location ? `, ${project.location}` : ""} — main training floor`}
      >
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <DiscussCta invert />
          <Link
            to="/work"
            className="label-caps link-underline text-background/70 hover:text-primary"
          >
            All work
          </Link>
        </div>
      </CinematicHero>

      <ProjectOutcomeRail project={project} />
      <ProjectVisualStory project={project} />
      <ProjectPlanFeature project={project} />

      <Testimonial {...project.testimonial} />

      {/* Related — dark */}
      <DarkBand className="bg-foreground [background-image:none]">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="display-lg">More projects</h2>
          <Link to="/work" className="label-caps link-underline hover:text-primary">
            See all work
          </Link>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p, i) => (
            <Reveal key={p.slug} delay={i * 90}>
              <ProjectCard project={p} number={i + 1} />
            </Reveal>
          ))}
        </div>
      </DarkBand>

      <CtaBanner
        compact
        label="Discuss a Similar Space"
        title={project.detail?.ctaTitle ?? "Your floor with this thinking applied"}
        body={
          project.detail?.ctaBody ??
          "Send the area, the city and what you plan to run in it. We'll tell you what the space can realistically hold."
        }
        cta={project.detail?.cta ?? "Discuss a Similar Space"}
        image={project.hero || project.card}
        imageAlt={`${project.name} training floor`}
      />
    </>
  );
}
