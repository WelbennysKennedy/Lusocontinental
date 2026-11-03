import type { APIRoute } from 'astro';
import { routes } from '../data/site';

// Só entram as páginas públicas listadas em `routes`; a página de agradecimento fica de fora.
export const GET: APIRoute = ({ site }) => {
  const urls = Object.values(routes)
    .map((route) => `  <url><loc>${new URL(route, site).href}</loc></url>`)
    .join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
