"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

// --- ТИПЫ ДАННЫХ ---
interface Product {
  id: number;
  name: string;
  priceUzs: string;
  sizesDisplay: string;
  allSizes?: string[];
  imageUrl: string;
}

interface CategoryGroup {
  slug: string;
  categoryName: string;
  products: Product[];
}

// --- КИНЕМАТОГРАФИЧЕСКИЕ НАСТРОЙКИ ---
const cinematicEase = [0.22, 1, 0.36, 1]; 

const textRevealContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.5 },
  },
};

const textRevealItem = {
  hidden: { opacity: 0, y: 50, rotateX: -20 },
  show: { 
    opacity: 1, 
    y: 0, 
    rotateX: 0, 
    transition: { duration: 1.5, ease: cinematicEase } 
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 80, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { duration: 1.2, ease: cinematicEase } 
  },
};

// --- КОМПОНЕНТ ДЛЯ КИНОШНОГО ТЕКСТА ---
const CinematicText = ({ text, className }: { text: string; className?: string }) => {
  return (
    <motion.div variants={textRevealContainer} initial="hidden" animate="show" className={className}>
      {text.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-2 mr-[0.25em]">
          <motion.span variants={textRevealItem} className="inline-block origin-bottom">
            {word}
          </motion.span>
        </span>
      ))}
    </motion.div>
  );
};

export default function Home() {
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [selectedProductForSheet, setSelectedProductForSheet] = useState<Product | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Параллакс относительно всего документа
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 400]);
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 1000], [1, 0.9]);

  const categories: CategoryGroup[] = [
    {
      slug: "t-shirts",
      categoryName: "T-Shirts & Tops",
      products: [
        { id: 1, name: "Y2K Oversize Longsleeve Tee", priceUzs: "200 000 UZS", sizesDisplay: "XS, S, M, L", imageUrl: "/products/y2k-tee.jpg" },
        { id: 4, name: "Skeleton Cyber Longsleeve", priceUzs: "220 000 UZS", sizesDisplay: "S, M, L, XL", imageUrl: "/products/skelet.jpg" },
        { id: 7, name: "Cyber Graphic Tee", priceUzs: "140 000 UZS", sizesDisplay: "S, M, L, XL", imageUrl: "/products/futbolka.jpg" },
        { id: 8, name: "Y2K Star Print Tee", priceUzs: "80 000 UZS", sizesDisplay: "XS, S, M, L", imageUrl: "/products/futbolochka.jpg" },
      ],
    },
    {
      slug: "hoodies-pants",
      categoryName: "Hoodies & Pants",
      products: [
        { id: 2, name: "Cyber Cargo Pants", priceUzs: "380 000 UZS", sizesDisplay: "S - 2XL", imageUrl: "/products/jins.jpg" },
        { id: 3, name: "Vintage Y2K Hoodie", priceUzs: "200 000 UZS", sizesDisplay: "XS, S, M, L", imageUrl: "/products/hoodie.jpg" },
        { id: 12, name: "Pahan Y2K Zip-Hoodie", priceUzs: "200 000 UZS", sizesDisplay: "M, L, XL, 2XL", imageUrl: "/products/pahan.jpg" },
        { id: 14, name: "Y2K Pleated Cyber Skirt", priceUzs: "120 000 UZS", sizesDisplay: "XS, S, M", imageUrl: "/products/yubka.jpg" },
      ],
    },
    {
      slug: "footwear",
      categoryName: "Footwear",
      products: [
        { id: 5, name: "Y2K Cyber Sneakers Type-1", priceUzs: "500 000 UZS", sizesDisplay: "35 – 46", allSizes: ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"], imageUrl: "/products/shmot.jpg" },
        { id: 6, name: "Y2K Cyber Sneakers Type-2", priceUzs: "500 000 UZS", sizesDisplay: "35 – 46", allSizes: ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"], imageUrl: "/products/shmoti.jpg" },
      ],
    },
    {
      slug: "backpacks-bags",
      categoryName: "Backpacks & Bags",
      products: [
        { id: 13, name: "Cyberpunk Tactical Backpack", priceUzs: "220 000 UZS", sizesDisplay: "One Size", imageUrl: "/products/rukzak.jpg" },
      ],
    },
    {
      slug: "accessories",
      categoryName: "Accessories",
      products: [
        { id: 9, name: "Cyber Crown Beanie / Cap", priceUzs: "30 000 UZS", sizesDisplay: "One Size", imageUrl: "/products/korona.jpg" },
        { id: 10, name: "Retro Cyber MP3 Player", priceUzs: "130 000 UZS", sizesDisplay: "One Size", imageUrl: "/products/mp3.jpg" },
        { id: 11, name: "Y2K Cyber Headphones", priceUzs: "80 000 UZS", sizesDisplay: "One Size", imageUrl: "/products/naushi.jpg" },
      ],
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const scrollToCatalog = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const target = document.getElementById("catalog");
    if (!target) return;

    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - 100;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1200;
    let start: number | null = null;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const timeRatio = Math.min(progress / duration, 1);
      
      const ease = timeRatio === 1 ? 1 : 1 - Math.pow(2, -10 * timeRatio);

      window.scrollTo(0, startPosition + distance * ease);

      if (progress < duration) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

  const handleSizeClick = (product: Product) => {
    if (window.innerWidth < 640) {
      setSelectedProductForSheet(product);
    } else {
      setOpenDropdownId(openDropdownId === product.id ? null : product.id);
    }
  };

  const totalProducts = categories.reduce((acc, cat) => acc + cat.products.length, 0);

  return (
    <main className="min-h-screen bg-black text-zinc-100 font-mono relative selection:bg-pink-500 selection:text-white">
      
      {/* ПРЕЛОАДЕР */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div 
            initial={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 1.5, ease: cinematicEase }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
          >
            <div className="w-12 h-[1px] bg-white animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ШУМ */}
      <div className="fixed inset-0 pointer-events-none z-40 opacity-[0.15] mix-blend-screen">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
        </svg>
      </div>

      {/* ВИНЬЕТКА */}
      <div className="fixed inset-0 pointer-events-none z-30 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_120%)]" />

      {/* HERO */}
      <div className="fixed inset-0 z-0 flex flex-col justify-center items-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-gradient-to-tr from-pink-900/20 via-purple-900/10 to-cyan-900/20 rounded-full blur-[150px] animate-[pulse_8s_ease-in-out_infinite]" />
        
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 text-center px-4 w-full max-w-7xl mx-auto flex flex-col items-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, delay: 0.5, ease: cinematicEase }}
            className="mb-6 sm:mb-10"
          >
            <span className="inline-block px-4 py-2 border border-white/10 rounded-full text-[10px] sm:text-[12px] text-zinc-400 tracking-[0.4em] uppercase backdrop-blur-md">
              A Y2K Production
            </span>
          </motion.div>

          <CinematicText 
            text="Y2K STREETWEAR" 
            className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white uppercase drop-shadow-[0_0_40px_rgba(255,255,255,0.1)] leading-none"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 1.5, ease: cinematicEase }}
            className="mt-6 sm:mt-10 text-zinc-500 max-w-xl mx-auto text-xs sm:text-sm tracking-[0.2em] font-sans"
          >
            THE NEW COLLECTION IS LIVE. <br className="sm:hidden"/> WELCOME TO THE FUTURE.
          </motion.p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 2.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-600">Scroll down</span>
          <div className="w-[1px] h-12 bg-white/20 overflow-hidden relative">
            <motion.div 
              animate={{ y: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="absolute top-0 left-0 w-full h-1/2 bg-white"
            />
          </div>
        </motion.div>
      </div>

      {/* ОСНОВНОЙ КОНТЕНТ */}
      <div className="relative z-10 mt-[100vh] bg-black border-t border-white/5 pb-24 shadow-[0_-30px_50px_rgba(0,0,0,1)]">
        
        {/* Шапка */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1.5, ease: cinematicEase }}
          className="flex justify-between items-center backdrop-blur-3xl bg-black/60 border-b border-white/5 px-4 py-4 sm:px-12 sm:py-6 sticky top-0 z-40"
        >
          <h1 className="text-sm sm:text-2xl font-black tracking-[0.3em] text-white uppercase">
            Y2K
          </h1>

          <div className="flex items-center gap-4">
            <a
              href="https://t.me/y2kstore"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center p-2 rounded-full border border-white/10 hover:border-white transition-all duration-700 ease-out"
            >
              <svg className="w-4 h-4 fill-zinc-400 group-hover:fill-white transition-colors duration-700" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-2.02 9.52c-.15.68-.56.84-1.13.52l-3.1-2.28-1.5 1.44c-.17.17-.31.31-.63.31l.22-3.17 5.77-5.21c.25-.22-.05-.34-.39-.12l-7.13 4.49-3.08-.96c-.67-.21-.68-.67.14-.99l12.03-4.64c.56-.2 1.05.14.82 1.09z" />
              </svg>
            </a>
            <button
              onClick={scrollToCatalog}
              className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-zinc-400 hover:text-white transition-colors duration-700"
            >
              КАТАЛОГ
            </button>
          </div>
        </motion.header>

        {/* Каталог */}
        <div id="catalog" className="max-w-7xl mx-auto px-4 sm:px-12 pt-16 sm:pt-24 scroll-mt-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: cinematicEase }}
            className="flex items-center justify-between mb-16 pb-6 border-b border-white/10"
          >
            <h3 className="text-xs sm:text-lg font-bold tracking-[0.4em] text-white uppercase flex items-center gap-3">
              КАТАЛОГ <span className="text-zinc-600">/</span> {totalProducts}
            </h3>
          </motion.div>

          {categories.map((category) => (
            <motion.section
              key={category.categoryName}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1.5, ease: cinematicEase }}
              className="mb-24"
            >
              {/* Название категории */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4 text-xs sm:text-base font-bold tracking-[0.3em] text-zinc-300 uppercase">
                  <span>{category.categoryName}</span>
                  <div className="w-8 h-[1px] bg-zinc-700" />
                </div>
              </div>

              {/* Grid Товаров */}
              <motion.div 
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-10%" }}
                variants={{
                  hidden: { opacity: 0 },
                  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
                }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8"
              >
                {category.products.map((product) => {
                  const isOpen = openDropdownId === product.id;
                  const hasDropdown = Boolean(product.allSizes && product.allSizes.length > 0);

                  return (
                    <motion.div
                      variants={cardVariant}
                      key={product.id}
                      className="group relative flex flex-col"
                    >
                      <div className="relative w-full aspect-[3/4] mb-5 overflow-hidden bg-zinc-950 border border-white/5">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover opacity-60 grayscale-[30%] group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-[3000ms] ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90 group-hover:opacity-40 transition-opacity duration-[2000ms] ease-out" />
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-[0.03] transition-opacity duration-1000 pointer-events-none" />
                      </div>

                      <div className="flex flex-col flex-1 px-1">
                        <h5 className="font-bold text-[10px] sm:text-xs text-zinc-300 mb-2 tracking-[0.2em] uppercase line-clamp-2">
                          {product.name}
                        </h5>

                        <div className="relative mb-6 z-20" ref={isOpen ? dropdownRef : null}>
                          <p className="text-[9px] sm:text-[10px] text-zinc-600 tracking-widest font-mono flex items-center justify-between">
                            <span>SIZE: <span className="text-zinc-400">{product.sizesDisplay}</span></span>

                            {hasDropdown && (
                              <motion.button
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={() => handleSizeClick(product)}
                                className="px-2 py-1 border border-white/10 hover:border-white text-zinc-400 hover:text-white transition-colors duration-500"
                              >
                                +
                              </motion.button>
                            )}
                          </p>

                          <AnimatePresence>
                            {hasDropdown && isOpen && product.allSizes && (
                              <motion.div
                                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                                transition={{ duration: 0.5, ease: cinematicEase }}
                                className="hidden sm:block absolute left-0 top-full mt-2 w-full p-4 bg-black/90 border border-white/10 backdrop-blur-2xl z-30 shadow-2xl"
                              >
                                <span className="text-[9px] text-zinc-500 uppercase block mb-3 tracking-[0.3em] border-b border-white/10 pb-2">
                                  SELECT SIZE
                                </span>
                                <div className="grid grid-cols-3 gap-2">
                                  {product.allSizes.map((size) => (
                                    <span
                                      key={size}
                                      className="py-1.5 text-center border border-white/10 text-zinc-400 text-[10px] hover:border-white hover:text-white transition-colors cursor-pointer"
                                    >
                                      {size}
                                    </span>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <div className="mt-auto flex items-end justify-between border-t border-white/10 pt-4">
                          <p className="text-white font-mono text-[10px] sm:text-xs tracking-[0.1em]">
                            {product.priceUzs}
                          </p>
                          {/* Передача картинки под ключом &img= */}
                          <Link
                            href={`/checkout?id=${product.id}&name=${encodeURIComponent(product.name)}&price=${encodeURIComponent(product.priceUzs)}&img=${encodeURIComponent(product.imageUrl)}`}
                            className="text-[9px] sm:text-[10px] tracking-[0.3em] font-bold uppercase text-zinc-500 hover:text-white transition-colors duration-700"
                          >
                            КУПИТЬ &rarr;
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.section>
          ))}
        </div>
      </div>

      {/* Мобильная Шторка Размеров */}
      <AnimatePresence>
        {selectedProductForSheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: cinematicEase }}
              onClick={() => setSelectedProductForSheet(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 sm:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.7, ease: cinematicEase }}
              className="fixed bottom-0 left-0 right-0 p-6 bg-black border-t border-white/10 z-50 sm:hidden flex flex-col"
            >
              <div className="w-12 h-[2px] bg-zinc-800 mx-auto mb-8" />
              <div className="flex justify-between items-start mb-8">
                <h4 className="text-sm font-bold text-white uppercase tracking-[0.2em] pr-4 leading-relaxed">
                  {selectedProductForSheet.name}
                </h4>
                <button
                  onClick={() => setSelectedProductForSheet(null)}
                  className="text-zinc-600 hover:text-white p-2"
                >
                  ✕
                </button>
              </div>
              <p className="text-[10px] text-zinc-500 tracking-[0.3em] uppercase mb-4 border-b border-white/5 pb-2">
                ВЫБЕРИТЕ РАЗМЕР
              </p>
              <div className="grid grid-cols-3 gap-3 mb-8">
                {selectedProductForSheet.allSizes?.map((size) => (
                  <span
                    key={size}
                    className="py-3 text-center border border-white/10 text-zinc-300 text-xs font-mono active:bg-white active:text-black transition-colors"
                  >
                    {size}
                  </span>
                ))}
              </div>
              <button
                onClick={() => setSelectedProductForSheet(null)}
                className="w-full py-4 bg-white text-black font-bold text-[10px] uppercase tracking-[0.4em]"
              >
                ЗАКРЫТЬ
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Мобильная навигация */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 sm:hidden w-[90%] max-w-xs mix-blend-difference">
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full py-3 px-8 flex justify-between items-center text-white">
          <button
            onClick={() => scrollToCatalog()}
            className="text-[9px] font-bold tracking-[0.3em] uppercase opacity-70 hover:opacity-100"
          >
            КАТАЛОГ
          </button>
          <div className="w-[1px] h-4 bg-white/30" />
          <a
            href="https://t.me/y2kstore"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] font-bold tracking-[0.3em] uppercase opacity-70 hover:opacity-100"
          >
            TELEGRAM
          </a>
        </div>
      </div>
    </main>
  );
}