import type { Config } from "tailwindcss";

const config: Config = {
  // 核心修正：
  // 1. 去掉了 src/ 前缀
  // 2. 确保它去扫描 app 文件夹（因为你用的是 App Router）
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // 如果你有 pages 文件夹也加上，没有也不影响
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
