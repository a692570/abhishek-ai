import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  site: 'https://abhisheksharma.si',
  base: '/',
  server: { host: true, port: 4321 },
});
