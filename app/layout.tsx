import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "双点博物馆展品库 | 悦小白游戏记",
  description: "双点博物馆展品查询系统。",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "展品库",
  },
  icons: {
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
      <body className="bg-slate-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}
