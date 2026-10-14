import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/feature-dashboard", "@repo/feature-user", "@repo/ui"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
