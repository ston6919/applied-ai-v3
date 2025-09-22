/** @type {import('next').NextConfig} */

// Ensure we never point to localhost in production
const isProd = process.env.NODE_ENV === 'production'
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || (!isProd ? 'http://localhost:8010' : null)

if (isProd && !backendUrl) {
  throw new Error('NEXT_PUBLIC_BACKEND_URL must be set in production')
}

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
