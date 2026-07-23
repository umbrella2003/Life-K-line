import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "人生K线 | AI命理与性格解析",
  description: "根据生辰八字生成人生K线图,结合易经与MBTI解析性格,AI驱动的传统文化娱乐应用",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
