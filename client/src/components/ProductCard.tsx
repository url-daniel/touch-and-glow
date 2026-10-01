import { Link } from "react-router-dom";
import type { Product } from "@/types";
import { nairaFromKobo } from "@/types";
import { useCartStore } from "@/lib/cart-store";

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const outOfStock = product.stock === 0;

  return (
    <div className="flex flex-col">
      <Link
        to={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden rounded-3xl bg-blush"
      >
        <div className="flex h-full items-center justify-center font-display text-sm italic text-taupe">
          {product.name}
        </div>
        {outOfStock && (
          <span className="absolute left-4 top-4 rounded-full bg-ivory px-3 py-1 text-xs text-taupe">
            Sold out
          </span>
        )}
      </Link>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <Link to={`/products/${product.slug}`} className="font-display text-lg text-espresso">
            {product.name}
          </Link>
          <p className="mt-1 text-sm text-taupe">{nairaFromKobo(product.priceKobo)}</p>
        </div>

        <button
          type="button"
          disabled={outOfStock}
          onClick={() =>
            addItem({
              productId: product.id,
              name: product.name,
              priceKobo: product.priceKobo,
              quantity: 1,
              imageUrl: product.imageUrl,
              stock: product.stock
            })
          }
          className="mt-1 shrink-0 rounded-full border border-espresso/15 px-4 py-2 text-xs text-espresso transition-colors hover:border-clay hover:text-clay-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
