import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// GitHub Pages 프로젝트 사이트: https://<user>.github.io/<repo>/
export default defineConfig({
  site: 'https://resume.dongholab.com',
  base: '/',
  output: 'static',
  integrations: [tailwind({ applyBaseStyles: true })],
});
