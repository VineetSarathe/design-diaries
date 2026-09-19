/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GTM_ID: string;
  readonly VITE_API_URL: string;
  readonly VITE_SITE_URL?: string;
  readonly VITE_WEB3FORMS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "react-gtm-module" {
  type TagManagerArgs = {
    gtmId: string;
    dataLayer?: Record<string, unknown>;
    dataLayerName?: string;
    auth?: string;
    preview?: string;
    events?: Record<string, unknown>;
  };

  const TagManager: {
    initialize: (args: TagManagerArgs) => void;
    dataLayer: (args: { dataLayer?: Record<string, unknown>; dataLayerName?: string }) => void;
  };

  export default TagManager;
}