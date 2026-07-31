"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const CARD_NUMBER = "5614 6814 2082 8182";

const TASHKENT_DISTRICTS = [
  "Алмазарский",
  "Бектемирский",
  "Мирабадский",
  "Мирзо-Улугбекский",
  "Сергелийский",
  "Янгихаётский",
  "Учтепинский",
  "Чиланзарский",
  "Шайхантахурский",
  "Юнусабадский",
  "Яккасарайский",
  "Яшнабадский",
  "Таш. область (Пригород)",
];

const cinematicEase = [0.16, 1, 0.3, 1] as const;

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3, ease: cinematicEase },
  },
};

const fadeUpBlur = {
  hidden: { opacity: 0, y: 40, filter: "blur(12px)", scale: 0.98 },
  show: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)", 
    scale: 1,
    transition: { duration: 1.4, ease: cinematicEase } 
  },
};

function FilmNoise() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[100] opacity-[0.04] mix-blend-overlay"
      style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
      }} 
    />
  );
}

function StarField() {
  const stars = useRef(
    Array.from({ length: 60 }).map(() => ({
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
      size: Math.random() * 2.5 + 0.5,
      duration: Math.random() * 2 + 1.2,
      delay: Math.random() * 2,
      glow: Math.random() > 0.5 ? "rgba(255, 255, 255, 0.8)" : "rgba(167, 139, 250, 0.6)",
    }))
  ).current;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-black">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-indigo-900/10 blur-[120px] rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[30vw] bg-cyan-900/10 blur-[80px] rounded-full" />
      
      {stars.map((star, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: star.size,
            height: star.size,
            left: `50%`,
            top: `50%`,
            backgroundColor: "#fff",
            boxShadow: `0 0 ${star.size * 4}px ${star.size}px ${star.glow}`,
          }}
          initial={{ x: star.x * 5, y: star.y * 5, scale: 0, opacity: 0 }}
          animate={{
            x: star.x * 140,
            y: star.y * 140,
            scale: [0, 1.5, 3],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: "easeIn",
            delay: star.delay,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)]" />
    </div>
  );
}

function CinematicSelect({ label, options, value, onChange }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full group" ref={dropdownRef}>
      {label && <label className="block text-[10px] text-zinc-500 mb-2 font-bold tracking-[0.15em] uppercase group-focus-within:text-indigo-400 transition-colors duration-500">{label}</label>}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full bg-zinc-950/40 backdrop-blur-2xl border px-4 py-4 text-sm text-left transition-all duration-500 flex items-center justify-between relative overflow-hidden ${
          isOpen 
            ? "border-indigo-500/50 text-white shadow-[0_0_30px_-5px_rgba(99,102,241,0.2)]" 
            : "border-white/10 text-zinc-300 hover:border-white/30 hover:bg-white/[0.02]"
        }`}
      >
        <span className="truncate relative z-10">{value} район</span>
        <span className={`text-zinc-500 text-xs transition-transform duration-500 relative z-10 ${isOpen ? "rotate-180" : "rotate-0"}`}>▼</span>
        
        <div className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500 transition-all duration-500 ${isOpen ? "w-full opacity-100" : "w-0 opacity-0"}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, filter: "blur(10px)", scale: 0.98 }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
            exit={{ opacity: 0, y: 10, filter: "blur(5px)", scale: 0.98 }}
            transition={{ duration: 0.4, ease: cinematicEase }}
            className="absolute left-0 right-0 top-[110%] z-50 bg-black/80 backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden rounded-xl"
          >
            <div className="max-h-60 overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {options.map((option: string) => {
                const isSelected = option === value;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => { onChange(option); setIsOpen(false); }}
                    className={`w-full text-left px-4 py-3 text-sm transition-all duration-300 flex items-center justify-between rounded-lg ${
                      isSelected 
                        ? "bg-gradient-to-r from-indigo-500/20 to-transparent text-white font-medium border-l-2 border-indigo-500" 
                        : "text-zinc-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent hover:border-white/20"
                    }`}
                  >
                    <span>{option} район</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CinematicField({ label, value, onChange, placeholder, type = "text", required = false, disabled = false }: any) {
  return (
    <label className="block group relative">
      <span className="block text-[10px] text-zinc-500 mb-2 font-bold tracking-[0.15em] uppercase group-focus-within:text-cyan-400 transition-colors duration-500">
        {label}
      </span>
      <div className="relative overflow-hidden rounded-none">
        <input
          type={type}
          required={required}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-zinc-950/40 backdrop-blur-2xl border border-white/10 px-4 py-4 text-sm text-white placeholder:text-zinc-700 outline-none transition-all duration-500 focus:bg-white/[0.03] ${
            disabled ? "opacity-50 cursor-not-allowed" : "focus:border-white/30"
          }`}
        />
        {!disabled && (
          <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 group-focus-within:w-full transition-all duration-700 ease-out" />
        )}
      </div>
    </label>
  );
}

function CheckoutContent() {
  const params = useSearchParams();
  const productName = params.get("name") || "Товар из Y2K Store";
  const productPriceRaw = params.get("price") || "0 UZS";
  const productSizesRaw = params.get("sizes") || "XS, S, M, L";
  const productImg = params.get("img") || "/products/y2k-tee.jpg";
  const numericPrice = productPriceRaw.replace(" UZS", "");
  const availableSizes = productSizesRaw.split(",").map((s) => s.trim()).filter(Boolean);

  const [selectedSize, setSelectedSize] = useState<string>(availableSizes[0] || "M");
  const [step, setStep] = useState<"promo" | "form" | "processing" | "success">("promo");
  const [copiedField, setCopiedField] = useState<"card" | "price" | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    fullName: "", phone: "+998 ", email: "", district: TASHKENT_DISTRICTS[0], street: "", house: "", apartment: "", landmark: "",
  });

  useEffect(() => {
    if (step === "promo") {
      const timer = setTimeout(() => setStep("form"), 3200);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleChange = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleCopy = (text: string, type: "card" | "price") => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(type);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setReceiptFile(e.target.files[0]);
  };

  // --- ИСПРАВЛЕННАЯ ЛОГИКА ОТПРАВКИ ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!receiptFile) {
      alert("⚠️ Пожалуйста, прикрепите скриншот чека об оплате.");
      return;
    }

    setStep("processing");

    const BOT_TOKEN = "8888538637:AAGu1hLNqbGMDXxeHQOMuiL79QhbPQlLsZA"; 
    const CHAT_ID = "6613038560";

    const orderDetails = `
🔥 НОВЫЙ ЗАКАЗ (Y2K STORE) 🔥

🛍 Товар: ${productName}
📏 Размер: ${selectedSize}
💰 Цена: ${numericPrice} UZS

👤 Клиент: ${form.fullName}
📞 Телефон: ${form.phone}
✉️ Email: ${form.email}

📍 Адрес доставки:
Город: Ташкент
Район: ${form.district}
Улица: ${form.street}
Дом: ${form.house} ${form.apartment ? `, Кв/Офис: ${form.apartment}` : ""}
Ориентир: ${form.landmark || "Нет ориентира"}
    `;

    try {
      // 1. ОТПРАВЛЯЕМ ФОТО ТОВАРА (превращаем productImg в файл для localhost) + ТЕКСТ
      let productSent = false;
      try {
        const imgResponse = await fetch(productImg);
        const imgBlob = await imgResponse.blob();
        
        const productFormData = new FormData();
        productFormData.append("chat_id", CHAT_ID);
        productFormData.append("photo", imgBlob, "product.jpg"); 
        productFormData.append("caption", orderDetails);

        const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
          method: "POST",
          body: productFormData,
        });
        if (res.ok) productSent = true;
      } catch (e) {
        console.warn("Не удалось отправить картинку товара, отправляем текст:", e);
      }

      // Если картинка почему-то не загрузилась, бот просто отправит текст заказа
      if (!productSent) {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: CHAT_ID, text: orderDetails }),
        });
      }

      // 2. ОТПРАВЛЯЕМ СКРИНШОТ ЧЕКА
      const receiptFormData = new FormData();
      receiptFormData.append("chat_id", CHAT_ID);
      receiptFormData.append("photo", receiptFile);
      receiptFormData.append("caption", `🧾 Скриншот чека об оплате от: ${form.fullName}`);

      const receiptRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: "POST",
        body: receiptFormData, 
      });

      if (receiptRes.ok) {
        setStep("success");
      } else {
        throw new Error("Ошибка при отправке чека");
      }
    } catch (err) {
      console.error(err);
      alert("Ошибка отправки заказа. Проверьте подключение и токен Telegram бота.");
      setStep("form"); 
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-200 font-sans relative overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      
      <StarField />
      <FilmNoise />

      <AnimatePresence mode="wait">
        {step === "promo" && (
          <motion.div
            key="promo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 1.5, ease: cinematicEase }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
          >
            <motion.div
              initial={{ scale: 1.1, filter: "blur(10px)" }}
              animate={{ scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 3, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <motion.p 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.3, duration: 1.5, ease: cinematicEase }}
                className="text-zinc-600 tracking-[0.6em] text-[10px] uppercase mb-4 font-mono font-bold"
              >
                A Y2K Store Production
              </motion.p>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  textShadow: [
                    "0px 0px 0px rgba(255,0,0,0), 0px 0px 0px rgba(0,255,255,0)",
                    "4px 0px 15px rgba(255,0,0,0.8), -4px 0px 15px rgba(0,255,255,0.8)",
                    "0px 0px 30px rgba(255,255,255,0.4), 0px 0px 30px rgba(255,255,255,0.4)"
                  ]
                }} 
                transition={{ delay: 0.8, duration: 2, ease: cinematicEase }}
                className="text-4xl sm:text-6xl text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 font-light tracking-[0.3em] uppercase text-center leading-tight"
              >
                Оформление<br/>Заказа
              </motion.h1>
            </motion.div>
          </motion.div>
        )}

        {(step === "form" || step === "processing") && (
          <motion.div
            key="checkout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(15px)" }}
            transition={{ duration: 1.5 }}
            className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-16 min-h-screen flex flex-col"
          >
            <motion.header 
              initial={{ opacity: 0, y: -30, filter: "blur(10px)" }} 
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} 
              transition={{ duration: 1.5, ease: cinematicEase, delay: 0.2 }}
              className="mb-12 flex items-center justify-between border-b border-white/5 pb-8"
            >
              <Link href="/" className="group flex items-center gap-4 text-xs text-zinc-500 hover:text-white transition-colors duration-700">
                <div className="w-8 h-[1px] bg-zinc-700 group-hover:bg-white group-hover:w-16 transition-all duration-700 ease-out" />
                <span className="uppercase tracking-[0.2em] font-bold font-mono">Вернуться</span>
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]" />
                <span className="text-[10px] font-bold font-mono tracking-[0.2em] text-zinc-500 uppercase">Secure Connection</span>
              </div>
            </motion.header>

            <motion.form variants={staggerContainer} initial="hidden" animate="show" onSubmit={handleSubmit} className="flex flex-col xl:flex-row gap-12 xl:gap-20 flex-grow">
              
              <motion.div variants={fadeUpBlur} className="w-full xl:w-5/12">
                <div className="xl:sticky xl:top-12 bg-black/40 backdrop-blur-3xl p-8 sm:p-10 border border-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative overflow-hidden group">
                  <div className="absolute -top-32 -right-32 w-64 h-64 bg-white/5 blur-[100px] rounded-full pointer-events-none transition-all duration-1000 group-hover:bg-white/10" />
                  
                  <h2 className="text-[10px] font-bold tracking-[0.2em] mb-8 text-zinc-500 uppercase">Детали заказа</h2>
                  
                  <div className="relative w-full aspect-[3/4] mb-8 overflow-hidden bg-black/50 border border-white/5 group-hover:border-white/10 transition-colors duration-500">
                    <Image src={productImg} alt={productName} fill sizes="(max-width: 1280px) 100vw, 50vw" className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                  </div>

                  <h3 className="text-xl font-light mb-8 text-white tracking-wide">{productName}</h3>

                  <div className="mb-10">
                    <span className="block text-[10px] text-zinc-500 mb-4 font-bold uppercase tracking-[0.2em]">Выбранный размер</span>
                    <div className="grid grid-cols-4 gap-3">
                      {availableSizes.map((size) => (
                        <button
                          key={size} type="button" onClick={() => setSelectedSize(size)}
                          className={`py-3.5 text-xs font-mono transition-all duration-500 relative overflow-hidden ${
                            selectedSize === size 
                              ? "text-black font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)]" 
                              : "bg-transparent text-zinc-400 border border-white/10 hover:border-white/30 hover:text-white"
                          }`}
                        >
                          {selectedSize === size && (
                            <motion.div layoutId="activeSize" className="absolute inset-0 bg-white" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                          )}
                          <span className="relative z-10">{size}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8 border-t border-white/5 space-y-4 text-sm text-zinc-400">
                    <div className="flex justify-between items-center">
                      <span className="tracking-wide">Доставка (Ташкент)</span>
                      <span className="text-emerald-400 font-mono text-xs tracking-wider">БЕСПЛАТНО</span>
                    </div>
                    <div className="flex justify-between items-end pt-6 border-t border-white/5">
                      <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">Итого к оплате</span>
                      <span className="text-3xl font-light tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                        {numericPrice} <span className="text-sm text-zinc-500 font-mono ml-1">UZS</span>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="w-full xl:w-7/12 space-y-16 pb-20">
                
                <motion.fieldset variants={fadeUpBlur} className="space-y-6">
                  <legend className="text-xs text-white font-light tracking-[0.3em] uppercase border-b border-white/10 pb-6 w-full flex items-center gap-4">
                    <span className="text-zinc-600 font-mono">01</span> Контакты
                  </legend>
                  <CinematicField label="Имя и фамилия *" value={form.fullName} onChange={(v: string) => handleChange("fullName", v)} placeholder="Иван Иванов" required />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <CinematicField label="Телефон *" type="tel" value={form.phone} onChange={(v: string) => handleChange("phone", v)} placeholder="+998 90 123 45 67" required />
                    <CinematicField label="Email *" type="email" value={form.email} onChange={(v: string) => handleChange("email", v)} placeholder="mail@example.com" required />
                  </div>
                </motion.fieldset>

                <motion.fieldset variants={fadeUpBlur} className="space-y-6">
                  <legend className="text-xs text-white font-light tracking-[0.3em] uppercase border-b border-white/10 pb-6 w-full flex justify-between items-center">
                    <div className="flex items-center gap-4"><span className="text-zinc-600 font-mono">02</span> Локация</div>
                  </legend>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <CinematicField label="Город" value="г. Ташкент" onChange={()=>{}} disabled={true} />
                    <CinematicSelect label="Район *" options={TASHKENT_DISTRICTS} value={form.district} onChange={(val: string) => handleChange("district", val)} />
                  </div>

                  <CinematicField label="Улица / Массив / Квартал *" value={form.street} onChange={(v: string) => handleChange("street", v)} placeholder="напр. ул. Амира Темура" required />
                  
                  <div className="grid grid-cols-2 gap-6">
                    <CinematicField label="Дом *" value={form.house} onChange={(v: string) => handleChange("house", v)} placeholder="12А" required />
                    <CinematicField label="Кв / Офис" value={form.apartment} onChange={(v: string) => handleChange("apartment", v)} placeholder="404" />
                  </div>

                  <CinematicField label="Ориентир (необязательно)" value={form.landmark} onChange={(v: string) => handleChange("landmark", v)} placeholder="Что рядом?" />
                </motion.fieldset>

                <motion.fieldset variants={fadeUpBlur} className="space-y-6">
                  <legend className="text-xs text-white font-light tracking-[0.3em] uppercase border-b border-white/10 pb-6 w-full flex items-center gap-4">
                    <span className="text-zinc-600 font-mono">03</span> Транзакция
                  </legend>
                  
                  <div className="p-8 border border-white/10 bg-black/50 backdrop-blur-3xl space-y-8 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
                    
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 pb-8 border-b border-white/5 relative z-10">
                      <div>
                        <p className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] mb-2 uppercase">Uzcard / Humo</p>
                        <p className="text-xl sm:text-2xl font-mono text-white tracking-[0.15em]">{CARD_NUMBER}</p>
                      </div>
                      <button type="button" onClick={() => handleCopy(CARD_NUMBER.replace(/\s/g, ""), "card")} className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-white border border-white/10 hover:border-white/50 bg-white/5 px-6 py-3 transition-all duration-500">
                        {copiedField === "card" ? "✓ СКОПИРОВАНО" : "КОПИРОВАТЬ"}
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 relative z-10">
                      <div>
                        <p className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] mb-2 uppercase">Сумма перевода</p>
                        <p className="text-xl sm:text-2xl font-mono text-cyan-400 tracking-[0.1em] drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]">{numericPrice} UZS</p>
                      </div>
                      <button type="button" onClick={() => handleCopy(numericPrice, "price")} className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-white border border-white/10 hover:border-white/50 bg-white/5 px-6 py-3 transition-all duration-500">
                        {copiedField === "price" ? "✓ СКОПИРОВАНО" : "КОПИРОВАТЬ"}
                      </button>
                    </div>
                  </div>

                  <div className="pt-4">
                    <label className={`group relative flex flex-col items-center justify-center w-full min-h-[160px] border border-dashed cursor-pointer transition-all duration-700 overflow-hidden ${
                      receiptFile 
                        ? "border-emerald-500 bg-emerald-950/10 text-emerald-300 shadow-[0_0_30px_-5px_rgba(16,185,129,0.2)]" 
                        : "border-white/20 bg-black/40 hover:bg-white/[0.02] hover:border-white/50 text-zinc-500"
                    }`}>
                      {!receiptFile && <div className="absolute top-0 left-0 w-full h-[1px] bg-cyan-400/50 shadow-[0_0_10px_#22d3ee] -translate-y-full group-hover:animate-[scan_2s_ease-in-out_infinite]" />}
                      
                      <div className="flex flex-col items-center justify-center p-8 text-center relative z-10">
                        <span className={`text-3xl mb-4 transition-transform duration-500 ${receiptFile ? "scale-110" : "group-hover:-translate-y-2"}`}>
                          {receiptFile ? "✓" : "+"}
                        </span>
                        <p className="text-xs font-bold tracking-[0.15em] uppercase">
                          {receiptFile ? receiptFile.name : "Загрузить чек об оплате"}
                        </p>
                        {!receiptFile && <p className="text-[10px] tracking-widest mt-2 opacity-50">JPEG, PNG, PDF</p>}
                      </div>
                      <input ref={fileInputRef} type="file" accept="image/*,application/pdf" onChange={handleFileChange} className="hidden" />
                    </label>
                  </div>
                </motion.fieldset>

                <motion.button
                  variants={fadeUpBlur} type="submit" disabled={step === "processing"}
                  className="relative group w-full py-6 mt-10 bg-white text-black text-xs font-bold uppercase tracking-[0.4em] overflow-hidden transition-all duration-500 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-wait shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)]"
                >
                  <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/80 to-transparent group-hover:animate-[shimmer_1.5s_infinite_ease-in-out] mix-blend-difference" />
                  
                  <span className="relative z-10">
                    {step === "processing" ? "СИНХРОНИЗАЦИЯ..." : "ПОДТВЕРДИТЬ ЗАКАЗ"}
                  </span>
                </motion.button>
              </div>
            </motion.form>
          </motion.div>
        )}

        {step === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, filter: "blur(30px)", scale: 1.1 }} 
            animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }} 
            transition={{ duration: 2, ease: cinematicEase }}
            className="relative z-20 min-h-screen flex flex-col items-center justify-center text-center px-4 bg-black"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-emerald-900/10 blur-[150px] rounded-full pointer-events-none" />

            <div className="space-y-8 mb-16 relative z-10">
              <div className="w-16 h-16 mx-auto border border-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <span className="text-emerald-400 text-2xl">✓</span>
              </div>
              <h2 className="text-4xl sm:text-6xl font-light text-white tracking-[0.3em] uppercase">Заказ Принят</h2>
              <p className="text-zinc-500 text-sm tracking-[0.2em] font-mono uppercase">Транзакция успешно завершена</p>
            </div>
            
            <div className="max-w-lg w-full bg-white/[0.02] border border-white/5 p-8 mb-16 space-y-4 text-xs text-zinc-400 font-mono text-left relative z-10 backdrop-blur-md">
              <p className="text-emerald-400 border-b border-emerald-900/30 pb-4 mb-4 font-bold">ДАННЫЕ ПЕРЕДАНЫ В ОБРАБОТКУ</p>
              <p className="text-white flex justify-between"><span className="text-zinc-600">КЛИЕНТ:</span> {form.fullName}</p>
              <p className="text-white flex justify-between"><span className="text-zinc-600">ТОВАР:</span> {productName} ({selectedSize})</p>
              <p className="text-white flex justify-between"><span className="text-zinc-600">ЛОКАЦИЯ:</span> {form.district} р-н</p>
            </div>

            <Link href="/" className="relative z-10 border border-white/20 px-10 py-5 text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-300 hover:text-black hover:bg-white transition-all duration-700">
              ВЕРНУТЬСЯ В КАТАЛОГ
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(150%); }
        }
        @keyframes scan {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(160px); opacity: 0; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }
      `}} />
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <CheckoutContent />
    </Suspense>
  );
}