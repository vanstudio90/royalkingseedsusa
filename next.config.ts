import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'royalkingseeds.us',
      },
      {
        protocol: 'https',
        hostname: 'rckttutllwvebznqzyje.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'deqhnjxhsomgqrymptze.supabase.co',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async redirects() {
    return [
      // Old WordPress -cannabis-seeds slugs → correct -feminized slugs
      { source: '/:slug-cannabis-seeds', destination: '/:slug-feminized', permanent: true },
      { source: '/:slug-cannabis-seed', destination: '/:slug-feminized', permanent: true },
      // Old blog URL
      { source: '/royal-king-blog', destination: '/blog', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Language",
            value: "en-US",
          },
          {
            key: "X-Robots-Tag",
            value: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
          },
        ],
      },
      {
        source: "/llms.txt",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400" },
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
        ],
      },
      {
        source: "/llms-full.txt",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400" },
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
        ],
      },
    ];
  },
};

export default nextConfig;
