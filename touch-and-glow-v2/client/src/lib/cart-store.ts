import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "@/types";

type CartState = {
  lines: CartLine[];
  addItem: (line: CartLine) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  totalKobo: () => number;
  totalItems: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],

      addItem: (line) => {
        set((state) => {
          const existing = state.lines.find((l) => l.productId === line.productId);
          if (existing) {
            const nextQty = Math.min(existing.quantity + line.quantity, existing.stock);
            return {
              lines: state.lines.map((l) =>
                l.productId === line.productId ? { ...l, quantity: nextQty } : l
              )
            };
          }
          return { lines: [...state.lines, line] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({ lines: state.lines.filter((l) => l.productId !== productId) }));
      },

      setQuantity: (productId, quantity) => {
        set((state) => ({
          lines: state.lines
            .map((l) =>
              l.productId === productId
                ? { ...l, quantity: Math.max(1, Math.min(quantity, l.stock)) }
                : l
            )
            .filter((l) => l.quantity > 0)
        }));
      },

      clear: () => set({ lines: [] }),

      totalKobo: () => get().lines.reduce((sum, l) => sum + l.priceKobo * l.quantity, 0),

      totalItems: () => get().lines.reduce((sum, l) => sum + l.quantity, 0)
    }),
    {
      // Guest cart survives reloads via localStorage. This is a per-browser
      // convenience only — the server always recomputes the real total
      // from the database at checkout, so a tampered localStorage value
      // can never change what the customer is actually charged.
      name: "touch-and-glow-cart"
    }
  )
);
