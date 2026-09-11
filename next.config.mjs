/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["tesseract.js"],
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
