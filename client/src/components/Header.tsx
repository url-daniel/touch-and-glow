import { Link } from "react-router-dom";
import { useCartStore } from "@/lib/cart-store";

export default function Header() {
  const totalItems = useCartStore((s) => s.totalItems());

  return (
    <header className="border-b border-blush">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="font-display text-2xl italic text-espresso">
          Touch And GLOW
        </Link>

        <nav className="flex items-center gap-8 text-sm text-taupe">
          <Link to="/#shop" className="hover:text-espresso">
            Shop
          </Link>
          <Link
            to="/checkout"
            className="relative rounded-full border border-espresso/15 px-4 py-2 text-espresso hover:border-clay hover:text-clay-dark"
          >
            Cart
            {totalItems > 0 && (
              <span className="ml-2 rounded-full bg-clay px-2 py-0.5 text-xs text-ivory">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
