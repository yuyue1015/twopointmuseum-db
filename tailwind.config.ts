import type { Config } from "tailwindcss";

const config: Config = {
  // 核心修复：移除 src/，直接指向根目录的 app
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 可以在这里扩展自定义颜色，例如博物馆的主题色
      colors: {
        museum: {
          50: '#fcfaf8',
          100: '#f6f1eb',
          500: '#d97706', // 琥珀色/橙色作为主色调
          900: '#451a03',
        }
      }
    },
  },
  plugins: [],
};
export default config;
