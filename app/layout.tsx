import type { Metadata } from "next";
import { Unbounded, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { MarqueeBanner } from "@/components/MarqueeBanner";
import CartDrawer from "@/components/CartDrawer";
// Исправленный путь: CartContext лежит в app/context/
import { CartProvider } from "@/app/context/CartContext";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "cyrillic"],
});

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
      <body className="h-full bg-[#050508] text-zinc-100 font-mono overflow-x-hidden selection:bg-pink-500 selection:text-white">
        <CartProvider>
          <MarqueeBanner />
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}