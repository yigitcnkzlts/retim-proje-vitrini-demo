import type { NextConfig } from "next";
import { getLegacyRedirects } from "./src/lib/seo/legacy-redirects";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    return getLegacyRedirects();
  },
};

export default nextConfig;
