import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  poweredByHeader: false,
  allowedDevOrigins: ["macbook", "macbook.local", "192.168.0.160"],
  images: {
    qualities: [90, 95],
    unoptimized: true,
  },
};

export default nextConfig;
