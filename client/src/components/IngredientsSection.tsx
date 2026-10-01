import { useState } from "react";

export default function IngredientsSection() {
  const [activeTab, setActiveTab] = useState(0);

  const ingredients = [
    {
      name: "Cold-Pressed Rosehip Seed",
      origin: "Patagonia, Chile",
      benefits: "High in trans-retinoic acid (natural Vitamin A) and omega 3, 6, and 9. Clinically supports dermal regeneration, fades post-inflammatory erythema, and softens fine expression lines.",
      icon: "🌹",
      activeMolecule: "Pro-Vitamin A & Linoleic Acid"
    },
    {
      name: "Plant-Derived Squalane",
      origin: "Spanish Olives",
      benefits: "A biomimetic lipid that flawlessly mirrors human sebum. Penetrates rapidly without clogging pores, locking in moisture while leaving a featherlight, velvety touch.",
      icon: "🫒",
      activeMolecule: "Hydrogenated Squalene"
    },
    {
      name: "Purified Niacinamide (10%)",
      origin: "Bio-Fermentation",
      benefits: "Vitamin B3 works on cellular communication to regulate sebum overproduction, visibly tighten enlarged pores, and even out uneven hyperpigmentation.",
      icon: "✨",
      activeMolecule: "Nicotinamide (Vitamin B3)"
    },
    {
      name: "5-Ceramide NP Complex",
      origin: "Bio-Identical Yeast Lipid",
      benefits: "Reinforces and seals micro-tears in compromised lipid barriers. Prevents trans-epidermal water loss (TEWL) and defends against modern environmental stressors.",
      icon: "🛡️",
      activeMolecule: "Ceramide NP, AP, EOP, Phytosphingosine"
    }
  ];

  return (
    <section id="ingredients" className="py-20 md:py-28 bg-ivory">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          {/* Left Column: Story */}
          <div className="lg:col-span-5">
            <span className="text-xs font-semibold uppercase tracking-widest text-clay-dark">
              Botanical Chemistry
            </span>
            <h2 className="mt-2 font-display text-3xl md:text-5xl italic text-espresso">
              Cold-Pressed. Unadulterated.
            </h2>
            <p className="mt-4 text-sm md:text-base text-taupe leading-relaxed">
              Industrial skincare relies on high-heat extraction that burns away natural micronutrients. We press our botanical oils below 40°C in oxygen-deprived chambers, ensuring every drop arrives on your skin with its full biological potency intact.
            </p>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-xs font-semibold text-espresso">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                  ✓
                </span>
                <span>Zero synthetic preservatives, parabens, or silicones</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-espresso">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                  ✓
                </span>
                <span>100% bio-compatible with all skin types</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-espresso">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                  ✓
                </span>
                <span>Tested on humans, never on animals</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Ingredient Cards */}
          <div className="lg:col-span-7">
            <div className="grid gap-4 sm:grid-cols-2">
              {ingredients.map((ing, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 border ${
                    activeTab === idx
                      ? "border-clay bg-cream shadow-md -translate-y-1"
                      : "border-blush/60 bg-ivory hover:border-clay/40 hover:bg-cream/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{ing.icon}</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-taupe bg-blush/40 px-2.5 py-1 rounded-full">
                      {ing.origin}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-lg italic text-espresso">{ing.name}</h3>
                  <p className="mt-1 text-[11px] font-semibold text-clay-dark">{ing.activeMolecule}</p>
                  <p className="mt-3 text-xs text-taupe leading-relaxed">{ing.benefits}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
