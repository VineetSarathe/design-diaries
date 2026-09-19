import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { apiRequest } from "@/lib/api";
import { projects as fallbackProjects, type Project } from "@/data/projects";
import { mergeCmsProjects, type CmsProject } from "@/lib/cms-project";

type ProjectsContextValue = {
  projects: Project[];
  getProject: (slug: string) => Project | undefined;
  refreshProjects: () => Promise<void>;
};

const ProjectsContext = createContext<ProjectsContextValue>({
  projects: fallbackProjects,
  getProject: (slug) => fallbackProjects.find((project) => project.slug === slug),
  refreshProjects: async () => undefined,
});

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);

  const refreshProjects = useCallback(async () => {
    try {
      const res = await apiRequest<{ projects: CmsProject[] }>("/projects");
      setProjects(mergeCmsProjects(res.projects));
    } catch {
      setProjects(fallbackProjects);
    }
  }, []);

  useEffect(() => {
    void refreshProjects();
  }, [refreshProjects]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") void refreshProjects();
    };
    window.addEventListener("focus", onVisible);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("focus", onVisible);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refreshProjects]);

  const value = useMemo(
    () => ({
      projects,
      getProject: (slug: string) => projects.find((project) => project.slug === slug),
      refreshProjects,
    }),
    [projects, refreshProjects],
  );

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>;
}

export function useProjects() {
  return useContext(ProjectsContext);
}
