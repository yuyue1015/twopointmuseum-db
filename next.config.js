/** @type {import('next').NextConfig} */
const nextConfig = {
  // 开启静态导出，Cloudflare Pages 需要这个
  output: 'export',
  
  // 必须关闭图片优化，因为 Cloudflare Pages 没有 Node.js 服务器来压缩图片
  images: { unoptimized: true },
}

module.exports = nextConfig;
