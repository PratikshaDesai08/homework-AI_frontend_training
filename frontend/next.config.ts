import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the floating dev badge so it doesn't appear in QA screenshots
  devIndicators: false,
};

export default nextConfig;
