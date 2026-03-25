import { NextResponse } from 'next/server';

const BASE = 'https://royalkingseeds.us';

export async function GET() {
  const staticPages = [
    { slug: 'faq', priority: '0.5', freq: 'monthly' },
    { slug: 'contact', priority: '0.5', freq: 'monthly' },
    { slug: 'shipping', priority: '0.4', freq: 'yearly' },
    { slug: 'privacy', priority: '0.3', freq: 'yearly' },
    { slug: 'terms', priority: '0.3', freq: 'yearly' },
    { slug: 'legal', priority: '0.3', freq: 'yearly' },
    { slug: 'affiliate', priority: '0.4', freq: 'monthly' },
    { slug: 'refund-returns', priority: '0.4', freq: 'yearly' },
  ];

  const urls = staticPages.map(p => `  <url>
    <loc>${BASE}/${p.slug}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${p.freq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
