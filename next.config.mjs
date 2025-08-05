/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  // Allow cross-origin requests from local network devices
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
  // Configure allowed development origins for local network access
  allowedDevOrigins: [
    '192.168.0.0/24',    // Common local network range
    '192.168.1.0/24',    // Another common local network range
    '10.0.0.0/8',        // Private network range
    '172.16.0.0/12',     // Private network range
  ],
};

export default nextConfig;