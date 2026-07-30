"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
  id: string; // `${productId}-${size}`
  productId: number;
  name: string;
  price: number; // ИЗМЕНЕНО: храним как число (например: 200000)
  size: string;
  imageUrl: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  totalQuantity: number; // Общее количество вещей
  cartTotalFormatted: string; // Отформатированная сумма
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: Omit<CartItem, "id" | "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void; // +1 или -1
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Загрузка из localStorage при старте
  useEffect(() => {
    const saved = localStorage.getItem("cart_items");
    if (saved) {
      try {
        setCartItems(JSON.parse(saved));
      } catch (e) {
        console.error("Ошибка парсинга корзины", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // 2. Сохранение в localStorage при любом изменении корзины
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("cart_items", JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (item: Omit<CartItem, "id" | "quantity">) => {
    const cartItemId = `${item.productId}-${item.size}`;

    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === cartItemId);
      if (existing) {
        return prev.map((i) =>
          i.id === cartItemId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, id: cartItemId, quantity: 1 }];
    });
    openCart();
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  // Увеличение / уменьшение количества
  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[] // Если количество стало 0 — удаляем товар
    );
  };

  // Подсчет общего количества вещей
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Подсчет общей суммы (теперь математически надежно)
  const totalNumber = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const cartTotalFormatted =
    new Intl.NumberFormat("ru-RU").format(totalNumber) + " UZS";

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        totalQuantity,
        cartTotalFormatted,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};