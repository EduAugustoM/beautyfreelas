import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enforce strict mode for React
  reactStrictMode: true,

  // Static export to out/ directory for free deployment to Firebase Hosting
  output: "export",

  // Image optimization cannot rely on Node.js server in static export
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
