import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Allow images from Cloudflare R2 public URLs
    remotePatterns: [
      {
        protocol: 'https',
        // R2 development subdomain pattern
        hostname: '**.r2.dev',
        pathname: '/**',
      },
      {
        protocol: 'https',
        // Custom domain on R2 (if configured)
        hostname: process.env.R2_PUBLIC_HOSTNAME ?? 'placeholder.r2.dev',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
}

export default nextConfig
