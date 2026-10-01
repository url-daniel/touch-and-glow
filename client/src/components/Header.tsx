import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCartStore } from "@/lib/cart-store";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());
  const openCart = useCartStore((s) => s.openCart);
  const location = useLocation();

  const isHome = location.pathname === "/";

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-espresso text-ivory text-[11px] py-2 px-4 text-center tracking-wider font-medium">
        <span>✨ COMPLIMENTARY EXPRESS SHIPPING ON ORDERS OVER $100 • USE CODE </span>
        <strong className="text-peach underline font-semibold">GLOW15</strong>
        <span> FOR 15% OFF</span>
      </div>

      <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur-md border-b border-blush/60 transition-colors">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:py-5">
          {/* Logo */}
          <Link to="/" className="font-display text-2xl md:text-3xl italic text-espresso tracking-tight hover:opacity-90 transition-opacity">
            Touch And GLOW
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-wider font-medium text-taupe">
            <a href="/#shop" className="hover:text-espresso transition-colors">
              Collection
            </a>
            <a href="/#ritual" className="hover:text-espresso transition-colors">
              The Ritual
            </a>
            <a href="/#ingredients" className="hover:text-espresso transition-colors">
              Ingredients
            </a>
            <a href="/#reviews" className="hover:text-espresso transition-colors">
              Reviews
            </a>
            <a href="/#faq" className="hover:text-espresso transition-colors">
              FAQ
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openCart}
              className="relative flex items-center gap-2 rounded-full border border-espresso/15 bg-ivory/80 px-4 py-2 text-xs font-medium text-espresso shadow-sm transition-all hover:border-clay hover:text-clay-dark hover:shadow active:scale-95"
              aria-label="Open shopping bag"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <span>Bag</span>
              {totalItems > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-clay text-[10px] font-bold text-ivory animate-scaleIn">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden rounded-full p-2 text-espresso hover:bg-sand/40"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-blush bg-ivory px-6 py-6 space-y-4 text-sm font-medium text-taupe animate-fadeIn">
            <a
              href="/#shop"
              onClick={() => setMobileMenuOpen(false)}
              className="block hover:text-espresso py-1"
            >
              Collection
            </a>
            <a
              href="/#ritual"
              onClick={() => setMobileMenuOpen(false)}
              className="block hover:text-espresso py-1"
            >
              The Glow Ritual
            </a>
            <a
              href="/#ingredients"
              onClick={() => setMobileMenuOpen(false)}
              className="block hover:text-espresso py-1"
            >
              Botanical Ingredients
            </a>
            <a
              href="/#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="block hover:text-espresso py-1"
            >
              Customer Reviews
            </a>
            <a
              href="/#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block hover:text-espresso py-1"
            >
              FAQ
            </a>
            <Link
              to="/checkout"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-clay-dark font-semibold pt-2 border-t border-blush/60"
            >
              View Full Shopping Bag ({totalItems})
            </Link>
          </div>
        )}
      </header>
    </>
  );
}
