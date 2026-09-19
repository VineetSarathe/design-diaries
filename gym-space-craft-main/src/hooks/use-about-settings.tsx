import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apiRequest } from "@/lib/api";
import { DEFAULT_ABOUT, type AboutSettings } from "@/lib/about";

const AboutSettingsContext = createContext<AboutSettings>(DEFAULT_ABOUT);

export function AboutSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AboutSettings>(DEFAULT_ABOUT);

  useEffect(() => {
    apiRequest<{ settings: AboutSettings }>("/settings/about")
      .then((res) => setSettings({ ...DEFAULT_ABOUT, ...res.settings }))
      .catch(() => setSettings(DEFAULT_ABOUT));
  }, []);

  return <AboutSettingsContext.Provider value={settings}>{children}</AboutSettingsContext.Provider>;
}

export function useAboutSettings() {
  return useContext(AboutSettingsContext);
}
