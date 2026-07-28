"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

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
];

function CheckoutContent() {
  const params = useSearchParams();

  const productName = params.get("name") || "Товар из Y2K Store";
  const productPriceRaw = params.get("price") || "0 UZS";
  const productSizesRaw = params.get("sizes") || "XS, S, M, L";
  const productImg = params.get("img") || "/products/y2k-tee.jpg";

  // Очищаем цену от UZS для копирования только чистой суммы (цифр)
  const numericPrice = productPriceRaw.replace(" UZS", "");

  // Разбиваем строку размеров на массив
  const availableSizes = productSizesRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const [selectedSize, setSelectedSize] = useState<string>(
    availableSizes[0] || "M"
  );
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<"form" | "processing" | "success">("form");
  const [copiedField, setCopiedField] = useState<"card" | "price" | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    phone: "+998 ",
    email: "",
    district: TASHKENT_DISTRICTS[0],
    street: "",
    house: "",
    apartment: "",
    landmark: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCopy = (text: string, type: "card" | "price") => {
    navigator.clipboard.writeText(text);
    setCopiedField(type);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!receiptFile) {
      alert("Пожалуйста, прикрепите чек об оплате!");
      return;
    }

    setStep("processing");

    try {
      const formData = new FormData();
      formData.append("fullName", form.fullName);
      formData.append("phone", form.phone);
      formData.append("email", form.email);
      formData.append("district", form.district);
      formData.append("street", form.street);
      formData.append("house", form.house);
      formData.append("apartment", form.apartment);
      formData.append("landmark", form.landmark);
      formData.append("productName", productName);
      formData.append("size", selectedSize);
      formData.append("price", productPriceRaw);
      formData.append("receipt", receiptFile);

      const res = await fetch("/api/checkout", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setStep("success");
      } else {
        alert("Ошибка при отправке заказа. Попробуйте еще раз.");
        setStep("form");
      }
    } catch (err) {
      console.error(err);
      alert("Произошла ошибка сети.");
      setStep("form");
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12 font-mono relative overflow-hidden selection:bg-pink-500 selection:text-white">
      {/* 🌌 Y2K Фоновые сферы */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-pink-600/20 to-purple-600/20 rounded-full blur-[150px] animate-pulse duration-[10000ms] ease-in-out" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-bl from-cyan-500/20 to-indigo-600/20 rounded-full blur-[150px] animate-pulse duration-[8000ms] delay-1000 ease-in-out" />
      </div>

      <div
        className={`relative z-10 max-w-4xl mx-auto transition-all duration-700 ease-out ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {/* Шапка */}
        <header className="mb-10 flex items-center justify-between backdrop-blur-2xl bg-zinc-900/40 border border-white/15 px-6 py-4 rounded-3xl shadow-[0_0_25px_rgba(236,72,153,0.15)]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs tracking-widest text-zinc-400 hover:text-cyan-300 transition-colors duration-300"
          >
            ← НАЗАД В КАТАЛОГ 
          </Link>
          <h1 className="text-xl font-extrabold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-fuchsia-300 to-cyan-300 uppercase drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]">
            ОФОРМЛЕНИЕ 
          </h1>
        </header>

        {step !== "success" && (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Карточка товара с выбором размера */}
            <div
              className={`md:col-span-1 backdrop-blur-xl bg-zinc-900/30 border border-white/10 rounded-2xl p-5 h-fit transition-all duration-700 ease-out delay-100 shadow-[0_0_20px_rgba(0,0,0,0.5)] ${
                mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
              }`}
            >
              <div className="relative w-full h-60 mb-4 rounded-xl overflow-hidden border border-white/10 bg-zinc-950">
                <Image
                  src={productImg}
                  alt={productName}
                  fill
                  sizes="300px"
                  className="object-cover"
                />
              </div>
              <h4 className="font-bold text-sm mb-2 tracking-wider text-zinc-100 uppercase">
                {productName}
              </h4>

              {/* Выбор размера */}
              <div className="mb-4">
                <span className="block text-[11px] text-zinc-400 mb-2 uppercase tracking-wider">
                  Выберите размер:
                </span>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 border ${
                          isSelected
                            ? "bg-pink-500 text-white border-pink-400 shadow-[0_0_12px_rgba(236,72,153,0.5)] scale-105"
                            : "bg-zinc-900 text-zinc-400 border-white/10 hover:border-white/30 hover:text-zinc-200"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Цена с защитой слова UZS от выделения */}
              <p className="text-cyan-300 font-extrabold text-xl tracking-widest drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">
                <span className="select-all">{numericPrice}</span>{" "}
                <span className="select-none">UZS</span>
              </p>

              <div className="mt-6 pt-6 border-t border-white/10 space-y-3 text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>Размер</span>
                  <span className="text-pink-300 font-bold">{selectedSize}</span>
                </div>
                <div className="flex justify-between">
                  <span>Доставка по Ташкенту</span>
                  <span className="text-cyan-300 font-bold">БЕСПЛАТНО</span>
                </div>
                <div className="flex justify-between text-zinc-100 font-bold text-sm pt-3 border-t border-white/10">
                  <span>Итого к оплате</span>
                  <span className="text-pink-400 tracking-wider">
                    {numericPrice} <span className="select-none">UZS</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Поля формы */}
            <div
              className={`md:col-span-2 backdrop-blur-xl bg-zinc-900/30 border border-white/10 rounded-2xl p-6 md:p-8 space-y-8 transition-all duration-700 ease-out delay-200 shadow-[0_0_20px_rgba(0,0,0,0.5)] ${
                mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
              }`}
            >
              {/* Контакты */}
              <fieldset className="space-y-4">
                <legend className="text-pink-300 font-bold tracking-[0.2em] text-xs mb-2 flex items-center gap-2 uppercase">
                  Контактные данные
                </legend>
                <Field
                  label="Имя и фамилия *"
                  value={form.fullName}
                  onChange={(v) => handleChange("fullName", v)}
                  placeholder="Иван Иванов"
                  required
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="Телефон *"
                    value={form.phone}
                    onChange={(v) => handleChange("phone", v)}
                    placeholder="+998 90 123 45 67"
                    required
                  />
                  <Field
                    label="Email *"
                    type="email"
                    value={form.email}
                    onChange={(v) => handleChange("email", v)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </fieldset>

              {/* Адрес доставки по Ташкенту */}
              <fieldset className="space-y-4">
                <legend className="text-pink-300 font-bold tracking-[0.2em] text-xs mb-2 flex items-center justify-between uppercase">
                  <span>Доставка по Ташкенту</span>
                  <span className="text-[10px] bg-pink-950/80 text-pink-300 px-2.5 py-1 rounded-full border border-pink-500/30">
                    Только Ташкент
                  </span>
                </legend>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-2 tracking-wide">
                      Город
                    </label>
                    <input
                      type="text"
                      disabled
                      value="г. Ташкент"
                      className="w-full bg-zinc-950/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-pink-300 font-bold cursor-not-allowed opacity-90"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-2 tracking-wide">
                      Район *
                    </label>
                    <select
                      value={form.district}
                      onChange={(e) => handleChange("district", e.target.value)}
                      className="w-full bg-zinc-950 border border-white/10 focus:border-pink-500/60 rounded-xl px-4 py-3 text-xs text-zinc-200 outline-none transition-all duration-300 cursor-pointer"
                    >
                      {TASHKENT_DISTRICTS.map((d) => (
                        <option key={d} value={d} className="bg-zinc-950 text-zinc-200">
                          {d} район
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <Field
                  label="Улица / Массив / Квартал *"
                  value={form.street}
                  onChange={(v) => handleChange("street", v)}
                  placeholder="напр. ул. Амира Темура или Чиланзар-3"
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="Дом *"
                    value={form.house}
                    onChange={(v) => handleChange("house", v)}
                    placeholder="12A"
                    required
                  />
                  <Field
                    label="Квартира / Офис"
                    value={form.apartment}
                    onChange={(v) => handleChange("apartment", v)}
                    placeholder="45"
                  />
                </div>

                <Field
                  label="Ориентир (для курьера)"
                  value={form.landmark}
                  onChange={(v) => handleChange("landmark", v)}
                  placeholder="напр. возле станции метро..."
                />
              </fieldset>

              {/* Оплата переводом */}
              <fieldset className="space-y-4">
                <legend className="text-pink-300 font-bold tracking-[0.2em] text-xs mb-2 flex items-center gap-2 uppercase">
                  Оплата переводом на карту
                </legend>

                <div className="bg-zinc-950/60 border border-white/10 rounded-xl p-4 space-y-4">
                  {/* Скопировать номер карты */}
                  <div>
                    <span className="block text-xs text-zinc-400 mb-2">
                      Карта Uzcard / Humo:
                    </span>
                    <div className="flex items-center justify-between bg-zinc-900 border border-white/10 rounded-xl p-3">
                      <span className="font-mono text-sm font-bold text-pink-300 tracking-wider">
                        {CARD_NUMBER}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(CARD_NUMBER.replace(/\s/g, ""), "card")}
                        className="text-xs bg-pink-950/80 hover:bg-pink-600 text-pink-300 hover:text-white border border-pink-500/30 hover:border-pink-300 px-3 py-1.5 rounded-lg transition-all active:scale-95"
                      >
                        {copiedField === "card" ? "✓ Скопировано!" : "Скопировать"}
                      </button>
                    </div>
                  </div>

                  {/* Скопировать сумму в сумах (ТОЛЬКО ЦИФРЫ) */}
                  <div>
                    <span className="block text-xs text-zinc-400 mb-2">
                      Точная сумма к переводу (в сумах):
                    </span>
                    <div className="flex items-center justify-between bg-zinc-900 border border-white/10 rounded-xl p-3">
                      <span className="font-mono text-sm font-bold text-cyan-300 tracking-wider">
                        <span className="select-all">{numericPrice}</span>{" "}
                        <span className="select-none">UZS</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(numericPrice, "price")}
                        className="text-xs bg-cyan-950/80 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/30 hover:border-cyan-300 px-3 py-1.5 rounded-lg transition-all active:scale-95"
                      >
                        {copiedField === "price" ? "✓ Скопировано!" : "Скопировать сумму"}
                      </button>
                    </div>
                  </div>

                  {/* Загрузка чека */}
                  <div className="pt-2">
                    <span className="block text-xs text-zinc-400 mb-2">
                      Прикрепите скриншот чека (Payme / Click / Uzum) *
                    </span>
                    <label className="flex flex-col items-center justify-center w-full h-28 border border-dashed border-white/20 hover:border-pink-500/50 rounded-xl cursor-pointer bg-zinc-900/50 hover:bg-zinc-900 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <span className="text-2xl mb-1">🧾</span>
                        <p className="text-xs text-zinc-400 text-center px-2">
                          {receiptFile ? (
                            <span className="text-pink-300 font-bold">
                              Выбран файл: {receiptFile.name}
                            </span>
                          ) : (
                            "Нажмите, чтобы загрузить чек"
                          )}
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        required
                      />
                    </label>
                  </div>
                </div>
              </fieldset>

              <button
                type="submit"
                disabled={step === "processing"}
                className="w-full text-center py-4 rounded-xl font-bold text-xs tracking-[0.2em] uppercase bg-gradient-to-r from-zinc-900 to-zinc-800 hover:from-pink-600 hover:to-purple-600 border border-white/20 hover:border-pink-300 text-zinc-200 hover:text-white transition-all duration-500 ease-out shadow-lg hover:shadow-[0_0_20px_rgba(236,72,153,0.6)] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {step === "processing" ? "ОТПРАВКА..." : "Я ОПЛАТИЛ — ПОДТВЕРДИТЬ "}
              </button>
            </div>
          </form>
        )}

        {/* Экран успеха */}
        {step === "success" && (
          <div className="animate-[fadeIn_0.6s_ease-out] backdrop-blur-xl bg-zinc-900/40 border border-white/20 rounded-3xl p-10 md:p-16 text-center shadow-[0_0_40px_rgba(236,72,153,0.25)]">
            <div className="text-5xl mb-6 text-pink-400">✧</div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-200 to-cyan-300 uppercase">
              ЗАКАЗ И ЧЕК ПРИНЯТЫ!
            </h2>
            <p className="text-zinc-400 max-w-md mx-auto text-xs leading-relaxed mb-8 tracking-wide">
              Спасибо, <span className="text-zinc-100 font-bold">{form.fullName || "друг"}</span>! Вы выбрали товар{" "}
              <strong className="text-pink-300">{productName}</strong> (размер: <span className="text-cyan-300 font-bold">{selectedSize}</span>) на сумму{" "}
              <strong className="text-pink-300">{productPriceRaw}</strong>. Мы свяжемся с вами и доставим по адресу: <br />
              <strong className="text-zinc-200 block mt-2">
                г. Ташкент, {form.district} район, {form.street}, д. {form.house}
              </strong>
              {form.landmark && <span className="text-cyan-300/80"> (ориентир: {form.landmark})</span>}.
            </p>
            <Link
              href="/"
              className="inline-block py-3.5 px-8 rounded-xl font-bold text-xs tracking-[0.2em] uppercase bg-gradient-to-r from-zinc-900 to-zinc-800 hover:from-pink-600 hover:to-purple-600 border border-white/20 hover:border-pink-300 text-zinc-200 hover:text-white transition-all duration-500 active:scale-95"
            >
              ВЕРНУТЬСЯ В КАТАЛОГ 
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-xs text-zinc-400 mb-2 tracking-wide">
        {label}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-zinc-950 border border-white/10 focus:border-pink-500/60 rounded-xl px-4 py-3 text-xs text-zinc-200 placeholder:text-zinc-600 outline-none transition-all duration-300"
      />
    </label>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center font-mono">Загрузка...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}