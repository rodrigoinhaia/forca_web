import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
  // Enable standalone output for Docker
  output: "standalone",
};

export default nextConfig;
