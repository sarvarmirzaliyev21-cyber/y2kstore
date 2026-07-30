"use client";

import React from "react";

export function MarqueeBanner() {
  const items = [
    "БЕСПЛАТНАЯ ДОСТАВКА ПО ТАШКЕНТУ",
    "Y2K ДРОП УЖЕ ДОСТУПЕН",
    "ОГРАНИЧЕННАЯ СЕРИЯ",
    "Y2KSTORE — NEW DROP",
    "НОВАЯ КОЛЛЕКЦИЯ В ПРОДАЖЕ",
  ];

  return (
    <div className="relative w-full overflow-hidden border-y border-pink-500/30 bg-[#060609] py-2.5 font-mono text-[11px] font-extrabold tracking-[0.2em] text-pink-300 uppercase shadow-[0_0_15px_rgba(236,72,153,0.15)] select-none">
      
      {/* Плавные края (fade effect) */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#050508] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#050508] to-transparent z-10" />

      {/* Вшитые CSS-стили для 100% плавности без затыков */}
      <style jsx>{`
        @keyframes smoothMarquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .animate-smooth-marquee {
          display: flex;
          width: max-content;
          animation: smoothMarquee 25s linear infinite;
          will-change: transform;
        }
        .animate-smooth-marquee:hover {
          animation-play-state: paused; /* Пауза при наведении (опционально) */
        }
      `}</style>

      {/* Лента */}
      <div className="animate-smooth-marquee">
        {/* Рендерим 2 абсолютно одинаковых набора */}
        {[0, 1].map((groupIndex) => (
          <div key={groupIndex} className="flex items-center shrink-0">
            {items.map((text, idx) => (
              <div key={idx} className="flex items-center">
                <span className="px-4 drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]">
                  {text}
                </span>
                <span className="px-4 text-cyan-400 opacity-80 font-normal">
                  //
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}