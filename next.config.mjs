/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-contained output (server.js + only the deps it needs) — makes
  // self-hosting off Vercel (Docker or a plain VPS) much lighter to deploy.
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

export default nextConfig;
