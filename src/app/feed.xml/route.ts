import { getRecentPosts } from '@/lib/blog-content';

export async function GET() {
  const posts = getRecentPosts(50);

  const items = posts
    .map(
      (post) => `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>https://royalkingseeds.us/blog/${post.slug}</link>
      <guid isPermaLink="true">https://royalkingseeds.us/blog/${post.slug}</guid>
      <description><![CDATA[${post.metaDescription}]]></description>
      <pubDate>${new Date(post.publishDate).toUTCString()}</pubDate>
    </item>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Royal King Seeds — Cannabis Growing Guides</title>
    <link>https://royalkingseeds.us/blog</link>
    <description>Cannabis cultivation guides, strain reviews, and growing tips from Royal King Seeds USA.</description>
    <language>en-us</language>
    <atom:link href="https://royalkingseeds.us/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
