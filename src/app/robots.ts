import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/checkout/', '/account/'],
    },
    sitemap: 'https://royalkingseedsusa.vercel.app/sitemap.xml',
  };
}
