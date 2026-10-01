import { useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "@/lib/cart-store";
import { createShopifyCheckout, isShopifyConfigured } from "@/lib/shopify";
import { formatPrice } from "@/types";

export default function CartDrawer() {
  const {
    lines,
    isCartOpen,
    closeCart,
    setQuantity,
    removeItem,
    formattedTotal,
    totalAmount,
    currencyCode
  } = useCartStore();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const total = totalAmount();
  const currency = currencyCode();
  const freeShippingThreshold = currency === "NGN" ? 50000 : 100;
  const progressPercent = Math.min(100, Math.round((total / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - total);

  async function handleCheckout() {
    setError(null);
    setSubmitting(true);

    try {
      if (!isShopifyConfigured()) {
        throw new Error(
          "Shopify Storefront API credentials are required. Please check your environment variables."
        );
      }

      // Filter demo items
      const hasDemoItems = lines.some((l) => l.variantId?.includes("tag-demo"));
      if (hasDemoItems) {
        throw new Error(
          "Please remove sample demo items from your bag before checking out with Shopify."
        );
      }

      const checkoutItems = lines.map((l) => ({
        variantId: l.variantId || l.productId,
        quantity: l.quantity
      }));

      const { checkoutUrl } = await createShopifyCheckout(checkoutItems);
      window.location.href = checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to initialize Shopify checkout.");
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-espresso/50 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md transform bg-ivory shadow-2xl transition-transform duration-300 ease-in-out flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-blush px-6 py-5">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl italic text-espresso">Your Bag</h2>
              <span className="rounded-full bg-clay/15 px-2 py-0.5 text-xs font-medium text-clay-dark">
                {lines.reduce((s, l) => s + l.quantity, 0)}
              </span>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="rounded-full p-2 text-taupe hover:bg-sand/40 hover:text-espresso transition-colors"
              aria-label="Close bag"
            >
              ✕
            </button>
          </div>

          {/* Free shipping progress bar */}
          <div className="border-b border-blush/60 bg-sand/20 px-6 py-3">
            <div className="flex justify-between text-xs text-taupe">
              <span>
                {remainingForFreeShipping === 0
                  ? "🎉 You've unlocked Free Express Shipping!"
                  : `Add ${formatPrice(remainingForFreeShipping, currency)} more for Free Shipping`}
              </span>
              <span className="font-semibold text-espresso">{progressPercent}%</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-blush">
              <div
                className="h-full bg-clay transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items or Empty State */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {lines.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center py-16">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blush/50 text-2xl text-taupe">
                  🛍️
                </div>
                <h3 className="font-display text-lg italic text-espresso">Your bag is empty</h3>
                <p className="mt-2 text-xs text-taupe max-w-xs">
                  Explore our nourishing botanical collection and find your new skincare essentials.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    closeCart();
                    const shop = document.getElementById("shop");
                    shop?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="mt-6 rounded-full bg-clay px-6 py-2.5 text-xs font-medium text-ivory hover:bg-clay-dark transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="divide-y divide-blush/60">
                {lines.map((line) => {
                  const itemKey = line.variantId || line.productId;
                  const unitPrice =
                    typeof line.price === "number"
                      ? line.price
                      : line.priceKobo
                      ? line.priceKobo / 100
                      : 0;

                  return (
                    <div key={itemKey} className="flex gap-4 py-4">
                      {/* Thumbnail */}
                      <div className="aspect-square w-16 h-16 shrink-0 overflow-hidden rounded-xl bg-blush">
                        {line.imageUrl ? (
                          <img src={line.imageUrl} alt={line.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center font-display text-xs italic text-taupe">
                            {line.name}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-display text-sm font-medium text-espresso line-clamp-1">
                              {line.name}
                            </h4>
                            <button
                              type="button"
                              onClick={() => removeItem(itemKey)}
                              className="text-xs text-taupe hover:text-red-600 transition-colors"
                              aria-label="Remove"
                            >
                              ✕
                            </button>
                          </div>
                          {line.variantTitle && (
                            <p className="text-[11px] text-taupe mt-0.5">{line.variantTitle}</p>
                          )}
                          <p className="text-xs text-taupe font-medium mt-1">
                            {formatPrice(unitPrice, line.currencyCode || currency)}
                          </p>
                        </div>

                        {/* Quantity */}
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-espresso/15 bg-ivory">
                            <button
                              type="button"
                              onClick={() => setQuantity(itemKey, Math.max(1, line.quantity - 1))}
                              className="px-2.5 py-0.5 text-xs text-espresso hover:text-clay"
                            >
                              −
                            </button>
                            <span className="w-5 text-center text-xs font-medium text-espresso">
                              {line.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => setQuantity(itemKey, line.quantity + 1)}
                              className="px-2.5 py-0.5 text-xs text-espresso hover:text-clay"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-xs font-semibold text-espresso">
                            {formatPrice(unitPrice * line.quantity, line.currencyCode || currency)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Checkout CTA */}
          {lines.length > 0 && (
            <div className="border-t border-blush bg-sand/10 p-6 space-y-4">
              <div className="flex justify-between text-base font-medium text-espresso">
                <span>Subtotal</span>
                <span className="font-display text-lg italic">{formattedTotal()}</span>
              </div>
              <p className="text-[11px] text-taupe text-center">
                Taxes and shipping calculated at official Shopify checkout.
              </p>

              {error && (
                <div className="rounded-xl bg-red-50 p-2.5 text-xs text-red-700 border border-red-200">
                  {error}
                </div>
              )}

              <button
                type="button"
                disabled={submitting}
                onClick={handleCheckout}
                className="w-full rounded-full bg-clay py-3.5 text-sm font-medium text-ivory shadow transition-all hover:bg-clay-dark hover:shadow-md disabled:opacity-60 active:scale-[0.99]"
              >
                {submitting ? "Taking you to Shopify…" : "Checkout with Shopify →"}
              </button>

              <div className="flex items-center justify-between text-xs text-taupe pt-1">
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="underline hover:text-espresso transition-colors text-center w-full"
                >
                  View full cart details
                </Link>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2 text-[10px] text-taupe/80">
                <span>🔒 256-Bit SSL Encrypted</span>
                <span>•</span>
                <span>Shop Pay • Apple Pay • Google Pay • Cards</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
