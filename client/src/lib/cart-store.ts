import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine, Product } from "@/types";
import { formatPrice } from "@/types";
import { fireCartConfetti } from "@/lib/confetti";

type CartState = {
  lines: CartLine[];
  isCartOpen: boolean;
  quickViewProduct: Product | null;
  toastMessage: string | null;

  // Cart actions
  addItem: (line: CartLine) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;

  // Drawer & UI actions
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  setQuickViewProduct: (p: Product | null) => void;
  showToast: (message: string) => void;
  hideToast: () => void;

  // Computed helpers
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
      isCartOpen: false,
      quickViewProduct: null,
      toastMessage: null,

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      setQuickViewProduct: (p) => set({ quickViewProduct: p }),
      showToast: (message) => {
        set({ toastMessage: message });
        setTimeout(() => {
          if (get().toastMessage === message) {
            set({ toastMessage: null });
          }
        }, 3000);
      },
      hideToast: () => set({ toastMessage: null }),

      addItem: (line) => {
        set((state) => {
          const matchKey = line.variantId || line.productId;
          const existingIndex = state.lines.findIndex(
            (l) => (l.variantId || l.productId) === matchKey
          );

          let updatedLines: CartLine[];
          if (existingIndex > -1) {
            const existing = state.lines[existingIndex];
            const maxStock = existing.stock > 0 ? existing.stock : 99;
            const nextQty = Math.min(existing.quantity + line.quantity, maxStock);
            updatedLines = [...state.lines];
            updatedLines[existingIndex] = { ...existing, quantity: nextQty };
          } else {
            updatedLines = [...state.lines, line];
          }

          return {
            lines: updatedLines,
            isCartOpen: true, // Automatically open slideout drawer on add to bag
            toastMessage: `Added "${line.name}" to your bag`
          };
        });

        // Trigger celebratory luxury confetti burst
        try {
          fireCartConfetti();
        } catch {
          // Graceful fallback
        }

        // Auto-dismiss toast
        setTimeout(() => {
          set({ toastMessage: null });
        }, 3500);
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
        return first?.currencyCode || "USD";
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
      name: "touch-and-glow-shopify-cart",
      partialize: (state) => ({ lines: state.lines })
    }
  )
);
