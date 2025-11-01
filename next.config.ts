import type {NextConfig} from 'next';
import createMDX from '@next/mdx';
import remarkDirective from 'remark-directive';
import remarkGfm from 'remark-gfm';
import { remarkAdmonitionDirective } from './src/lib/remark-admonition-directive';

const nextConfig: NextConfig = {
  /* config options here */
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  
  // Fix OpenTelemetry vendor chunk issue in Next.js 15
  serverExternalPackages: ['@opentelemetry/api', '@opentelemetry/instrumentation'],
  
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  
  // Compression
  compress: true,
  
  // Webpack configuration to fix caching issues
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Disable webpack caching to prevent snapshot errors
    config.cache = false;
    
    // Fix OpenTelemetry vendor chunk issue
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        '@opentelemetry/api': 'commonjs @opentelemetry/api',
        '@opentelemetry/instrumentation': 'commonjs @opentelemetry/instrumentation',
      });
    }
    
    // Add fallbacks for Node.js modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
      crypto: false,
      stream: false,
      buffer: false,
      util: false,
      assert: false,
      url: false,
      querystring: false,
    };
    
    // Ignore specific warnings
    config.ignoreWarnings = [
      /Critical dependency: the request of a dependency is an expression/,
      /Failed to parse source map/,
      /webpack\.cache\.PackFileCacheStrategy/,
    ];
    
    // Reduce stats verbosity
    config.stats = {
      ...config.stats,
      warnings: false,
      cached: false,
      cachedAssets: false,
    };
    
    return config;
  },
  
  // Images optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  // Headers for security and performance
  async headers() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const allowedOrigin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9003';

    return [
      {
        // Security headers for all routes
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        // CORS headers for API routes
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: isDevelopment ? '*' : allowedOrigin,
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Access-Control-Max-Age',
            value: '86400',
          },
        ],
      },
    ];
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [
      remarkGfm, // Enable GitHub Flavored Markdown (tables, strikethrough, etc.)
      remarkDirective,
      remarkAdmonitionDirective,
    ],
    rehypePlugins: [],
  },
});

// Wrap MDX and Next.js config with each other
export default withMDX(nextConfig);
