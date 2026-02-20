/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENVIRONMENT: string;
  readonly VITE_UMAMI__SCRIPT_URL: string;
  readonly VITE_UMAMI__WEBSITE_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
