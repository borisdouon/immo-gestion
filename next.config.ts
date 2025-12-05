import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel-optimized output for better deployment
  output: 'standalone',
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    // Enable image optimization
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },

  // Compression and optimization
  compress: true,
  
  // Experimental features for better performance
  experimental: {
    // Optimize package imports
    optimizePackageImports: [
      '@tabler/icons-react',
      'lucide-react',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      '@radix-ui/react-dialog',
      'recharts',
    ],
  },

  // Production optimizations
  swcMinify: true,
  
  // Power optimization
  poweredByHeader: false,
};

// Bundle analyzer wrapper (only when ANALYZE env is set)
if (process.env.ANALYZE === 'true') {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: true,
  });
  module.exports = withBundleAnalyzer(nextConfig);
} else {
  module.exports = nextConfig;
}
