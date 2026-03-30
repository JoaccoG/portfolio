const PRODUCTION_ENV = {
  ENVIRONMENT: 'production',
  UMAMI__SCRIPT_URL: 'https://test.com/',
  UMAMI__WEBSITE_ID: 'test-website-id'
} as const;

/**
 * Stubs environment variables needed to simulate a production environment.
 * Uses `vi.stubEnv` so values are automatically restored after each test.
 */
export const stubProductionEnv = () => {
  Object.entries(PRODUCTION_ENV).forEach(([key, value]) => {
    vi.stubEnv(key, value);
  });
};
