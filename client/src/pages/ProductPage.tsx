import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Product, ShopifyVariant } from "@/types";
import { formatPrice } from "@/types";
import { fetchShopifyProductBySlug } from "@/lib/shopify";
import AddToCartButton from "@/components/AddToCartButton";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ShopifyVariant | null>(null);
  const [activeImage, setActiveImage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const currentSlug = slug;
    let active = true;

    async function load(productSlug: string) {
      try {
        setLoading(true);
        const data = await fetchShopifyProductBySlug(productSlug);
        if (!active) return;
        if (!data) {
          setNotFound(true);
        } else {
          setProduct(data);
          const initialVariant = data.variants[0] || null;
          setSelectedVariant(initialVariant);
          setActiveImage(data.images[0] || data.imageUrl);
          setNotFound(false);
        }
      } catch {
        if (active) setNotFound(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    load(currentSlug);

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-2 animate-pulse">
          <div className="aspect-square rounded-[2rem] bg-blush/60" />
          <div className="flex flex-col justify-center space-y-4">
            <div className="h-8 w-2/3 rounded bg-blush/60" />
            <div className="h-6 w-1/4 rounded bg-blush/40" />
            <div className="h-24 w-full rounded bg-blush/30" />
            <div className="h-12 w-1/2 rounded-full bg-blush/50" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl italic text-espresso">Product not found</h1>
        <p className="mt-4 text-taupe">The product you're looking for might have been moved or removed.</p>
        <Link to="/#shop" className="mt-6 inline-block text-sm font-medium text-clay-dark underline">
          ← Back to the collection
        </Link>
      </div>
    );
  }

  const currentPrice = selectedVariant
    ? parseFloat(selectedVariant.price.amount)
    : product.price;

  const currentCurrency = selectedVariant
    ? selectedVariant.price.currencyCode
    : product.currencyCode;

  const formattedCurrentPrice = formatPrice(currentPrice, currentCurrency);
  const isAvailable = selectedVariant ? selectedVariant.availableForSale : product.availableForSale;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 md:py-20">
      <Link
        to="/#shop"
        className="mb-8 inline-flex items-center text-xs uppercase tracking-wider font-medium text-taupe hover:text-espresso transition-colors"
      >
        ← Back to collection
      </Link>

      <div className="grid gap-12 lg:gap-16 md:grid-cols-2">
        {/* Gallery */}
        <div className="flex flex-col gap-4">
          <div className="aspect-square overflow-hidden rounded-[2rem] bg-blush shadow-sm">
            {activeImage ? (
              <img
                src={activeImage}
                alt={product.name}
                className="h-full w-full object-cover object-center transition-all duration-300"
              />
            ) : (
              <div className="flex h-full items-center justify-center font-display text-lg italic text-taupe">
                {product.name}
              </div>
            )}
          </div>

          {/* Thumbnail row if multiple images exist */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  className={`relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                    activeImage === img ? "border-clay ring-2 ring-clay/20" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`${product.name} thumbnail ${idx + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-center">
          <span className="text-xs uppercase tracking-widest font-medium text-clay-dark">
            Touch And GLOW Skincare
          </span>
          <h1 className="mt-2 font-display text-4xl lg:text-5xl italic text-espresso">{product.name}</h1>
          <p className="mt-4 text-2xl font-medium text-espresso/90">{formattedCurrentPrice}</p>

          {/* Variant Selector */}
          {product.variants && product.variants.length > 1 && (
            <div className="mt-8">
              <label className="block text-xs font-semibold uppercase tracking-wider text-taupe mb-3">
                Option: <span className="text-espresso font-normal">{selectedVariant?.title}</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      disabled={!v.availableForSale}
                      onClick={() => {
                        setSelectedVariant(v);
                      }}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                        isSelected
                          ? "bg-espresso text-ivory shadow-sm"
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

          {/* Description */}
          <div className="mt-6 border-t border-blush pt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-taupe mb-2">Description</p>
            <p className="leading-relaxed text-espresso/80 text-sm md:text-base">
              {product.description}
            </p>
          </div>

          <div className="mt-6 flex items-center gap-2 text-sm text-taupe">
            <span className={`inline-block h-2 w-2 rounded-full ${isAvailable ? "bg-emerald-500" : "bg-stone-300"}`} />
            <span>{isAvailable ? "In stock & ready to ship" : "Currently out of stock"}</span>
          </div>

          <AddToCartButton
            productId={product.id}
            variantId={selectedVariant?.id || product.defaultVariantId}
            name={product.name}
            variantTitle={selectedVariant?.title !== "Default Title" ? selectedVariant?.title : undefined}
            price={currentPrice}
            priceFormatted={formattedCurrentPrice}
            currencyCode={currentCurrency}
            imageUrl={activeImage || product.imageUrl}
            stock={selectedVariant?.quantityAvailable ?? product.stock}
            availableForSale={isAvailable}
            showBuyNow={true}
          />

          {/* Shopify reassurance perks */}
          <div className="mt-10 grid grid-cols-2 gap-4 border-t border-blush pt-6 text-xs text-taupe">
            <div>
              <p className="font-semibold text-espresso">Official Shopify Checkout</p>
              <p className="mt-0.5">Encrypted with 256-bit SSL security.</p>
            </div>
            <div>
              <p className="font-semibold text-espresso">Fast Fulfillment</p>
              <p className="mt-0.5">Dispatched within 24-48 business hours.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
