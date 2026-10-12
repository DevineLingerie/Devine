import type { NextConfig } from "next";

// Les images administrées sont servies par Supabase Storage : on autorise
// uniquement le bucket public du projet configuré.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseImages = supabaseUrl
  ? [
      {
        protocol: "https" as const,
        hostname: new URL(supabaseUrl).hostname,
        pathname: "/storage/v1/object/public/site-images/**",
      },
    ]
  : [];

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'",
  },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  // Serveur Node autonome : déployable sur Vercel, l'hébergement Node.js de
  // Hostinger ou tout serveur (voir docs/deploiement.md).
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  images: {
    remotePatterns: supabaseImages,
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    serverActions: {
      // Envoi d'images depuis l'administration (5 Mo max côté Storage).
      bodySizeLimit: "6mb",
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
