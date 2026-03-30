/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly ENVIRONMENT: string;
  readonly UMAMI__SCRIPT_URL: string;
  readonly UMAMI__WEBSITE_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
