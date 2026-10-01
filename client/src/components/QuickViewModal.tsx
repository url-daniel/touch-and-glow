import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "@/lib/cart-store";
import type { ShopifyVariant } from "@/types";
import { formatPrice } from "@/types";
import AddToCartButton from "./AddToCartButton";

export default function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct } = useCartStore();
  const [selectedVariant, setSelectedVariant] = useState<ShopifyVariant | null>(null);
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedVariant(quickViewProduct.variants[0] || null);
      setActiveImage(quickViewProduct.images[0] || quickViewProduct.imageUrl);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const currentPrice = selectedVariant
    ? parseFloat(selectedVariant.price.amount)
    : quickViewProduct.price;

  const currentCurrency = selectedVariant
    ? selectedVariant.price.currencyCode
    : quickViewProduct.currencyCode;

  const formattedPrice = formatPrice(currentPrice, currentCurrency);
  const isAvailable = selectedVariant ? selectedVariant.availableForSale : quickViewProduct.availableForSale;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => setQuickViewProduct(null)}
        className="fixed inset-0 bg-espresso/50 backdrop-blur-sm transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] bg-ivory p-6 md:p-8 shadow-2xl transition-all">
          {/* Close button */}
          <button
            type="button"
            onClick={() => setQuickViewProduct(null)}
            className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-sand/60 text-taupe hover:bg-sand hover:text-espresso transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Gallery */}
            <div className="flex flex-col gap-3">
              <div className="aspect-square overflow-hidden rounded-2xl bg-blush">
                <img
                  src={activeImage}
                  alt={quickViewProduct.name}
                  className="h-full w-full object-cover object-center"
                />
              </div>

              {quickViewProduct.images && quickViewProduct.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {quickViewProduct.images.slice(0, 4).map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImage(img)}
                      className={`relative aspect-square w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                        activeImage === img ? "border-clay ring-1 ring-clay" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-widest font-medium text-clay-dark">
                  Touch And GLOW
                </span>
                <h2 className="mt-1 font-display text-2xl md:text-3xl italic text-espresso">
                  {quickViewProduct.name}
                </h2>
                <p className="mt-2 text-xl font-medium text-espresso">{formattedPrice}</p>

                {/* Variants */}
                {quickViewProduct.variants && quickViewProduct.variants.length > 1 && (
                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-taupe mb-2">
                      Option: <span className="text-espresso font-normal">{selectedVariant?.title}</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {quickViewProduct.variants.map((v) => {
                        const isSelected = selectedVariant?.id === v.id;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            disabled={!v.availableForSale}
                            onClick={() => setSelectedVariant(v)}
                            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                              isSelected
                                ? "bg-espresso text-ivory"
                                : "border border-espresso/20 bg-ivory text-espresso hover:border-espresso/40"
                            } ${!v.availableForSale ? "opacity-40 cursor-not-allowed line-through" : ""}`}
                          >
                            {v.title}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <p className="mt-4 text-xs md:text-sm text-espresso/80 line-clamp-3 leading-relaxed">
                  {quickViewProduct.description}
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs text-taupe">
                  <span className={`inline-block h-2 w-2 rounded-full ${isAvailable ? "bg-emerald-500" : "bg-stone-300"}`} />
                  <span>{isAvailable ? "In stock & ready to ship" : "Currently out of stock"}</span>
                </div>
              </div>

              <div className="mt-6 border-t border-blush pt-5">
                <AddToCartButton
                  productId={quickViewProduct.id}
                  variantId={selectedVariant?.id || quickViewProduct.defaultVariantId}
                  name={quickViewProduct.name}
                  variantTitle={selectedVariant?.title !== "Default Title" ? selectedVariant?.title : undefined}
                  price={currentPrice}
                  priceFormatted={formattedPrice}
                  currencyCode={currentCurrency}
                  imageUrl={activeImage || quickViewProduct.imageUrl}
                  stock={selectedVariant?.quantityAvailable ?? quickViewProduct.stock}
                  availableForSale={isAvailable}
                  showBuyNow={true}
                />

                <div className="mt-4 text-center">
                  <Link
                    to={`/products/${quickViewProduct.slug}`}
                    onClick={() => setQuickViewProduct(null)}
                    className="text-xs font-medium text-clay-dark underline hover:text-clay"
                  >
                    View full product specifications & reviews →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
