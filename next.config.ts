import type { NextConfig } from "next";

const nextConfig: NextConfig =  {
   outputFileTracingRoot: __dirname,
 reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  
};

export default nextConfig;
