/** @type {import('next').NextConfig} */

// 这里填你的 GitHub 仓库名 (例如你的仓库是 TPMoption)
const repoName = 'TPMoption'; 

const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  
  // 核心修改：让 Next.js 知道它运行在子目录下
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}/` : '',
}

module.exports = nextConfig
