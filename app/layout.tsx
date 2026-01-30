import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "双点博物馆展品库 | 悦小白游戏记",
  description: "双点博物馆全展品查询系统。",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "博物馆档案",
  },
  // 关键：确保 iOS 桌面图标显示
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {/* 主内容区 */}
        <main className="max-w-[1600px] mx-auto">
          {children}
        </main>

        {/* 预留：未来可加统计 / 页脚 */}
      </body>
    </html>
  );
}


