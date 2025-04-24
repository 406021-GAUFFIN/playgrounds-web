/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
    unoptimized: true,
    domains: ["localhost"],
  },
  output: "standalone",
};

export default nextConfig;
