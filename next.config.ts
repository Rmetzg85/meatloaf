import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },
  // Retired business pages (landlords, agents, lenders) now point to the homepage.
  async redirects() {
    return [
      { source: '/landlords', destination: '/', permanent: false },
      { source: '/agents', destination: '/', permanent: false },
      { source: '/lenders', destination: '/', permanent: false },
    ];
  },
};

export default nextConfig;
