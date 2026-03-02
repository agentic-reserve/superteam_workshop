/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['arweave.net', 'ipfs.io'],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

export default nextConfig;
