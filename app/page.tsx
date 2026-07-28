"use client";

import Image from "next/image";
import Link from "next/link";

const USD_TO_UZS_RATE = 12048.99;

function formatUzsPrice(usdPriceStr: string): string {
  const usd = parseFloat(usdPriceStr.replace(/[^0-9.]/g, ""));
  if (isNaN(usd)) return "0 UZS";
  const uzs = Math.round(usd * USD_TO_UZS_RATE);
  return `${uzs.toLocaleString("ru-RU")} UZS`;
}

export default function Home() {
  const products = [
    {
      id: 1,
      name: "Y2K Oversize Longsleeve Tee",
      priceUsd: "$24.99",
      formattedPriceUzs: null,
      imageUrl: "/products/y2k-tee.jpg",
    },
    {
      id: 2,
      name: "Cyber Cargo Pants",
      priceUsd: "$39.99",
      formattedPriceUzs: null,
      imageUrl: "/products/jins.jpg",
    },
    {
      id: 3,
      name: "Vintage Y2K Hoodie",
      priceUsd: "$24.99",
      formattedPriceUzs: "301 104 UZS",
      imageUrl: "/products/hoodie.jpg",
    },
  ];

  // Функция плавной прокрутки до каталога
  const scrollToCatalog = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const catalogElement = document.getElementById("catalog");
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12 font-mono relative overflow-hidden selection:bg-pink-500 selection:text-white">
      {/* 🌌 Плавно мерцающий Y2K фон */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] bg-gradient-to-tr from-pink-600/25 to-purple-600/20 rounded-full blur-[150px] animate-pulse duration-[10000ms] ease-in-out" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[700px] h-[700px] bg-gradient-to-bl from-cyan-500/20 to-indigo-600/20 rounded-full blur-[150px] animate-pulse duration-[8000ms] delay-1000 ease-in-out" />
        <div className="absolute top-[30%] left-[25%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[160px] animate-pulse duration-[12000ms] ease-in-out" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Навигация с иконкой Telegram */}
        <header className="mb-12 flex justify-between items-center backdrop-blur-2xl bg-zinc-900/40 border border-white/15 px-6 py-4 rounded-3xl shadow-[0_0_25px_rgba(236,72,153,0.15)] sticky top-4 z-50 transition-all duration-500">
          <h1 className="text-xl font-extrabold tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-fuchsia-300 to-cyan-300 uppercase drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]">
            ★ Y2K STORE ★
          </h1>

          <div className="flex items-center gap-3 sm:gap-4">
            <span className="hidden sm:inline-block text-xs tracking-widest bg-pink-950/60 text-pink-300 px-3.5 py-1.5 rounded-full border border-pink-500/30 shadow-[0_0_10px_rgba(236,72,153,0.2)]">
              ✦ ТАШКЕНТ
            </span>

            {/* Иконка Телеграма */}
            <a
              href="https://t.me/y2kstore"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full border border-sky-500/40 bg-sky-950/30 text-sky-400 hover:text-white hover:bg-sky-500/20 hover:border-sky-400 hover:shadow-[0_0_15px_rgba(56,189,248,0.5)] active:scale-95 transition-all duration-500 ease-out flex items-center justify-center"
              title="Наш Telegram канал"
            >
              <svg
                className="w-4 h-4 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-2.02 9.52c-.15.68-.56.84-1.13.52l-3.1-2.28-1.5 1.44c-.17.17-.31.31-.63.31l.22-3.17 5.77-5.21c.25-.22-.05-.34-.39-.12l-7.13 4.49-3.08-.96c-.67-.21-.68-.67.14-.99l12.03-4.64c.56-.2 1.05.14.82 1.09z" />
              </svg>
            </a>

            {/* Кнопка «КАТАЛОГ» */}
            <nav className="text-xs tracking-widest">
              <a
                href="#catalog"
                onClick={scrollToCatalog}
                className="inline-flex items-center px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-950/30 text-cyan-300 hover:text-white hover:bg-cyan-500/20 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] active:scale-95 transition-all duration-500 ease-out cursor-pointer"
              >
                 КАТАЛОГ 
              </a>
            </nav>
          </div>
        </header>

        {/* Главный Баннер */}
        <section className="mb-20 relative">
          <div className="backdrop-blur-xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/15 p-8 md:p-16 rounded-3xl text-center shadow-[0_10px_40px_rgba(0,0,0,0.8)] relative overflow-hidden group transition-all duration-700 hover:border-pink-500/30">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <span className="inline-block px-4 py-1.5 bg-pink-500/15 border border-pink-400/30 rounded-full text-[11px] font-semibold text-pink-300 mb-6 tracking-[0.3em] uppercase shadow-[0_0_12px_rgba(236,72,153,0.3)] transition-all duration-500 hover:scale-105">
             NEW COLLECTION 2026 
            </span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400 uppercase">
              Y2K STREETWEAR
            </h2>
            <p className="text-zinc-400 max-w-lg mx-auto text-xs md:text-sm leading-relaxed tracking-wider font-sans">
              Минималистичный сайбер-панк & уличный стиль. Быстрая доставка по Ташкенту.
            </p>
          </div>
        </section>

        {/* Каталог */}
        <section id="catalog" className="pt-4 scroll-mt-28">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
            <h3 className="text-xs font-bold tracking-[0.3em] text-pink-300 uppercase flex items-center gap-2">
              <span className="animate-pulse">✧</span> КАТАЛОГ ТОВАРОВ
            </h3>
            <span className="text-xs text-cyan-400/80 font-mono">[ 3 POSITIONS ]</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products.map((product) => {
              const priceInUzs =
                product.formattedPriceUzs || formatUzsPrice(product.priceUsd);

              return (
                <div
                  key={product.id}
                  className="group relative backdrop-blur-xl bg-zinc-900/30 border border-white/10 hover:border-pink-500/50 rounded-2xl p-4 flex flex-col transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(236,72,153,0.25)]"
                >
                  <div className="relative w-full h-80 mb-5 rounded-xl overflow-hidden bg-zinc-950 border border-white/10 group-hover:border-cyan-400/40 transition-colors duration-500">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-500" />
                  </div>

                  <h4 className="font-bold text-sm text-zinc-100 mb-2 tracking-wider uppercase group-hover:text-pink-300 transition-colors duration-300">
                    {product.name}
                  </h4>
                  <p className="text-cyan-300 font-extrabold text-base mb-6 tracking-widest drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">
                    {priceInUzs}
                  </p>

                  <Link
                    href={`/checkout?id=${product.id}&name=${encodeURIComponent(
                      product.name
                    )}&price=${encodeURIComponent(
                      product.priceUsd
                    )}&img=${encodeURIComponent(product.imageUrl)}`}
                    className="mt-auto w-full text-center py-3.5 rounded-xl font-bold text-xs tracking-[0.2em] uppercase bg-gradient-to-r from-zinc-900 to-zinc-800 hover:from-pink-600 hover:to-purple-600 border border-white/20 hover:border-pink-300 text-zinc-200 hover:text-white transition-all duration-500 ease-out shadow-lg hover:shadow-[0_0_20px_rgba(236,72,153,0.6)] active:scale-95"
                  >
                    КУПИТЬ 
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}