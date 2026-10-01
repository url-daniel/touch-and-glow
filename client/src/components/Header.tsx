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
      <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-md border-b border-blush/60 transition-colors">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5 md:py-4">
          {/* Enhanced Luxury Logo Lockup */}
          <Link to="/" className="group flex items-center gap-3 tracking-tight">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-clay via-clay to-peach text-ivory shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md">
              <span className="font-display italic font-semibold text-base tracking-tighter">TG</span>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-peach border-2 border-ivory" />
            </span>
            <div className="flex flex-col">
              <span className="font-display text-2xl md:text-3xl italic leading-none text-espresso tracking-tight transition-colors group-hover:text-clay-dark">
                Touch <span className="font-normal not-italic text-clay text-xl md:text-2xl font-display">&</span> GLOW
              </span>
              <span className="text-[9px] uppercase tracking-[0.28em] font-semibold text-taupe/80 mt-0.5">
                Botanical Atelier
              </span>
            </div>
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
