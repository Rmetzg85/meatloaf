import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },
  // Retired business pages (landlords, agents, lenders) now point to the homepage.
  async redirects() {
    return [
      // Old domain: every path on meatloaf.rent goes to the same path on www.meatloafhomes.com (308, query kept).
      ...['www.meatloaf.rent', 'meatloaf.rent'].map((host) => ({
        source: '/:path*',
        has: [{ type: 'host' as const, value: host }],
        destination: 'https://www.meatloafhomes.com/:path*',
        permanent: true,
      })),
      { source: '/landlords', destination: '/', permanent: false },
      { source: '/agents', destination: '/', permanent: false },
      { source: '/lenders', destination: '/', permanent: false },
      // The old rental "add property" form is retired; sale listings are created here.
      { source: '/landlord/properties/new', destination: '/agent/listings/new', permanent: true },
    ];
  },
};

export default nextConfig;
