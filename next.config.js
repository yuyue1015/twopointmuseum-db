/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  // Cloudflare Pages 不需要 basePath 或 assetPrefix，保持为空即可
}

module.exports = nextConfig;
