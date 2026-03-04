import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "export",
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "src")],
  },
};

export default nextConfig;
