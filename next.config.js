/** @type {import('next').NextConfig} */

const securityHeaders = [
  // Empêche le clickjacking
  { key: "X-Frame-Options", value: "DENY" },
  // Empêche le sniffing MIME
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Limite les infos transmises au referer
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Désactive les APIs sensibles non utilisées
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  // Force HTTPS — 1 an
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  // Content Security Policy
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://*.supabase.co https://ui-avatars.com",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co https://va.vercel-scripts.com",
      "frame-src 'none'",
      "worker-src 'self' blob:",
    ].join("; "),
  },
];

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
