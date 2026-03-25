import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/futu/', '/api/admin/'],
    },
    sitemap: 'https://royalkingseeds.us/sitemap_index.xml',
  };
}
