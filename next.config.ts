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
        hostname: 'deqhnjxhsomgqrymptze.supabase.co',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
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
        ],
      },
    ];
  },
};

export default nextConfig;
