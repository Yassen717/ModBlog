import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Point Turbopack to this app directory as the workspace root
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
