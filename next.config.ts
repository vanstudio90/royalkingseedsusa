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
  async rewrites() {
    return [
      // .well-known discovery for AI engines
      { source: '/.well-known/llms.txt', destination: '/llms.txt' },
      { source: '/.well-known/llms-full.txt', destination: '/llms-full.txt' },
    ];
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
          // Language & indexing
          { key: "X-Content-Language", value: "en-US" },
          { key: "X-Robots-Tag", value: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
          // Security headers (crawler-safe — no restrictive CSP that blocks bots)
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/llms.txt",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400" },
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
          { key: "X-Robots-Tag", value: "noindex" },
        ],
      },
      {
        source: "/llms-full.txt",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400" },
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
          { key: "X-Robots-Tag", value: "noindex" },
        ],
      },
    ];
  },
};

export default nextConfig;
