import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const font = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "Habit Gacha | 習慣ガチャ",
  description: "毎日1分、人生がちょっと進むタスクを引く習慣ガチャ"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${font.variable} font-sans min-h-screen bg-background text-foreground`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {\n  const stored = localStorage.getItem('theme');\n  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;\n  const theme = stored ?? (prefersDark ? 'dark' : 'light');\n  if (theme === 'dark') document.documentElement.classList.add('dark');\n})();`
          }}
        />
        {children}
      </body>
    </html>
  );
}
