import type { Metadata } from "next";
import { Unbounded, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import OnlineTracker from "@/components/OnlineTracker";

// Y2K Заголовки (широкий, футуристичный шрифт)
const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "cyrillic"],
});

// Y2K Текст и детали (технологичный моноширинный)
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "y2kstore — Одежда в стиле Y2K",
  description: "Стильная одежда в эстетике Y2K: тренды нулевых в современном формате",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${unbounded.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-mono bg-zinc-950 text-zinc-100 selection:bg-pink-500 selection:text-white">
        <OnlineTracker />
        {children}
      </body>
    </html>
  );
}