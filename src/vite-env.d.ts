/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly ENVIRONMENT: string;
  readonly LINKS__EMAIL: string;
  readonly LINKS__GITHUB: string;
  readonly LINKS__LINKEDIN: string;
  readonly LINKS__INSTAGRAM: string;
  readonly LINKS__SPOTIFY: string;
  readonly UMAMI__SCRIPT_URL: string;
  readonly UMAMI__WEBSITE_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
