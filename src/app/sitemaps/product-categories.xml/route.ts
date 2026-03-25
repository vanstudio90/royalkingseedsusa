import { NextResponse } from 'next/server';
import { categories } from '@/lib/categories';

const BASE = 'https://royalkingseeds.us';

export async function GET() {
  const homepage = `  <url>
    <loc>${BASE}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

  const mainSlugs = new Set([
    'shop-all-cannabis-seeds', 'feminized-seeds', 'autoflowering-seeds',
    'indica-seeds', 'sativa-seeds', 'hybrid', 'cbd-strains',
    'high-tch-seeds', 'mix-packs', 'kush-seeds', 'exotic-cannabis-seeds',
    'best-strains-for-outdoor-growing', 'fast-flowering-seeds',
    'best-strains-for-anxiety', 'purple-genetics-seeds', 'fruity-cannabis-seeds',
    'best-seller', 'usa-premium-cannabis-seeds', 'photoperiod',
    'classic-cannabis-seeds', 'energizing-cannabis-seeds',
  ]);

  const catUrls = categories.filter(c => mainSlugs.has(c.slug)).map(c => `  <url>
    <loc>${BASE}/product-category/${c.slug}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${homepage}
${catUrls.join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
