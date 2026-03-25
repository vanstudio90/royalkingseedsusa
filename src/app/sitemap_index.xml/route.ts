import { NextResponse } from 'next/server';

const BASE = 'https://royalkingseeds.us';

export async function GET() {
  const sitemaps = [
    `${BASE}/sitemaps/product-categories.xml`,
    `${BASE}/sitemaps/products.xml`,
    `${BASE}/sitemaps/locations.xml`,
    `${BASE}/sitemaps/pages.xml`,
    `${BASE}/sitemaps/posts.xml`,
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(url => `  <sitemap>
    <loc>${url}</loc>
  </sitemap>`).join('\n')}
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
