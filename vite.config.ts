import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';

const CLIENT_ENVS = [
  'ENVIRONMENT',
  'LINKS__GITHUB',
  'LINKS__LINKEDIN',
  'LINKS__INSTAGRAM',
  'LINKS__SPOTIFY',
  'LINKS__EMAIL',
  'UMAMI__SCRIPT_URL',
  'UMAMI__WEBSITE_ID'
] as const;

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: '/',
    plugins: [react(), tsconfigPaths()],
    define: Object.fromEntries(CLIENT_ENVS.map((key) => [`import.meta.env.${key}`, JSON.stringify(env[key] ?? '')])),
    logLevel: 'info',
    clearScreen: false
  };
});
