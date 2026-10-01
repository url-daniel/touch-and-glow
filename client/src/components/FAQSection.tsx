import { useState } from "react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does checkout and payment processing work?",
      a: "Our website is directly integrated with Shopify's global checkout engine. When you proceed to checkout, you are redirected to official Shopify 256-bit SSL encrypted pages where you can pay securely using Shop Pay, Apple Pay, Google Pay, Visa, Mastercard, or your preferred local gateway."
    },
    {
      q: "How long does shipping take and do you offer free shipping?",
      a: "Yes! We offer complimentary express worldwide shipping on all orders over $100 (or equivalent local currency). Domestic orders are typically delivered within 2–4 business days, and international orders arrive in 5–8 business days with door-to-door tracking."
    },
    {
      q: "Are Touch And GLOW formulas safe for sensitive and breakout-prone skin?",
      a: "Absolutely. All formulas are rigorously tested, non-comedogenic (won't clog pores), and formulated without synthetic dyes, parabens, phthalates, or artificial perfumes that trigger flare-ups."
    },
    {
      q: "What is your 30-day glow guarantee?",
      a: "We believe in our botanical elixirs unconditionally. If you don't notice visibly softer, healthier, and more radiant skin within 30 days of daily use, simply contact our support team for a full, hassle-free refund."
    },
    {
      q: "How should I store cold-pressed botanical skincare?",
      a: "To preserve the maximum bio-activity of cold-pressed oils and butters, store your amber glass bottles in a cool, dry place away from direct sunlight."
    }
  ];

  return (
    <section id="faq" className="py-20 md:py-28 bg-ivory border-t border-blush/60">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-clay-dark">
            Got Questions?
          </span>
          <h2 className="mt-2 font-display text-3xl md:text-5xl italic text-espresso">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm text-taupe">
            Everything you need to know about our formulas, shipping, and Shopify checkout.
          </p>
        </div>

        <div className="mt-12 divide-y divide-blush/80 rounded-3xl border border-blush/80 bg-cream/30 p-6 md:p-8">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="py-4 first:pt-0 last:pb-0">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between text-left text-sm md:text-base font-medium text-espresso hover:text-clay-dark transition-colors py-2"
                >
                  <span className="font-display italic text-base md:text-lg">{faq.q}</span>
                  <span className="ml-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-espresso/15 text-xs text-taupe transition-transform duration-300">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className="mt-2 text-xs md:text-sm text-taupe leading-relaxed pr-6 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
