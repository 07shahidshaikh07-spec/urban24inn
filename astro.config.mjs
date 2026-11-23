// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// The real domain is not decided yet (see docs/01-discovery-report.md, Q5).
// Set SITE_URL when building for production, e.g. SITE_URL=https://www.example.in
const site = process.env.SITE_URL || 'https://www.example.com';

export default defineConfig({
  site,
  trailingSlash: 'always',
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/checklist/'),
      i18n: { defaultLocale: 'en', locales: { en: 'en-IN', mr: 'mr-IN' } },
    }),
  ],
  // Inline all CSS: no render-blocking stylesheet requests on slow 4G.
  build: { inlineStylesheets: 'always' },
});
