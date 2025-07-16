/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for better performance
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: ["lucide-react"],
  },

  // Image optimization configuration
  images: {
    // Allow images from external domains (for user avatars, etc.)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "gitlab.com",
      },
      {
        protocol: "https",
        hostname: "bitbucket.org",
      },
    ],
    // Optimize images for better performance
    formats: ["image/webp", "image/avif"],
  },

  // Webpack configuration for better bundling
  webpack: (config, { isServer }) => {
    // Optimize bundle size
    config.resolve.alias = {
      ...config.resolve.alias,
    }

    // Handle SVG imports
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    })

    return config
  },

  // Environment variables that should be available on the client
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ]
  },

  // Redirects for better SEO
  async redirects() {
    return [
      // Add any redirects you need here
      // {
      //   source: '/old-path',
      //   destination: '/new-path',
      //   permanent: true,
      // },
    ]
  },

  // Rewrites for API proxying (if needed)
  async rewrites() {
    return [
      // Proxy API requests to your backend
      // {
      //   source: '/api/:path*',
      //   destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      // },
    ]
  },

  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Enable SWC minification for faster builds
  swcMinify: true,

  // Compiler options
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Output configuration for deployment
  output: "standalone",

  // Enable gzip compression
  compress: true,

  // Power by header removal for security
  poweredByHeader: false,

  // Trailing slash configuration
  trailingSlash: false,

  // ESLint configuration
  eslint: {
    // Ignore ESLint during builds (handle separately)
    ignoreDuringBuilds: false,
  },

  // TypeScript configuration
  typescript: {
    // Type checking during builds
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig