import { useCartStore } from "@/lib/cart-store";

export default function Toast() {
  const { toastMessage, hideToast, openCart } = useCartStore();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slideUp">
      <div className="flex items-center gap-3 rounded-2xl border border-blush bg-ivory/95 px-5 py-3.5 shadow-xl backdrop-blur-md">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs text-emerald-700">
          ✓
        </span>
        <span className="text-xs font-medium text-espresso">{toastMessage}</span>
        <button
          type="button"
          onClick={() => {
            hideToast();
            openCart();
          }}
          className="ml-2 rounded-full bg-clay px-3 py-1 text-xs font-medium text-ivory hover:bg-clay-dark transition-colors"
        >
          View Bag
        </button>
        <button
          type="button"
          onClick={hideToast}
          className="text-xs text-taupe hover:text-espresso ml-1"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
