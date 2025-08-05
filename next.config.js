/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'img.clerk.com',
      'images.clerk.dev',
      'www.gravatar.com',
    ],
  },
  // Enable experimental features if needed
  experimental: {
    // Modern features can be added here
  },
}

module.exports = nextConfig
