import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jirvtxqoqrmruxsmlite.supabase.co",
      },
    ],
  },
};

export default nextConfig;
