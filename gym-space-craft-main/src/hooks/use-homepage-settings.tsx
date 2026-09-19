import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apiRequest } from "@/lib/api";
import { DEFAULT_HOMEPAGE, type HomepageSettings } from "@/lib/homepage";

const HomepageSettingsContext = createContext<HomepageSettings>(DEFAULT_HOMEPAGE);

export function HomepageSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<HomepageSettings>(DEFAULT_HOMEPAGE);

  useEffect(() => {
    apiRequest<{ settings: HomepageSettings }>("/settings/homepage")
      .then((res) =>
        setSettings({
          ...DEFAULT_HOMEPAGE,
          ...res.settings,
          featuredProjectSlugs: res.settings.featuredProjectSlugs ?? DEFAULT_HOMEPAGE.featuredProjectSlugs,
          featuredBlogSlugs: res.settings.featuredBlogSlugs ?? DEFAULT_HOMEPAGE.featuredBlogSlugs,
        }),
      )
      .catch(() => setSettings(DEFAULT_HOMEPAGE));
  }, []);

  return (
    <HomepageSettingsContext.Provider value={settings}>{children}</HomepageSettingsContext.Provider>
  );
}

export function useHomepageSettings() {
  return useContext(HomepageSettingsContext);
}
