import type { APIRoute } from 'astro';
import { DRAFT } from '../lib/site';

// Preview builds ask search engines to stay away; production builds point them at the sitemap.
export const GET: APIRoute = ({ site }) => {
  const body = DRAFT
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site).href}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
