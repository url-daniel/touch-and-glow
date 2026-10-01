import { useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "@/lib/cart-store";
import { createShopifyCheckout, isShopifyConfigured } from "@/lib/shopify";
import { formatPrice } from "@/types";

export default function CheckoutPage() {
  const { lines, setQuantity, removeItem, formattedTotal, totalAmount, currencyCode } = useCartStore();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasDemoItems = lines.some((l) => l.variantId?.includes("tag-demo"));

  function handleClearDemoItems() {
    lines.forEach((l) => {
      if (l.variantId?.includes("tag-demo") || l.productId?.includes("tag-demo")) {
        removeItem(l.variantId || l.productId);
      }
    });
    setError(null);
  }

  async function handleShopifyCheckout() {
    setError(null);
    setSubmitting(true);

    try {
      if (!isShopifyConfigured()) {
        throw new Error(
          "Shopify Storefront API credentials are required to complete live checkout. Please add VITE_SHOPIFY_STORE_DOMAIN and VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN to your environment."
        );
      }

      // Map lines for Shopify Storefront API cartCreate mutation
      const checkoutItems = lines.map((l) => ({
        variantId: l.variantId || l.productId,
        quantity: l.quantity
      }));

      const { checkoutUrl } = await createShopifyCheckout(checkoutItems);

      // Redirect directly to Shopify's secure hosted checkout
      window.location.href = checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong while generating checkout.");
      setSubmitting(false);
    }
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-6 py-28 text-center">
        <h1 className="font-display text-3xl italic text-espresso">Your bag is empty</h1>
        <p className="mt-3 text-taupe text-sm">Discover our skin-revitalizing botanical collection.</p>
        <Link
          to="/#shop"
          className="mt-8 inline-block rounded-full bg-clay px-8 py-3 text-sm font-medium text-ivory transition-colors hover:bg-clay-dark"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <div className="flex items-center justify-between border-b border-blush pb-6">
        <h1 className="font-display text-3xl md:text-4xl italic text-espresso">Shopping Bag</h1>
        <Link to="/#shop" className="text-xs uppercase tracking-wider font-medium text-clay-dark underline">
          Continue shopping
        </Link>
      </div>

      {hasDemoItems && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
          <div>
            <strong>Preview Demo Items in Bag:</strong> You have sample products in your cart from before connecting your live Shopify store. Clear demo items to check out with your live Shopify store.
          </div>
          <button
            type="button"
            onClick={handleClearDemoItems}
            className="rounded-full bg-amber-800 px-4 py-1.5 font-medium text-amber-50 hover:bg-amber-900 transition-colors shadow-sm"
          >
            Clear Demo Items
          </button>
        </div>
      )}

      <div className="mt-8 grid gap-12 lg:grid-cols-12">
        {/* Cart items list */}
        <div className="lg:col-span-7 divide-y divide-blush">
          {lines.map((line) => {
            const itemKey = line.variantId || line.productId;
            const unitPrice =
              typeof line.price === "number"
                ? line.price
                : line.priceKobo
                ? line.priceKobo / 100
                : 0;
            const lineTotal = unitPrice * line.quantity;

            return (
              <div key={itemKey} className="flex gap-4 py-6">
                {/* Thumbnail */}
                <div className="aspect-square w-20 h-20 shrink-0 overflow-hidden rounded-2xl bg-blush">
                  {line.imageUrl ? (
                    <img src={line.imageUrl} alt={line.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-display text-xs italic text-taupe">
                      {line.name}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-display text-base font-medium text-espresso">{line.name}</h3>
                      <button
                        type="button"
                        onClick={() => removeItem(itemKey)}
                        className="text-xs text-taupe hover:text-red-600 transition-colors"
                        aria-label="Remove item"
                      >
                        Remove
                      </button>
                    </div>
                    {line.variantTitle && (
                      <p className="text-xs text-taupe mt-0.5">{line.variantTitle}</p>
                    )}
                    <p className="text-xs text-taupe mt-1">
                      {formatPrice(unitPrice, line.currencyCode || currencyCode())} each
                    </p>
                  </div>

                  {/* Quantity and Line Total */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-espresso/15 bg-ivory">
                      <button
                        type="button"
                        onClick={() => setQuantity(itemKey, Math.max(1, line.quantity - 1))}
                        className="px-3 py-1 text-xs text-espresso hover:text-clay"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-xs font-medium text-espresso">{line.quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(itemKey, line.quantity + 1)}
                        className="px-3 py-1 text-xs text-espresso hover:text-clay"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-sm font-semibold text-espresso">
                      {formatPrice(lineTotal, line.currencyCode || currencyCode())}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary & Shopify Checkout */}
        <div className="lg:col-span-5">
          <div className="rounded-3xl border border-blush bg-sand/20 p-6 md:p-8">
            <h2 className="font-display text-xl italic text-espresso">Order Summary</h2>

            <div className="mt-6 space-y-3 text-sm text-taupe border-b border-blush pb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-espresso">{formattedTotal()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Duties</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-baseline font-display text-lg text-espresso">
              <span>Estimated Total</span>
              <span className="text-2xl italic font-semibold">{formattedTotal()}</span>
            </div>

            {error && (
              <div className="mt-4 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
                {error}
              </div>
            )}

            <button
              type="button"
              disabled={submitting}
              onClick={handleShopifyCheckout}
              className="mt-6 w-full rounded-full bg-clay py-4 text-sm font-medium text-ivory shadow transition-all hover:bg-clay-dark hover:shadow-md disabled:opacity-60 active:scale-[0.99]"
            >
              {submitting ? "Preparing Shopify Checkout…" : "Proceed to Shopify Checkout →"}
            </button>

            <div className="mt-6 space-y-2 text-center text-xs text-taupe">
              <p className="flex items-center justify-center gap-1.5 font-medium text-espresso">
                <span>🔒</span> Powered by Shopify Secure Checkout
              </p>
              <p>Supports Credit Cards, Apple Pay, Google Pay, Shop Pay, and localized payment options.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
