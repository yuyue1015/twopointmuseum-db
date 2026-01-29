import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "双点博物馆展品档案库",
    template: "%s · 双点博物馆展品档案库",
  },
  description: "双点博物馆展品搜索与资料查询系统",
  applicationName: "Two Point Museum DB",
  authors: [{ name: "Two Point Museum" }],
  robots: {
    index: true,
    follow: true,
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
