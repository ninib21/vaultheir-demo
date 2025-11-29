/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker and Electron deployments
  output: 'standalone',
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },
  turbopack: {},
  webpack: (config, { isServer }) => {
    // WebGPU support for Three.js
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;

