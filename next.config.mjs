/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "neighborly-oyster-880.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
