const PRODUCTION_ENV = {
  VITE_ENVIRONMENT: 'production',
  VITE_UMAMI__SCRIPT_URL: 'https://test.com/',
  VITE_UMAMI__WEBSITE_ID: 'test-website-id'
} as const;

export const stubProductionEnv = () => {
  Object.entries(PRODUCTION_ENV).forEach(([key, value]) => {
    vi.stubEnv(key, value);
  });
};
