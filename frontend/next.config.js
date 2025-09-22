/** @type {import('next').NextConfig} */

// Only use localhost proxy in development; never in production
const isProd = process.env.NODE_ENV === 'production'
const devBackendUrl = 'http://localhost:8010'

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    if (isProd) {
      // No rewrites in production to avoid pointing at localhost
      return []
    }
    return [
      {
        source: '/api/:path*',
        destination: `${devBackendUrl}/api/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
