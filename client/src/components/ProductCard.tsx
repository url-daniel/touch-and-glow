import { useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "@/types";
import { useCartStore } from "@/lib/cart-store";

export default function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const setQuickViewProduct = useCartStore((s) => s.setQuickViewProduct);

  const isOutOfStock = !product.availableForSale || product.stock === 0;
  const primaryImage = product.images[0] || product.imageUrl;
  const secondaryImage = product.images[1] || primaryImage;

  return (
    <div
      className="group relative flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-blush shadow-sm transition-all duration-300 group-hover:shadow-md">
        <Link to={`/products/${product.slug}`} className="block h-full w-full">
          {primaryImage ? (
            <img
              src={isHovered && secondaryImage !== primaryImage ? secondaryImage : primaryImage}
              alt={product.name}
              className="h-full w-full object-cover object-center transition-all duration-500 ease-out group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-display text-sm italic text-taupe">
              {product.name}
            </div>
          )}
        </Link>

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5 pointer-events-none">
          {isOutOfStock ? (
            <span className="rounded-full bg-ivory/95 px-3 py-1 text-[11px] font-semibold text-taupe shadow-sm backdrop-blur-sm">
              Sold out
            </span>
          ) : (
            <span className="rounded-full bg-espresso/80 text-ivory px-3 py-1 text-[10px] font-semibold tracking-wider uppercase shadow-sm backdrop-blur-sm">
              In Stock
            </span>
          )}
        </div>

        {/* Quick View Button (hover reveal) */}
        <div className="absolute inset-x-3 bottom-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={() => setQuickViewProduct(product)}
            className="flex-1 rounded-full bg-ivory/90 backdrop-blur-md py-2.5 text-xs font-semibold text-espresso shadow hover:bg-ivory hover:text-clay-dark transition-all active:scale-95"
          >
            Quick View
          </button>
        </div>
      </div>

      {/* Info & Add to Cart */}
      <div className="mt-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <Link
            to={`/products/${product.slug}`}
            className="font-display text-base md:text-lg text-espresso hover:text-clay transition-colors line-clamp-1"
          >
            {product.name}
          </Link>
          <p className="mt-1 text-sm font-semibold text-espresso/90">{product.priceFormatted}</p>
        </div>

        <button
          type="button"
          disabled={isOutOfStock}
          onClick={() =>
            addItem({
              productId: product.id,
              variantId: product.defaultVariantId || product.id,
              name: product.name,
              price: product.price,
              priceFormatted: product.priceFormatted,
              currencyCode: product.currencyCode,
              quantity: 1,
              imageUrl: primaryImage,
              stock: product.stock
            })
          }
          className="w-full rounded-full border border-espresso/20 bg-ivory py-2.5 text-xs font-medium text-espresso shadow-sm transition-all hover:bg-clay hover:border-clay hover:text-ivory hover:shadow active:scale-98 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isOutOfStock ? "Sold out" : "+ Add to Bag"}
        </button>
      </div>
    </div>
  );
}
