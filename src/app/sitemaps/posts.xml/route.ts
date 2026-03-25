import { NextResponse } from 'next/server';
import blogSlugs from '@/lib/blog-slugs.json';

const BASE = 'https://royalkingseeds.us';

export async function GET() {
  const blogIndex = `  <url>
    <loc>${BASE}/blog</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;

  const postUrls = (blogSlugs as { slug: string }[]).map(b => `  <url>
    <loc>${BASE}/blog/${b.slug}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${blogIndex}
${postUrls.join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
