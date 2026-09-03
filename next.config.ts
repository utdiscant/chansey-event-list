import type { NextConfig } from 'next';

const assetPrefix = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig: NextConfig = {
  assetPrefix: assetPrefix || undefined,
  output: 'export',
};

export default nextConfig;
