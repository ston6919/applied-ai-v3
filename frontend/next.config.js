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
    // Only rewrite specific backend endpoints, not all /api/* paths
    // This allows Next.js API routes (like /api/waiting-list, /api/subscribe) to work
    return [
      {
        source: '/api/news/:path*',
        destination: `${devBackendUrl}/api/news/:path*`,
      },
      {
        source: '/api/tools/:path*',
        destination: `${devBackendUrl}/api/tools/:path*`,
      },
      {
        source: '/api/automations/:path*',
        destination: `${devBackendUrl}/api/automations/:path*`,
      },
      {
        source: '/api/mastermind/:path*',
        destination: `${devBackendUrl}/api/mastermind/:path*`,
      },
      {
        source: '/api/landing-pages/:path*',
        destination: `${devBackendUrl}/api/landing-pages/:path*`,
      },
      {
        source: '/api/n8n-templates/:path*',
        destination: `${devBackendUrl}/api/n8n-templates/:path*`,
      },
      {
        source: '/api/contact/:path*',
        destination: `${devBackendUrl}/api/contact/:path*`,
      },
      {
        source: '/api/storage/:path*',
        destination: `${devBackendUrl}/api/storage/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
