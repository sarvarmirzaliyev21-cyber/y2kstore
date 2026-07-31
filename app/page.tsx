"use client";

import { useState, useRef, useEffect, MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ReactLenis } from "lenis/react";

// --- ТИПЫ ---
interface Product {
  id: number;
  name: string;
  priceUzs: number;
  sizesDisplay: string;
  allSizes?: string[];
  imageUrl: string;
  tag?: string;
}

interface CategoryGroup {
  slug: string;
  categoryName: string;
  products: Product[];
}

// --- CINEMATIC PHYSICS ---
const cinematicEase = [0.16, 1, 0.3, 1] as const;
const springSoft = { type: "spring" as const, stiffness: 80, damping: 20, mass: 0.8 };

const textRevealContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.035, delayChildren: 0.15 },
  },
};

const textRevealItem = {
  hidden: { opacity: 0, y: 90, rotateX: -55, filter: "blur(14px)" },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: "blur(0px)",
    transition: { duration: 1.55, ease: cinematicEase },
  },
};

// --- CINEMATIC TEXT ---
const CinematicText = ({ text, className }: { text: string; className?: string }) => (
  <motion.div
    variants={textRevealContainer}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: "-5%" }}
    className={`perspective-1000 ${className}`}
  >
    {text.split(" ").map((word, i) => (
      <span key={i} className="inline-block overflow-hidden pb-5 mr-[0.22em]">
        <motion.span variants={textRevealItem} className="inline-block origin-bottom transform-gpu will-change-transform">
          {word}
        </motion.span>
      </span>
    ))}
  </motion.div>
);

// --- MARQUEE ---
const MarqueeTicker = ({ text }: { text: string }) => (
  <div className="relative w-full overflow-hidden whitespace-nowrap py-5 bg-black/60 border-y border-white/[0.08] backdrop-blur-3xl z-20">
    <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-[#020202] via-[#020202]/80 to-transparent z-10 pointer-events-none" />
    <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-[#020202] via-[#020202]/80 to-transparent z-10 pointer-events-none" />
    <motion.div
      animate={{ x: ["0%", "-50%"] }}
      transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
      className="inline-flex gap-10 text-[10px] font-mono tracking-[0.55em] text-zinc-400 uppercase transform-gpu will-change-transform"
    >
      {Array.from({ length: 10 }).map((_, i) => (
        <span key={i} className="flex items-center gap-7">
          <span className="text-zinc-500">✦</span>
          <span className="hover:text-white transition-colors duration-700">{text}</span>
        </span>
      ))}
    </motion.div>
  </div>
);

// --- PRODUCT CARD (3D + SPOTLIGHT + GLASS) ---
const ProductCard = ({
  product,
  openDropdownId,
  setOpenDropdownId,
  handleSizeClick,
  dropdownRef,
}: {
  product: Product;
  openDropdownId: number | null;
  setOpenDropdownId: (id: number | null) => void;
  handleSizeClick: (product: Product) => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const isOpen = openDropdownId === product.id;
  const hasDropdown = Boolean(product.allSizes && product.allSizes.length > 0);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 120, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 120, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    x.set(mx / rect.width - 0.5);
    y.set(my / rect.height - 0.5);
    setSpotlight({ x: (mx / rect.width) * 100, y: (my / rect.height) * 100 });
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 80, filter: "blur(12px)", scale: 0.94 },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          transition: { duration: 1.3, ease: cinematicEase },
        },
      }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative flex flex-col transform-gpu perspective-1000 h-full will-change-transform"
    >
      {/* Card shell */}
      <div className="relative w-full aspect-[3/4] mb-6 overflow-hidden bg-[#050505] border border-white/[0.08] group-hover:border-white/30 transition-all duration-700 rounded-[3px] shadow-[0_20px_60px_rgba(0,0,0,0.7)] group-hover:shadow-[0_30px_90px_rgba(0,0,0,0.9),0_0_50px_rgba(255,255,255,0.06)]">
        {/* Dynamic spotlight */}
        <div
          className="pointer-events-none absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(450px circle at ${spotlight.x}% ${spotlight.y}%, rgba(255,255,255,0.16), transparent 80%)`,
          }}
        />

        {/* Chrome edge reflection */}
        <div className="pointer-events-none absolute inset-0 z-10 opacity-0 group-hover:opacity-50 transition-opacity duration-700 bg-[linear-gradient(135deg,transparent_40%,rgba(255,255,255,0.1)_50%,transparent_60%)]" />

        {product.tag && (
          <span className="absolute top-3.5 left-3.5 z-30 px-3 py-1 bg-white/95 backdrop-blur-md text-[8px] font-black text-black tracking-[0.25em] uppercase shadow-[0_0_25px_rgba(255,255,255,0.4)]">
            {product.tag}
          </span>
        )}

        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover opacity-85 group-hover:opacity-100 group-hover:scale-[1.07] transition-all duration-[1400ms] ease-[0.16,1,0.3,1] transform-gpu will-change-transform"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-20 transition-opacity duration-1000" />
      </div>

      {/* Info layer */}
      <div className="flex flex-col flex-1 px-1 transform-gpu" style={{ transform: "translateZ(26px)" }}>
        <h5 className="font-bold text-[11px] sm:text-xs text-white mb-2.5 tracking-[0.22em] uppercase line-clamp-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          {product.name}
        </h5>

        <div className="relative mb-6 z-20" ref={isOpen ? dropdownRef : null}>
          <p className="text-[10px] text-zinc-400 tracking-widest font-mono flex items-center justify-between">
            <span>
              РАЗМЕР: <span className="text-zinc-200">{product.sizesDisplay}</span>
            </span>
            {hasDropdown && (
              <motion.button
                whileTap={{ scale: 0.85 }}
                type="button"
                onClick={() => handleSizeClick(product)}
                className="w-6 h-6 flex items-center justify-center border border-white/20 hover:border-white hover:bg-white text-zinc-400 hover:text-black transition-all duration-500 rounded-full"
              >
                +
              </motion.button>
            )}
          </p>

          <AnimatePresence>
            {hasDropdown && isOpen && product.allSizes && (
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.94, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 10, scale: 0.95, filter: "blur(8px)" }}
                transition={{ duration: 0.45, ease: cinematicEase }}
                className="hidden sm:block absolute left-0 top-full mt-3 w-full p-4 bg-[#0a0a0a]/98 border border-white/15 backdrop-blur-3xl z-30 shadow-[0_40px_80px_rgba(0,0,0,0.95)] rounded-sm"
              >
                <span className="text-[9px] text-zinc-500 uppercase block mb-3 tracking-[0.35em] border-b border-white/10 pb-2">
                  ВЫБЕРИТЕ РАЗМЕР
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {product.allSizes.map((size) => (
                    <span
                      key={size}
                      className="py-1.5 text-center border border-white/10 bg-black/60 text-zinc-300 text-[10px] hover:border-white hover:text-black hover:bg-white transition-all duration-300 cursor-pointer rounded-sm font-mono"
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
          <p className="text-white font-mono text-[10px] sm:text-[11px] font-bold tracking-[0.12em]">
            {product.priceUzs.toLocaleString('ru-RU')}
            <span className="select-none text-zinc-400 ml-1">сум</span>
          </p>
          <Link
            href={`/checkout?id=${product.id}&name=${encodeURIComponent(product.name)}&price=${encodeURIComponent(product.priceUzs.toString())}&img=${encodeURIComponent(product.imageUrl)}`}
            className="group/btn relative overflow-hidden bg-white text-black px-4 py-1.5 text-[9px] sm:text-[10px] tracking-[0.32em] font-black uppercase hover:bg-zinc-200 transition-colors duration-500 flex items-center gap-1 rounded-sm shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            <span className="relative z-10">КУПИТЬ</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default function Home() {
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [selectedProductForSheet, setSelectedProductForSheet] = useState<Product | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Global cinematic scroll
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20, restDelta: 0.0001 });

  // Hero transforms
  const heroY = useTransform(smoothProgress, [0, 0.18], ["0%", "35%"]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.14], [1, 0]);
  const heroScale = useTransform(smoothProgress, [0, 0.18], [1, 0.9]);
  const heroBlur = useTransform(smoothProgress, [0, 0.14], ["blur(0px)", "blur(20px)"]);

  // Lookbook 1
  const trailer2Ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: t2p } = useScroll({ target: trailer2Ref, offset: ["start end", "end start"] });
  const t2Scale = useTransform(t2p, [0, 0.45, 1], [0.85, 1, 0.95]);
  const t2Y = useTransform(t2p, [0, 1], ["-12%", "12%"]);
  const t2Opacity = useTransform(t2p, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);

  // Lookbook 2
  const trailer3Ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: t3p } = useScroll({ target: trailer3Ref, offset: ["start end", "end start"] });
  const t3ImgScale = useTransform(t3p, [0, 0.5, 1], [1.25, 1, 1.1]);
  const t3Y = useTransform(t3p, [0, 0.5, 1], [80, 0, -40]);

  // Final scene
  const finalRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: finalP } = useScroll({ target: finalRef, offset: ["start end", "end start"] });
  const finalScale = useTransform(finalP, [0, 0.5, 1], [0.92, 1, 1.04]);
  const finalOpacity = useTransform(finalP, [0, 0.3, 0.8], [0, 1, 1]);

  const categories: CategoryGroup[] = [
    {
      slug: "tshirts-hoodies",
      categoryName: "Футболки и Худи",
      products: [
        { id: 1, name: "Лонгслив", priceUzs: 200000, sizesDisplay: "XS, S, M, L", imageUrl: "/products/y2k-tee.jpg", tag: "ХИТ ДРОПА" },
        { id: 2, name: "Лонгслив Skeleton", priceUzs: 220000, sizesDisplay: "S, M, L, XL", imageUrl: "/products/skelet.jpg" },
        { id: 3, name: "Футболка", priceUzs: 140000, sizesDisplay: "S, M, L, XL", imageUrl: "/products/futbolka.jpg" },
        { id: 4, name: "Футболка", priceUzs: 80000, sizesDisplay: "XS, S, M, L", imageUrl: "/products/futbolochka.jpg" },
        { id: 5, name: "Лонгслив", priceUzs: 200000, sizesDisplay: "XS, S, M, L", imageUrl: "/products/hoodie.jpg" },
        { id: 6, name: "Футболка", priceUzs: 200000, sizesDisplay: "M, L, XL, 2XL", imageUrl: "/products/pahan.jpg", tag: "ЛИМИТКА" },
        { id: 22, name: "Футболка", priceUzs: 100000, sizesDisplay: "S, M, L, XL", imageUrl: "/products/8.jpg" },
        { id: 23, name: "Футболка", priceUzs: 100000, sizesDisplay: "S, M, L, XL", imageUrl: "/products/9.jpg" },
        { id: 24, name: "Футболка", priceUzs: 100000, sizesDisplay: "S, M, L, XL", imageUrl: "/products/10.jpg" },
        { id: 25, name: "Футболка", priceUzs: 100000, sizesDisplay: "S, M, L, XL", imageUrl: "/products/11.jpg" },
        { id: 26, name: "Футболка", priceUzs: 100000, sizesDisplay: "S, M, L, XL", imageUrl: "/products/12.jpg" },
        { id: 27, name: "Футболка", priceUzs: 100000, sizesDisplay: "S, M, L, XL", imageUrl: "/products/13.png" },
        { id: 28, name: "Футболка", priceUzs: 200000, sizesDisplay: "S, M, L, XL", imageUrl: "/products/14.jpg" },
        { id: 29, name: "Футболка", priceUzs: 120000, sizesDisplay: "S, M, L, XL", imageUrl: "/products/16.jpg" },
        { id: 30, name: "Футболка", priceUzs: 120000, sizesDisplay: "S, M, L, XL", imageUrl: "/products/17.jpg" },
        { id: 53, name: "Футболка", priceUzs: 150000, sizesDisplay: "S, M, L, XL", imageUrl: "/products/a.png" },
        { id: 54, name: "Футболка", priceUzs: 150000, sizesDisplay: "S, M, L, XL", imageUrl: "/products/40.png" },
        { id: 55, name: "Футболка", priceUzs: 150000, sizesDisplay: "S, M, L, XL", imageUrl: "/products/41.png" },
        { id: 56, name: "Футболка", priceUzs: 150000, sizesDisplay: "S, M, L, XL", imageUrl: "/products/42.png" },
        { id: 57, name: "Футболка", priceUzs: 150000, sizesDisplay: "S, M, L, XL", imageUrl: "/products/43.png" },
        { id: 58, name: "Футболка", priceUzs: 150000, sizesDisplay: "S, M, L, XL", imageUrl: "/products/44.png" },
      ],
    },
    {
      slug: "pants",
      categoryName: "Джинсы",
      products: [
        { id: 7, name: "Джинсы", priceUzs: 250000, sizesDisplay: "S - 2XL", imageUrl: "/products/jins.jpg", tag: "БЕСТСЕЛЛЕР" },
        { id: 8, name: "Джинсы", priceUzs: 250000, sizesDisplay: "S, M, L, XL", imageUrl: "/products/jinsik.jpg" },
        { id: 9, name: "Джинсы", priceUzs: 250000, sizesDisplay: "S, M, L, XL", imageUrl: "/products/1.jpg" },
        { id: 10, name: "Джинсы", priceUzs: 250000, sizesDisplay: "S, M, L, XL", imageUrl: "/products/2.jpg" },
        { id: 11, name: "Джинсы", priceUzs: 250000, sizesDisplay: "S, M, L, XL", imageUrl: "/products/3.jpg" },
        { id: 12, name: "Джинсы", priceUzs: 250000, sizesDisplay: "S, M, L, XL", imageUrl: "/products/4.jpg" },
        { id: 13, name: "Джинсы", priceUzs: 250000, sizesDisplay: "S, M, L, XL", imageUrl: "/products/5.jpg" },
        { id: 14, name: "Джинсы", priceUzs: 250000, sizesDisplay: "S, M, L, XL", imageUrl: "/products/6.jpg" },
        { id: 15, name: "Джинсы", priceUzs: 250000, sizesDisplay: "S, M, L, XL", imageUrl: "/products/7.jpg" },
        { id: 31, name: "Джинсы", priceUzs: 200000, sizesDisplay: "S, M, L, XL", imageUrl: "/products/18.jpg" },
      ],
    },
    {
      slug: "shorts",
      categoryName: "Шорты",
      products: [
        { id: 32, name: "Шорты", priceUzs: 130000, sizesDisplay: "S, M, L, XL", imageUrl: "/products/19.jpg" },
      ],
    },
    {
      slug: "sets",
      categoryName: "Сеты",
      products: [
        { id: 33, name: "Сет", priceUzs: 130000, sizesDisplay: "S, M, L, XL", imageUrl: "/products/15.jpg" },
      ],
    },
    {
      slug: "footwear",
      categoryName: "Обувь",
      products: [
        { id: 16, name: "Кроссовки", priceUzs: 500000, sizesDisplay: "35 – 46", allSizes: ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"], imageUrl: "/products/shmot.jpg", tag: "NEW TECH" },
        { id: 17, name: "Кроссовки", priceUzs: 500000, sizesDisplay: "35 – 46", allSizes: ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"], imageUrl: "/products/shmoti.jpg" },
      ],
    },
    {
      slug: "backpacks-bags",
      categoryName: "Рюкзаки и Сумки",
      products: [
        { id: 18, name: "Рюкзак", priceUzs: 250000, sizesDisplay: "Единый размер", imageUrl: "/products/rukzak.jpg" },
        { id: 34, name: "Рюкзак", priceUzs: 250000, sizesDisplay: "Единый размер", imageUrl: "/products/20.png" },
        { id: 35, name: "Рюкзак", priceUzs: 250000, sizesDisplay: "Единый размер", imageUrl: "/products/21.png" },
        { id: 36, name: "Рюкзак", priceUzs: 250000, sizesDisplay: "Единый размер", imageUrl: "/products/22.png" },
        { id: 37, name: "Рюкзак", priceUzs: 250000, sizesDisplay: "Единый размер", imageUrl: "/products/23.png" },
        { id: 38, name: "Рюкзак", priceUzs: 250000, sizesDisplay: "Единый размер", imageUrl: "/products/24.png" },
        { id: 39, name: "Рюкзак", priceUzs: 250000, sizesDisplay: "Единый размер", imageUrl: "/products/25.png" },
        { id: 40, name: "Рюкзак", priceUzs: 250000, sizesDisplay: "Единый размер", imageUrl: "/products/26.png" },
        { id: 41, name: "Рюкзак", priceUzs: 250000, sizesDisplay: "Единый размер", imageUrl: "/products/27.png" },
        { id: 42, name: "Рюкзак", priceUzs: 250000, sizesDisplay: "Единый размер", imageUrl: "/products/28.png" },
        { id: 43, name: "Рюкзак", priceUzs: 250000, sizesDisplay: "Единый размер", imageUrl: "/products/29.png" },
        { id: 44, name: "Рюкзак", priceUzs: 250000, sizesDisplay: "Единый размер", imageUrl: "/products/30.png" },
      ],
    },
    {
      slug: "accessories",
      categoryName: "Аксессуары",
      products: [
        { id: 19, name: "Корона", priceUzs: 30000, sizesDisplay: "Единый размер", imageUrl: "/products/korona.jpg" },
        { id: 20, name: "MP3 Плеер", priceUzs: 130000, sizesDisplay: "Единый размер", imageUrl: "/products/mp3.jpg" },
        { id: 21, name: "Наушники", priceUzs: 80000, sizesDisplay: "Единый размер", imageUrl: "/products/naushi.jpg" },
        { id: 45, name: "Аксессуар", priceUzs: 120000, sizesDisplay: "Единый размер", imageUrl: "/products/31.png" },
        { id: 46, name: "Аксессуар", priceUzs: 120000, sizesDisplay: "Единый размер", imageUrl: "/products/32.png" },
        { id: 47, name: "Аксессуар", priceUzs: 120000, sizesDisplay: "Единый размер", imageUrl: "/products/33.png" },
        { id: 48, name: "Аксессуар", priceUzs: 120000, sizesDisplay: "Единый размер", imageUrl: "/products/34.png" },
        { id: 49, name: "Аксессуар", priceUzs: 120000, sizesDisplay: "Единый размер", imageUrl: "/products/35.png" },
        { id: 50, name: "Аксессуар", priceUzs: 120000, sizesDisplay: "Единый размер", imageUrl: "/products/36.png" },
        { id: 51, name: "Аксессуар", priceUzs: 120000, sizesDisplay: "Единый размер", imageUrl: "/products/37.jpg" },
        { id: 52, name: "Аксессуар", priceUzs: 120000, sizesDisplay: "Единый размер", imageUrl: "/products/38.jpg" },
      ],
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 450);
    const handleClickOutside = (e: globalThis.MouseEvent) => {
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
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - 90;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1200;
    let start: number | null = null;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const t = Math.min(progress / duration, 1);
      const ease = t === 1 ? 1 : t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      window.scrollTo(0, startPosition + distance * ease);
      if (progress < duration) window.requestAnimationFrame(step);
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
    <ReactLenis
      root
      options={{
        lerp: 0.04,
        smoothWheel: true,
        touchMultiplier: 1.5,
        wheelMultiplier: 0.9,
      }}
    >
      <main className="min-h-screen bg-[#020202] text-zinc-100 font-mono relative selection:bg-white selection:text-black overflow-x-hidden">
        {/* PRELOADER */}
        <AnimatePresence>
          {!isLoaded && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, filter: "blur(20px)" }}
              transition={{ duration: 1.6, ease: cinematicEase }}
              className="fixed inset-0 z-[100] bg-[#010101] flex flex-col items-center justify-center gap-8"
            >
              <motion.div
                initial={{ scale: 0.7, opacity: 0, filter: "blur(12px)" }}
                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.2, ease: cinematicEase }}
                className="text-3xl sm:text-4xl font-black tracking-[0.6em] uppercase text-white"
              >
                Y2K STUDIO
              </motion.div>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.4, delay: 0.3, ease: cinematicEase }}
                className="w-32 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent origin-center"
              />
              <span className="text-[9px] tracking-[0.7em] text-zinc-500 uppercase">
                ЗАГРУЗКА КОЛЛЕКЦИИ
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FILM GRAIN */}
        <div className="fixed inset-0 pointer-events-none z-40 opacity-[0.05] mix-blend-screen">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <filter id="noiseFilter">
              <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="4" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
          </svg>
        </div>

        {/* CINEMATIC VIGNETTE */}
        <div className="fixed inset-0 pointer-events-none z-30 bg-[radial-gradient(ellipse_at_center,transparent_5%,#000000_125%)]" />

        {/* ═══ HERO SECTION ═══ */}
        <section className="relative h-screen flex flex-col justify-center items-center overflow-hidden bg-[#020202]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] h-[95vw] max-w-[1100px] max-h-[1100px] bg-gradient-to-tr from-zinc-900/40 via-zinc-800/10 to-transparent rounded-full blur-[180px] animate-[pulse_10s_ease-in-out_infinite] transform-gpu will-change-transform" />
          
          <motion.div
            style={{ y: heroY, opacity: heroOpacity, scale: heroScale, filter: heroBlur }}
            className="relative z-10 text-center px-5 w-full max-w-7xl mx-auto flex flex-col items-center transform-gpu will-change-transform"
          >
            <motion.div
              initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.9, delay: 0.6, ease: cinematicEase }}
              className="mb-10"
            >
              <span className="inline-flex items-center gap-3.5 px-7 py-2.5 border border-white/12 rounded-full text-[10px] sm:text-[11px] text-zinc-400 tracking-[0.55em] uppercase backdrop-blur-2xl bg-white/[0.03] shadow-[0_0_40px_rgba(255,255,255,0.04)]">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                Y2K
              </span>
            </motion.div>

            <CinematicText
              text="Y2K STORE"
              className="text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black tracking-tighter text-white uppercase drop-shadow-[0_0_100px_rgba(255,255,255,0.1)] leading-[0.9]"
            />

            <motion.p
              initial={{ opacity: 0, filter: "blur(12px)", y: 30 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{ duration: 2.1, delay: 1.7, ease: cinematicEase }}
              className="mt-10 text-zinc-400 max-w-xl mx-auto text-xs sm:text-sm tracking-[0.28em] font-sans font-light leading-relaxed"
            >
              НОВАЯ КОЛЛЕКЦИЯ УЖЕ В ПРОДАЖЕ.
              <br className="sm:hidden" />
              <span className="text-zinc-500"> ЛИСТАЙТЕ ВНИЗ ДЛЯ ПРОСМОТРА.</span>
            </motion.p>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.2, delay: 2.8 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10"
          >
            <span className="text-[9px] uppercase tracking-[0.5em] text-zinc-500 font-bold">ИССЛЕДОВАТЬ</span>
            <div className="w-[1px] h-14 bg-white/10 overflow-hidden relative">
              <motion.div
                animate={{ y: ["-100%", "100%"] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
                className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-white to-transparent opacity-90"
              />
            </div>
          </motion.div>
        </section>

        <MarqueeTicker text="Y2K STREETWEAR ✦ БУНТАРСКИЙ ДУХ ✦ НОВАЯ КОЛЛЕКЦИЯ 2026 ✦ УНИКАЛЬНЫЙ ДРОП" />

        {/* ═══ LOOKBOOK 01 ═══ */}
        <section ref={trailer2Ref} className="relative py-36 px-5 sm:px-12 max-w-7xl mx-auto my-16 overflow-hidden">
          <motion.div
            style={{ scale: t2Scale, opacity: t2Opacity }}
            className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-[#040404] min-h-[640px] flex flex-col justify-end p-8 sm:p-20 shadow-[0_50px_120px_rgba(0,0,0,0.85)] transform-gpu will-change-transform"
          >
            <motion.div style={{ y: t2Y }} className="absolute inset-0 z-0 opacity-45 mix-blend-luminosity scale-110">
              <Image src="/products/pahan.jpg" alt="Lookbook" fill className="object-cover" priority={false} />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent z-10" />

            <motion.div
              initial={{ opacity: 0, y: 60, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: 1.4, ease: cinematicEase }}
              className="relative z-20 max-w-2xl"
            >
              <span className="inline-block px-3.5 py-1.5 bg-white/10 border border-white/20 text-white text-[10px] tracking-[0.35em] font-bold uppercase mb-7 rounded-sm">
                ПОСЛЕДНИЙ ДРОП
              </span>
              <h2 className="text-4xl sm:text-7xl font-black uppercase text-white tracking-tighter leading-[0.95] mb-7 drop-shadow-2xl">
                Y2K
                <br />
                <span className="text-zinc-500">ЛУКБУК // 2026</span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 tracking-[0.22em] font-sans font-light mb-12 leading-relaxed max-w-lg">
                Эксклюзивные оверсайз фасоны в эстетике нулевых. Плотные ткани, качественный крой и уникальный дизайн.
              </p>
              <button
                onClick={scrollToCatalog}
                className="px-12 py-5 bg-white text-black font-black text-[11px] uppercase tracking-[0.45em] rounded-sm hover:bg-zinc-200 transition-all duration-600 active:scale-[0.97] transform-gpu shadow-2xl"
              >
                СМОТРЕТЬ ЛУКБУК →
              </button>
            </motion.div>

            <div className="absolute top-10 right-10 z-20 hidden sm:flex flex-col items-end text-[9px] text-zinc-500 tracking-[0.4em] font-bold gap-1">
              <span>АРТИКУЛ: Y2K-001</span>
              <span>СТАТУС: В НАЛИЧИИ</span>
            </div>
          </motion.div>
        </section>

        {/* ═══ LOOKBOOK 02 ═══ */}
        <section ref={trailer3Ref} className="relative py-28 px-5 sm:px-12 max-w-7xl mx-auto my-16 border-y border-white/[0.06] bg-[#020202]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20 items-center">
            <motion.div
              style={{ y: t3Y }}
              initial={{ opacity: 0, x: -80, filter: "blur(12px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1.6, ease: cinematicEase }}
              className="relative w-full aspect-square rounded-2xl overflow-hidden border border-white/10 bg-[#050505] group shadow-[0_40px_100px_rgba(0,0,0,0.7)]"
            >
              <motion.div style={{ scale: t3ImgScale }} className="relative w-full h-full will-change-transform">
                <Image
                  src="/products/shmot.jpg"
                  alt="Sneakers Highlight"
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-1200"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-10 left-10 z-10">
                <span className="text-[10px] text-white tracking-[0.55em] uppercase font-black block mb-2">
                  СВЕЖИЙ РЕЛИЗ
                </span>
                <h4 className="text-2xl font-black text-zinc-300 uppercase tracking-widest drop-shadow-lg">
                  МАССИВНЫЕ СИЛУЭТЫ
                </h4>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 80, filter: "blur(12px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1.6, ease: cinematicEase }}
              className="flex flex-col justify-center"
            >
              <span className="text-[10px] text-zinc-500 tracking-[0.55em] font-bold uppercase mb-5">
                ОБУВЬ & АКСЕССУАРЫ
              </span>
              <h3 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-white mb-9 leading-[1.05]">
                НОВЫЙ ВЗГЛЯД НА
                <br />
                <span className="text-zinc-500">УЛИЧНЫЙ СТИЛЬ</span>
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 tracking-[0.22em] font-sans font-light leading-relaxed mb-12">
                Каждый элемент проработан до мелочей. Премиальные материалы, агрессивные подошвы и подлинный дух 2000-х в каждой паре.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-12">
                <div className="p-5 border border-white/10 bg-white/[0.025] rounded-lg backdrop-blur-sm">
                  <span className="block text-[9px] text-zinc-500 uppercase tracking-widest mb-2 font-bold">РАЗМЕРНЫЙ РЯД</span>
                  <span className="text-sm font-bold text-white tracking-widest">35 — 46 EU</span>
                </div>
                <div className="p-5 border border-white/10 bg-white/[0.025] rounded-lg backdrop-blur-sm">
                  <span className="block text-[9px] text-zinc-500 uppercase tracking-widest mb-2 font-bold">НАЛИЧИЕ</span>
                  <span className="text-sm font-bold text-white tracking-widest">ДОСТУПНО</span>
                </div>
              </div>

              <button
                onClick={scrollToCatalog}
                className="w-full sm:w-auto px-12 py-5 border border-white/20 hover:border-white text-white font-bold text-[11px] uppercase tracking-[0.45em] transition-all duration-600 rounded-sm text-center hover:bg-white hover:text-black"
              >
                СМОТРЕТЬ ОБУВЬ →
              </button>
            </motion.div>
          </div>
        </section>

        {/* ═══ CATALOG ═══ */}
        <div className="relative z-10 bg-[#010101] border-t border-white/10 pb-40 shadow-[0_-80px_120px_rgba(0,0,0,0.9)]">
          <motion.header
            initial={{ y: -40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.3, ease: cinematicEase }}
            className="flex justify-between items-center backdrop-blur-3xl bg-black/75 border-b border-white/10 px-6 py-5 sm:px-12 sm:py-6 sticky top-0 z-40"
          >
            <h1 className="text-base sm:text-2xl font-black tracking-[0.45em] text-white uppercase drop-shadow-[0_0_25px_rgba(255,255,255,0.25)]">
              Y2K
            </h1>
            <div className="flex items-center gap-7">
              <a
                href="https://t.me/y2kstore"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center p-2.5 rounded-full border border-white/10 hover:border-white transition-all duration-500 bg-white/[0.03]"
              >
                <svg className="w-4 h-4 fill-zinc-400 group-hover:fill-white transition-colors duration-500" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-2.02 9.52c-.15.68-.56.84-1.13.52l-3.1-2.28-1.5 1.44c-.17.17-.31.31-.63.31l.22-3.17 5.77-5.21c.25-.22-.05-.34-.39-.12l-7.13 4.49-3.08-.96c-.67-.21-.68-.67.14-.99l12.03-4.64c.56-.2 1.05.14.82 1.09z" />
                </svg>
              </a>
              <button
                onClick={scrollToCatalog}
                className="text-[10px] sm:text-xs tracking-[0.35em] font-bold uppercase text-zinc-400 hover:text-white transition-colors duration-500"
              >
                КАТАЛОГ
              </button>
            </div>
          </motion.header>

          <div id="catalog" className="max-w-7xl mx-auto px-5 sm:px-12 pt-24 sm:pt-32 scroll-mt-24">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: cinematicEase }}
              className="flex items-center justify-between mb-24 pb-7 border-b border-white/10"
            >
              <h3 className="text-xs sm:text-lg font-black tracking-[0.45em] text-white uppercase flex items-center gap-4">
                КАТАЛОГ <span className="text-zinc-700 font-light">/</span>
                <span className="text-zinc-400">{totalProducts} ТОВАРОВ</span>
              </h3>
            </motion.div>

            {categories.map((category) => (
              <motion.section key={category.categoryName} className="mb-36">
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-8%" }}
                  transition={{ duration: 1.15, ease: cinematicEase }}
                  className="flex items-center justify-between mb-14"
                >
                  <div className="flex items-center gap-7 text-sm sm:text-xl font-black tracking-[0.4em] text-zinc-200 uppercase w-full">
                    <span>{category.categoryName}</span>
                    <div className="flex-1 h-[1px] bg-gradient-to-r from-zinc-500/35 to-transparent" />
                  </div>
                </motion.div>

                <motion.div
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-8%" }}
                  variants={{
                    hidden: { opacity: 0 },
                    show: { opacity: 1, transition: { staggerChildren: 0.13 } },
                  }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-10"
                >
                  {category.products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      openDropdownId={openDropdownId}
                      setOpenDropdownId={setOpenDropdownId}
                      handleSizeClick={handleSizeClick}
                      dropdownRef={dropdownRef}
                    />
                  ))}
                </motion.div>
              </motion.section>
            ))}
          </div>
        </div>

        {/* ═══ FINAL SCENE ═══ */}
        <section ref={finalRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#010101]">
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[80vh] bg-gradient-to-b from-zinc-900/20 via-zinc-800/10 to-transparent rounded-full blur-[160px] transform-gpu" />
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black to-transparent" />
          </div>

          <motion.div
            style={{ scale: finalScale, opacity: finalOpacity }}
            className="relative z-10 text-center px-6 max-w-4xl mx-auto transform-gpu will-change-transform"
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: cinematicEase }}
              className="mb-8"
            >
              <span className="inline-block px-5 py-2 border border-white/15 rounded-full text-[10px] tracking-[0.5em] text-zinc-400 uppercase backdrop-blur-xl bg-white/[0.03]">
                Y2K STUDIO
              </span>
            </motion.div>

            <CinematicText
              text="ВЫБИРАЙ СТИЛЬ"
              className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-white uppercase leading-[0.95] mb-8"
            />

            <motion.p
              initial={{ opacity: 0, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, delay: 0.4, ease: cinematicEase }}
              className="text-zinc-400 text-xs sm:text-sm tracking-[0.3em] font-sans font-light mb-14 max-w-lg mx-auto leading-relaxed"
            >
              Ограниченный тираж. Уникальный дизайн. Стань частью поколения, выбирающего качество и комфорт.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, delay: 0.6, ease: cinematicEase }}
              className="flex flex-col sm:flex-row items-center justify-center gap-5"
            >
              <button
                onClick={scrollToCatalog}
                className="px-14 py-5 bg-white text-black font-black text-[12px] uppercase tracking-[0.4em] rounded-sm hover:bg-zinc-200 transition-all duration-600 shadow-[0_0_50px_rgba(255,255,255,0.2)] active:scale-[0.97]"
              >
                ПЕРЕЙТИ К ПОКУПКАМ
              </button>
              <a
                href="https://t.me/y2kstore"
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-5 border border-white/25 text-white font-bold text-[11px] uppercase tracking-[0.35em] rounded-sm hover:border-white hover:bg-white/5 transition-all duration-600"
              >
                TELEGRAM
              </a>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, delay: 1.2 }}
              className="mt-20 text-[9px] tracking-[0.6em] text-zinc-600 uppercase"
            >
              Y2K STUDIO © 2026 — ALL RIGHTS RESERVED
            </motion.p>
          </motion.div>
        </section>

        {/* MOBILE SIZE SHEET */}
        <AnimatePresence>
          {selectedProductForSheet && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: cinematicEase }}
                onClick={() => setSelectedProductForSheet(null)}
                className="fixed inset-0 bg-black/92 backdrop-blur-2xl z-50 sm:hidden"
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={springSoft}
                className="fixed bottom-0 left-0 right-0 p-8 bg-[#080808] border-t border-white/20 z-50 sm:hidden flex flex-col rounded-t-3xl shadow-[0_-40px_80px_rgba(0,0,0,1)]"
              >
                <div className="w-12 h-1 bg-zinc-700 rounded-full mx-auto mb-8" />
                <div className="flex justify-between items-start mb-8">
                  <h4 className="text-base font-black text-white uppercase tracking-[0.2em] pr-4 leading-relaxed drop-shadow-md">
                    {selectedProductForSheet.name}
                  </h4>
                  <button
                    onClick={() => setSelectedProductForSheet(null)}
                    className="text-zinc-500 hover:text-white p-2 bg-white/5 rounded-full"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-[10px] text-zinc-400 font-bold tracking-[0.3em] uppercase mb-5 border-b border-white/10 pb-3">
                  ВЫБЕРИТЕ РАЗМЕР
                </p>
                <div className="grid grid-cols-3 gap-3 mb-8">
                  {selectedProductForSheet.allSizes?.map((size) => (
                    <span
                      key={size}
                      className="py-4 text-center border border-white/10 bg-black text-zinc-300 text-xs font-bold font-mono active:bg-white active:text-black transition-colors rounded-xl shadow-lg"
                    >
                      {size}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setSelectedProductForSheet(null)}
                  className="w-full py-5 bg-white text-black font-black text-[11px] uppercase tracking-[0.4em] rounded-xl active:scale-95 transition-transform"
                >
                  ЗАКРЫТЬ
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* MOBILE FLOATING NAV */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 sm:hidden w-[88%] max-w-xs">
          <div className="bg-[#050505]/85 backdrop-blur-3xl border border-white/12 rounded-full py-4 px-8 flex justify-between items-center text-white shadow-[0_25px_60px_rgba(0,0,0,0.85)]">
            <button
              onClick={() => scrollToCatalog()}
              className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-300 hover:text-white"
            >
              КАТАЛОГ
            </button>
            <div className="w-[1px] h-4 bg-white/20" />
            <a
              href="https://t.me/y2kstore"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-300 hover:text-white"
            >
              TELEGRAM
            </a>
          </div>
        </div>
      </main>
    </ReactLenis>
  );
}