import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL("https://res.cloudinary.com/dqeqlgygu/image/upload/**"),
      new URL("https://upload.wikimedia.org/wikipedia/commons/**"),
    ],
  },
};

export default nextConfig;
