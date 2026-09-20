import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { ProjectCard } from "@/components/site/ProjectCard";
import { CtaBanner, Testimonial } from "@/components/site/CtaBanner";
import { ProjectOutcomeRail, ProjectPlanFeature, ProjectVisualStory } from "@/components/site/ProjectStory";
import {
  CinematicHero,
  DarkBand,
  Seam,
} from "@/components/site/PageKit";
import { getProject, type Project } from "@/data/projects";
import { API_BASE } from "@/lib/api";
import { cmsToProject, type CmsProject } from "@/lib/cms-project";
import { useProjects } from "@/hooks/use-projects";

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
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Project not found | Design Diaries" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const p = loaderData.project;
    const title = `${p.name}, ${p.location} — ${p.category} | Design Diaries`;
    const description = `${p.area} ${p.category.toLowerCase()} in ${p.location}, ${p.year}. ${p.insight}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
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
  const project = getProject(loaded.slug) ?? loaded;
  const related = projects.filter((p) => p.slug !== project.slug).slice(0, 3);

  return (
    <>
      <CinematicHero
        label={project.cardLabel ?? project.category}
        title={project.detail?.title ?? `${project.name}${project.location ? ` · ${project.location}` : ""}`}
        intro={project.insight}
        image={project.hero}
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

      <Seam to="dark" />

      {/* Related — dark */}
      <DarkBand>
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
