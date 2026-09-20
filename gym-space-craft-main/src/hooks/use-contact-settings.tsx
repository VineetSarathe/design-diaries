import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apiRequest } from "@/lib/api";
import { DEFAULT_CONTACT, type ContactSettings } from "@/lib/contact";

const ContactSettingsContext = createContext<ContactSettings>(DEFAULT_CONTACT);

export function ContactSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ContactSettings>(DEFAULT_CONTACT);

  useEffect(() => {
    apiRequest<{ settings: ContactSettings }>("/settings/contact")
      .then((res) => {
        const merged = { ...DEFAULT_CONTACT, ...res.settings };
        if (!merged.instagram?.includes("designdiaries_by_sagrika_")) {
          merged.instagram = DEFAULT_CONTACT.instagram;
        }
        if (!merged.linkedin?.includes("designdiariesbysagrika")) {
          merged.linkedin = DEFAULT_CONTACT.linkedin;
        }
        setSettings(merged);
      })
      .catch(() => setSettings(DEFAULT_CONTACT));
  }, []);

  return (
    <ContactSettingsContext.Provider value={settings}>{children}</ContactSettingsContext.Provider>
  );
}

export function useContactSettings() {
  return useContext(ContactSettingsContext);
}
