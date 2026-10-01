import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { createShopifyCheckout, isShopifyConfigured } from "@/lib/shopify";

type Props = {
  productId: string;
  variantId?: string;
  name: string;
  variantTitle?: string;
  price: number;
  priceFormatted: string;
  currencyCode?: string;
  imageUrl: string;
  stock: number;
  availableForSale?: boolean;
  showBuyNow?: boolean;
  priceKobo?: number; // legacy backward compatibility
};

export default function AddToCartButton({
  productId,
  variantId,
  name,
  variantTitle,
  price,
  priceFormatted,
  currencyCode = "NGN",
  imageUrl,
  stock,
  availableForSale = true,
  showBuyNow = false
}: Props) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [buyNowError, setBuyNowError] = useState<string | null>(null);

  const addItem = useCartStore((s) => s.addItem);
  const targetVariantId = variantId || productId;
  const isOutOfStock = !availableForSale || stock === 0;

  if (isOutOfStock) {
    return (
      <div className="mt-8">
        <button
          disabled
          className="w-full sm:w-fit cursor-not-allowed rounded-full bg-espresso/10 px-8 py-3.5 text-sm font-medium text-taupe"
        >
          Sold out
        </button>
      </div>
    );
  }

  const effectiveStock = stock > 0 ? stock : 99;

  async function handleBuyNow() {
    setBuyNowError(null);
    setCheckingOut(true);

    try {
      if (!isShopifyConfigured()) {
        // Fallback for demo mode
        window.location.href = "/checkout";
        return;
      }

      const { checkoutUrl } = await createShopifyCheckout([
        {
          variantId: targetVariantId,
          quantity
        }
      ]);

      window.location.href = checkoutUrl;
    } catch (err) {
      setBuyNowError(err instanceof Error ? err.message : "Failed to initialize checkout");
      setCheckingOut(false);
    }
  }

  return (
    <div className="mt-8 flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Quantity selector */}
        <div className="flex items-center rounded-full border border-espresso/20 bg-ivory">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-4 py-2.5 text-espresso hover:text-clay transition-colors"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-8 text-center text-sm font-medium text-espresso">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(effectiveStock, q + 1))}
            className="px-4 py-2.5 text-espresso hover:text-clay transition-colors"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        {/* Add to Cart button */}
        <button
          type="button"
          onClick={() => {
            addItem({
              productId,
              variantId: targetVariantId,
              name,
              variantTitle,
              price,
              priceFormatted,
              currencyCode,
              quantity,
              imageUrl,
              stock: effectiveStock
            });
            setAdded(true);
            setTimeout(() => setAdded(false), 1800);
          }}
          className="flex-1 rounded-full border border-clay bg-clay px-8 py-3.5 text-sm font-medium text-ivory shadow-sm transition-all hover:bg-clay-dark hover:shadow active:scale-[0.98]"
        >
          {added ? "✓ Added to cart" : "Add to cart"}
        </button>

        {/* Optional 1-Click Buy Now with Shopify */}
        {showBuyNow && (
          <button
            type="button"
            disabled={checkingOut}
            onClick={handleBuyNow}
            className="w-full sm:w-auto rounded-full border border-espresso/25 bg-ivory px-8 py-3.5 text-sm font-medium text-espresso shadow-sm transition-all hover:bg-sand/40 active:scale-[0.98] disabled:opacity-60"
          >
            {checkingOut ? "Redirecting to Shopify…" : "Buy with Shopify"}
          </button>
        )}
      </div>

      {buyNowError && <p className="text-xs text-red-600">{buyNowError}</p>}
    </div>
  );
}
