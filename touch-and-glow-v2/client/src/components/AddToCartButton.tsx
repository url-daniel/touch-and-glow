import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";

type Props = {
  productId: string;
  name: string;
  priceKobo: number;
  imageUrl: string;
  stock: number;
};

export default function AddToCartButton({ productId, name, priceKobo, imageUrl, stock }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  if (stock === 0) {
    return (
      <button
        disabled
        className="mt-8 w-fit cursor-not-allowed rounded-full bg-espresso/10 px-7 py-3 text-sm text-taupe"
      >
        Sold out
      </button>
    );
  }

  return (
    <div className="mt-8 flex items-center gap-4">
      <div className="flex items-center rounded-full border border-espresso/15">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="px-4 py-2 text-espresso"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="w-6 text-center text-sm">{quantity}</span>
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
          className="px-4 py-2 text-espresso"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <button
        type="button"
        onClick={() => {
          addItem({ productId, name, priceKobo, quantity, imageUrl, stock });
          setAdded(true);
          setTimeout(() => setAdded(false), 1500);
        }}
        className="rounded-full bg-clay px-7 py-3 text-sm font-medium text-ivory transition-colors hover:bg-clay-dark"
      >
        {added ? "Added" : "Add to cart"}
      </button>
    </div>
  );
}
