/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Unoptimized images are required for static export
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  productionBrowserSourceMaps: false,
  // Static export keeps the existing static-hosting setup for this site
  output: 'export',
  trailingSlash: true,
  compress: true,
};

module.exports = nextConfig;
