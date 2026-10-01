import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-blush bg-cream pt-16 pb-12 text-espresso">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 pb-12 border-b border-blush/80">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <Link to="/" className="font-display text-2xl italic tracking-tight text-espresso">
              Touch And GLOW
            </Link>
            <p className="text-xs text-taupe leading-relaxed">
              Small-batch cold-pressed body oils and nutrient-dense botanical elixirs. Crafted with slow care to honor your natural barrier.
            </p>
            <div className="flex items-center gap-3 pt-2 text-taupe">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-espresso/15 text-xs hover:border-clay hover:text-clay cursor-pointer transition-colors">
                IG
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-espresso/15 text-xs hover:border-clay hover:text-clay cursor-pointer transition-colors">
                TT
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-espresso/15 text-xs hover:border-clay hover:text-clay cursor-pointer transition-colors">
                PT
              </span>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-espresso">
              Navigation
            </p>
            <ul className="mt-4 space-y-2.5 text-xs text-taupe">
              <li>
                <a href="/#shop" className="hover:text-espresso transition-colors">
                  The Collection
                </a>
              </li>
              <li>
                <a href="/#ritual" className="hover:text-espresso transition-colors">
                  The Glow Ritual
                </a>
              </li>
              <li>
                <a href="/#ingredients" className="hover:text-espresso transition-colors">
                  Botanical Science
                </a>
              </li>
              <li>
                <a href="/#reviews" className="hover:text-espresso transition-colors">
                  Verified Reviews
                </a>
              </li>
              <li>
                <a href="/#faq" className="hover:text-espresso transition-colors">
                  FAQ & Help
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-espresso">
              Customer Care
            </p>
            <ul className="mt-4 space-y-2.5 text-xs text-taupe">
              <li>
                <span className="hover:text-espresso cursor-pointer transition-colors">
                  Complimentary Shipping Over $100
                </span>
              </li>
              <li>
                <span className="hover:text-espresso cursor-pointer transition-colors">
                  30-Day Glow Guarantee
                </span>
              </li>
              <li>
                <span className="hover:text-espresso cursor-pointer transition-colors">
                  Track Your Shipment
                </span>
              </li>
              <li>
                <Link to="/checkout" className="hover:text-espresso transition-colors">
                  Shopping Bag & Checkout
                </Link>
              </li>
              <li>
                <span className="hover:text-espresso cursor-pointer transition-colors">
                  care@touchandglow.com
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Shopify Secure Payments */}
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-espresso">
              Shopify Secure Checkout
            </p>
            <p className="text-xs text-taupe leading-relaxed">
              All transactions are encrypted with 256-bit SSL protocols powered by Shopify's global edge network.
            </p>
            <div className="flex flex-wrap gap-2 text-[10px] font-semibold text-taupe">
              <span className="rounded-md border border-espresso/15 bg-ivory px-2.5 py-1">Shop Pay</span>
              <span className="rounded-md border border-espresso/15 bg-ivory px-2.5 py-1">Apple Pay</span>
              <span className="rounded-md border border-espresso/15 bg-ivory px-2.5 py-1">Google Pay</span>
              <span className="rounded-md border border-espresso/15 bg-ivory px-2.5 py-1">Visa</span>
              <span className="rounded-md border border-espresso/15 bg-ivory px-2.5 py-1">Mastercard</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-taupe">
          <p>© {new Date().getFullYear()} Touch And GLOW. Small-batch botanical body care.</p>
          <div className="flex gap-6">
            <span className="hover:text-espresso cursor-pointer">Privacy Policy</span>
            <span className="hover:text-espresso cursor-pointer">Terms of Service</span>
            <span className="hover:text-espresso cursor-pointer">Shipping & Returns</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
