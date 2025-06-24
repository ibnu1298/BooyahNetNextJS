import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  eslint: {
    ignoreDuringBuilds: true, // 🚫 matikan ESLint saat build
  },
};

export default nextConfig;
