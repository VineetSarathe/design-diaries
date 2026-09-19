import { ProjectCard, type ProjectCardData } from "./ProjectCard";
import { Reveal } from "./Reveal";

export type ShowcaseProject = ProjectCardData;

export function ProjectShowcase({ projects }: { projects: ShowcaseProject[] }) {
  return (
    <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <Reveal key={project.slug} delay={index * 90} className="h-full">
          <ProjectCard project={project} number={index + 1} />
        </Reveal>
      ))}
    </div>
  );
}