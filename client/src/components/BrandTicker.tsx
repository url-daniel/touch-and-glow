export default function BrandTicker() {
  const items = [
    "COLD-PRESSED BOTANICALS",
    "DERMATOLOGIST TESTED",
    "100% CLEAN & CRUELTY-FREE",
    "SMALL-BATCH HANDCRAFTED",
    "CARBON NEUTRAL PACKAGING",
    "FREE EXPRESS SHIPPING OVER $100",
    "POWERED BY SHOPIFY SECURE CHECKOUT",
    "ETHICALLY SOURCED ACTIVES"
  ];

  return (
    <div className="overflow-hidden border-y border-blush bg-sand/30 py-4 select-none">
      <div className="animate-marquee flex items-center gap-8 whitespace-nowrap text-xs font-semibold uppercase tracking-widest text-taupe">
        {items.concat(items).map((item, index) => (
          <div key={index} className="flex items-center gap-8">
            <span className="hover:text-espresso transition-colors">{item}</span>
            <span className="text-peach text-sm">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
