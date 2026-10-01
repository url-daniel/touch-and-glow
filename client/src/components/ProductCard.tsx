import { Link } from "react-router-dom";
import type { Product } from "@/types";
import { useCartStore } from "@/lib/cart-store";

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const isOutOfStock = !product.availableForSale || product.stock === 0;

  return (
    <div className="group flex flex-col">
      <Link
        to={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden rounded-3xl bg-blush transition-transform duration-300 group-hover:scale-[1.02]"
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-opacity duration-300"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-sm italic text-taupe">
            {product.name}
          </div>
        )}

        {isOutOfStock && (
          <span className="absolute left-4 top-4 rounded-full bg-ivory/90 backdrop-blur-sm px-3 py-1 text-xs font-medium text-taupe shadow-sm">
            Sold out
          </span>
        )}
      </Link>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <Link
            to={`/products/${product.slug}`}
            className="font-display text-lg text-espresso hover:text-clay transition-colors"
          >
            {product.name}
          </Link>
          <p className="mt-1 text-sm font-medium text-taupe">{product.priceFormatted}</p>
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
              imageUrl: product.imageUrl,
              stock: product.stock
            })
          }
          className="mt-1 shrink-0 rounded-full border border-espresso/15 px-4 py-2 text-xs font-medium text-espresso transition-colors hover:border-clay hover:bg-clay hover:text-ivory disabled:cursor-not-allowed disabled:opacity-40"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
