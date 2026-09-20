import TagManager from "react-gtm-module";

export function trackEvent(event: string, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  try {
    TagManager.dataLayer({ dataLayer: { event, ...payload } });
  } catch {
    /* GTM is optional in local/dev */
  }
}
