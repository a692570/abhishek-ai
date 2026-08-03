import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  site: 'https://a692570.github.io/abhishek-ai',
  base: '/abhishek-ai',
  server: { host: true, port: 4321 },
});
