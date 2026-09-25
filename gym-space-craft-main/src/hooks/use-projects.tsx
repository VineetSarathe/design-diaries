import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { apiRequest } from "@/lib/api";
import { readCmsCache, writeCmsCache } from "@/lib/cms-cache";
import { projects as fallbackProjects, type Project } from "@/data/projects";
import { mergeCmsProjects, type CmsProject } from "@/lib/cms-project";

const CMS_PROJECTS_KEY = "projects";

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

function projectsFromCache(): Project[] | null {
  const cached = readCmsCache<CmsProject[]>(CMS_PROJECTS_KEY);
  return cached?.length ? mergeCmsProjects(cached) : null;
}

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(() => projectsFromCache() ?? fallbackProjects);
  const lastFetchAt = useRef(0);

  const refreshProjects = useCallback(async () => {
    try {
      const res = await apiRequest<{ projects: CmsProject[] }>("/projects");
      writeCmsCache(CMS_PROJECTS_KEY, res.projects);
      lastFetchAt.current = Date.now();
      setProjects(mergeCmsProjects(res.projects));
    } catch {
      if (!projectsFromCache()) setProjects(fallbackProjects);
    }
  }, []);

  useEffect(() => {
    void refreshProjects();
  }, [refreshProjects]);

  useEffect(() => {
    const maybeRefresh = () => {
      if (document.visibilityState !== "visible") return;
      if (Date.now() - lastFetchAt.current < 120_000) return;
      void refreshProjects();
    };
    window.addEventListener("focus", maybeRefresh);
    document.addEventListener("visibilitychange", maybeRefresh);
    return () => {
      window.removeEventListener("focus", maybeRefresh);
      document.removeEventListener("visibilitychange", maybeRefresh);
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
