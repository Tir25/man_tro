/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  // Remove generateBuildId: null as it can cause chunk loading issues
  images: {
    formats: ['image/avif', 'image/webp'],
    // Enable optimized image formats for better performance
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Image CDN configuration (can be extended with custom CDN)
    // For production, consider using a CDN like Cloudinary, Imgix, or Cloudflare Images
    // See docs/IMAGE_CDN_SETUP.md for setup instructions
    minimumCacheTTL: 31536000, // Cache images for 1 year (optimized images are immutable)
    // Reduce maximum image dimension for service cards (they're displayed smaller)
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Compression
  compress: true,
  // Power optimizations
  poweredByHeader: false,
}

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)

