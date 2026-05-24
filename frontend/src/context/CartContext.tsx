import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import type { CartItem, Product } from "../types";

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const raw = localStorage.getItem("cart");
    return raw ? JSON.parse(raw) : [];
  });

  function persist(nextItems: CartItem[]) {
    setItems(nextItems);
    localStorage.setItem("cart", JSON.stringify(nextItems));
  }

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);

    return {
      items,
      count,
      subtotal,
      addItem(product, quantity = 1) {
        const existing = items.find((item) => item.product.id === product.id);
        const nextItems = existing
          ? items.map((item) =>
              item.product.id === product.id ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) } : item,
            )
          : [...items, { product, quantity: Math.min(quantity, product.stock) }];
        persist(nextItems);
      },
      updateQuantity(productId, quantity) {
        const nextItems = items
          .map((item) => (item.product.id === productId ? { ...item, quantity: Math.max(1, Math.min(quantity, item.product.stock)) } : item))
          .filter((item) => item.quantity > 0);
        persist(nextItems);
      },
      removeItem(productId) {
        persist(items.filter((item) => item.product.id !== productId));
      },
      clearCart() {
        persist([]);
      },
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
