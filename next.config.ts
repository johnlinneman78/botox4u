import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      // Google Places ToS Blocklist - Do not add these hostnames back.
      // We use og:image scraping and provider-uploaded images only.
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  async redirects() {
    return [
      {
        source: '/botox/portland-or-pricing-guide',
        destination: '/blog/how-much-does-botox-cost-2026',
        permanent: true,
      },
      {
        source: '/blog/botox-pricing-guide-2024',
        destination: '/blog/how-much-does-botox-cost-2026',
        permanent: true,
      },
      {
        source: '/blog/portland-botox-pricing-guide',
        destination: '/blog/how-much-does-botox-cost-2026',
        permanent: true,
      },
      {
        source: '/blog/natural-results-injector-guide',
        destination: '/blog/how-to-find-good-botox-injector',
        permanent: true,
      },
      {
        source: '/blog/most-trusted-scottsdale-medspas',
        destination: '/blog/how-to-find-good-botox-injector',
        permanent: true,
      },
      {
        source: '/blog/polynucleotides-portland-neighborhood-guide-2026',
        destination: '/blog/polynucleotides-regenerative-injector-city-guide-2026',
        permanent: true,
      },
      {
        source: '/blog/daxxify-portland-long-acting-tox-guide',
        destination: '/blog/daxxify-long-acting-tox-city-reports-2026',
        permanent: true,
      },
      // Old brand page removals to avoid ghost views
      {
        source: '/find-top-providers',
        destination: '/',
        permanent: true,
      },
      {
        source: '/natural-results',
        destination: '/',
        permanent: true,
      },
      {
        source: '/find-top-injectors',
        destination: '/',
        permanent: true,
      },
      // Domain-level catch-all redirect (to be used when botox-4u.com points to this deployment)
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.botox-4u.com',
          },
        ],
        destination: 'https://www.injectorindex.com/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'botox-4u.com',
          },
        ],
        destination: 'https://injectorindex.com/:path*',
        permanent: true,
      },

    ]
  },
};

export default nextConfig;
