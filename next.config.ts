import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["img.clerk.com"],
  },
  eslint: {
    // Disable ESLint during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Dangerously allow production builds to complete even with type errors
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
