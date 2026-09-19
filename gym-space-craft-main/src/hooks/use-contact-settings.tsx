import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apiRequest } from "@/lib/api";
import { DEFAULT_CONTACT, type ContactSettings } from "@/lib/contact";

const ContactSettingsContext = createContext<ContactSettings>(DEFAULT_CONTACT);

export function ContactSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ContactSettings>(DEFAULT_CONTACT);

  useEffect(() => {
    apiRequest<{ settings: ContactSettings }>("/settings/contact")
      .then((res) => setSettings({ ...DEFAULT_CONTACT, ...res.settings }))
      .catch(() => setSettings(DEFAULT_CONTACT));
  }, []);

  return (
    <ContactSettingsContext.Provider value={settings}>{children}</ContactSettingsContext.Provider>
  );
}

export function useContactSettings() {
  return useContext(ContactSettingsContext);
}
