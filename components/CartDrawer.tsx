"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCart } from "../app/context/CartContext";

const cinematicEase = [0.22, 1, 0.36, 1] as const;

// Вспомогательная функция для форматирования цены одного товара
const formatPrice = (price: number) =>
  new Intl.NumberFormat("ru-RU").format(price) + " UZS";

export default function CartDrawer() {
  const {
    isCartOpen,
    closeCart,
    cartItems,
    removeFromCart,
    updateQuantity,
    cartTotalFormatted,
    totalQuantity,
  } = useCart();

  // Блокировка скролла страницы при открытой корзине
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop (Оверлей) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: cinematicEase }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Сама шторка корзины */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.7, ease: cinematicEase }}
            className="fixed top-0 right-0 w-full sm:w-[400px] h-[100dvh] bg-black border-l border-white/10 z-[101] flex flex-col font-mono"
          >
            {/* Header корзины */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-white text-xs sm:text-sm font-bold tracking-[0.3em] uppercase">
                YOUR CART [{totalQuantity}]
              </h2>
              <button
                onClick={closeCart}
                className="text-zinc-500 hover:text-white transition-colors p-2 text-xs"
              >
                [ CLOSE ]
              </button>
            </div>

            {/* Список товаров */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-600 opacity-50">
                  <span className="text-[10px] tracking-[0.4em] uppercase mb-4">
                    EMPTY
                  </span>
                </div>
              ) : (
                cartItems.map((item) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={item.id}
                    className="flex gap-4 border border-white/5 bg-zinc-950/50 p-3 relative group"
                  >
                    <div className="relative w-20 h-24 bg-zinc-900 flex-shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover grayscale-[30%]"
                      />
                    </div>
                    <div className="flex flex-col flex-1 py-1 justify-between">
                      <div>
                        <h3 className="text-zinc-300 text-[10px] font-bold tracking-[0.1em] uppercase pr-6 leading-tight">
                          {item.name}
                        </h3>
                        <p className="text-zinc-500 text-[9px] mt-1 tracking-widest uppercase">
                          SIZE: {item.size}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="text-white text-[10px] tracking-widest">
                          {formatPrice(item.price * item.quantity)}
                        </div>

                        {/* Кнопки - / + для управления количеством */}
                        <div className="flex items-center gap-2 border border-white/10 px-2 py-0.5 text-[10px] text-zinc-400">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="hover:text-white transition-colors"
                          >
                            -
                          </button>
                          <span className="text-white">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="hover:text-white transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Кнопка удаления */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="absolute top-2 right-2 text-zinc-600 hover:text-red-500 transition-colors text-xs"
                    >
                      ✕
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer корзины */}
            <div className="p-6 border-t border-white/10 bg-black">
              <div className="flex justify-between items-center mb-6 text-xs tracking-widest uppercase text-zinc-400">
                <span>TOTAL</span>
                <span className="text-white font-bold">
                  {cartTotalFormatted}
                </span>
              </div>
              <button
                disabled={cartItems.length === 0}
                className="w-full py-4 bg-white text-black font-bold text-[10px] uppercase tracking-[0.4em] hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                CHECKOUT &rarr;
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
