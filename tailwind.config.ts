import type { Config } from "tailwindcss";

const config: Config = {
  // 确保覆盖了 Next.js 13/14+ 的所有可能路径
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // 以防万一你有 pages 目录
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 博物馆专属调色盘
        museum: {
          primary: "#2563eb",   // 经典的“双点蓝”
          secondary: "#f59e0b", // 琥珀金（用于稀有展品）
          dark: "#0f172a",      // 深色标题
          accent: "#ec4899",    // 奇幻/超自然粉色
          paper: "#f8fafc",     // 档案纸张背景色
          muted: "#64748b",     // 辅助文字
        },
      },
      // 预设更符合游戏感的圆角
      borderRadius: {
        'game': '1.25rem',      // 这种大圆角很有卡通感
      },
      // 预设更有分量感的阴影
      boxShadow: {
        'game': '0 10px 0px -2px rgba(0, 0, 0, 0.05), 0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'game-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      // 动画扩展：让展品卡片出现时更生动
      keyframes: {
        'pop-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      },
      animation: {
        'pop': 'pop-in 0.3s ease-out forwards',
      }
    },
  },
  plugins: [],
};

export default config;
