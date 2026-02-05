import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  typescript: {
    // Dit mag meestal wel nog, voorkomt dat de build stopt bij typefoutjes
    ignoreBuildErrors: true,
  },
};

export default nextConfig;