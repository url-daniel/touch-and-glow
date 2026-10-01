import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "@/types";
import { formatPrice } from "@/types";

type CartState = {
  lines: CartLine[];
  addItem: (line: CartLine) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  totalAmount: () => number;
  currencyCode: () => string;
  formattedTotal: () => string;
  totalKobo: () => number;
  totalItems: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],

      addItem: (line) => {
        set((state) => {
          const matchKey = line.variantId || line.productId;
          const existingIndex = state.lines.findIndex(
            (l) => (l.variantId || l.productId) === matchKey
          );

          if (existingIndex > -1) {
            const existing = state.lines[existingIndex];
            const maxStock = existing.stock > 0 ? existing.stock : 99;
            const nextQty = Math.min(existing.quantity + line.quantity, maxStock);
            const updated = [...state.lines];
            updated[existingIndex] = { ...existing, quantity: nextQty };
            return { lines: updated };
          }
          return { lines: [...state.lines, line] };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          lines: state.lines.filter((l) => l.variantId !== id && l.productId !== id)
        }));
      },

      setQuantity: (id, quantity) => {
        set((state) => ({
          lines: state.lines
            .map((l) => {
              if (l.variantId === id || l.productId === id) {
                const maxStock = l.stock > 0 ? l.stock : 99;
                return { ...l, quantity: Math.max(1, Math.min(quantity, maxStock)) };
              }
              return l;
            })
            .filter((l) => l.quantity > 0)
        }));
      },

      clear: () => set({ lines: [] }),

      totalAmount: () => {
        return get().lines.reduce((sum, l) => {
          const itemPrice =
            typeof l.price === "number"
              ? l.price
              : l.priceKobo
              ? l.priceKobo / 100
              : 0;
          return sum + itemPrice * l.quantity;
        }, 0);
      },

      currencyCode: () => {
        const first = get().lines[0];
        return first?.currencyCode || "NGN";
      },

      formattedTotal: () => {
        const total = get().totalAmount();
        const code = get().currencyCode();
        return formatPrice(total, code);
      },

      totalKobo: () => {
        return Math.round(get().totalAmount() * 100);
      },

      totalItems: () => get().lines.reduce((sum, l) => sum + l.quantity, 0)
    }),
    {
      name: "touch-and-glow-shopify-cart"
    }
  )
);
