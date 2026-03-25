import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/products/data';

const BASE = 'https://royalkingseeds.us';

export async function GET() {
  const products = getProducts();

  const urls = products.map(p => `  <url>
    <loc>${BASE}/${p.slug}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
