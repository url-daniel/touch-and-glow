export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream via-cream/80 to-cream pb-16 pt-8 md:pt-14 md:pb-24">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -left-20 top-0 h-96 w-96 rounded-full bg-blush/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-20 h-96 w-96 rounded-full bg-peach/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        {/* Left Column: Headline and CTAs */}
        <div className="flex flex-col justify-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-clay/30 bg-ivory/80 px-4 py-1.5 text-xs font-medium text-clay-dark shadow-sm backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-clay animate-pulse" />
            <span>Pure Botanical Formulations • Small-Batch</span>
          </div>

          <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl italic leading-[1.08] text-espresso">
            Skincare that gives your skin time to truly drink it in.
          </h1>

          <p className="mt-6 max-w-lg text-base md:text-lg leading-relaxed text-taupe">
            Small-batch restorative elixirs whipped by hand and cold-pressed to preserve active nutrients. Zero synthetic fillers, zero compromises.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#shop"
              className="rounded-full bg-clay px-8 py-3.5 text-sm font-medium text-ivory shadow transition-all hover:bg-clay-dark hover:shadow-lg active:scale-95"
            >
              Shop The Collection
            </a>
            <a
              href="#ritual"
              className="rounded-full border border-espresso/20 bg-ivory/70 px-7 py-3.5 text-sm font-medium text-espresso shadow-sm transition-all hover:bg-ivory hover:border-espresso/40 active:scale-95"
            >
              Explore The Ritual →
            </a>
          </div>

          {/* Social Proof Stats */}
          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-blush/80 pt-8">
            <div>
              <p className="font-display text-2xl md:text-3xl italic font-semibold text-espresso">4.9 ★</p>
              <p className="text-xs text-taupe mt-0.5">Over 15,000+ reviews</p>
            </div>
            <div>
              <p className="font-display text-2xl md:text-3xl italic font-semibold text-espresso">100%</p>
              <p className="text-xs text-taupe mt-0.5">Cold-pressed actives</p>
            </div>
            <div>
              <p className="font-display text-2xl md:text-3xl italic font-semibold text-espresso">0%</p>
              <p className="text-xs text-taupe mt-0.5">Artificial parabens</p>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Visual with Glassmorphism Overlays */}
        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-blush shadow-2xl transition-transform duration-500 hover:scale-[1.01]">
            <img
              src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=85"
              alt="Touch And GLOW Botanical Skincare"
              className="h-full w-full object-cover object-center"
            />
            {/* Subtle gradient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-espresso/40 via-transparent to-transparent" />
          </div>

          {/* Floating Glassmorphism Badge 1: Customer Quote */}
          <div className="absolute -bottom-6 -left-6 max-w-xs rounded-2xl glass-panel p-4 shadow-xl border border-white/60 hidden sm:block animate-float">
            <div className="flex items-center gap-1 text-peach text-sm">
              {"★".repeat(5)}
            </div>
            <p className="mt-1 text-xs italic text-espresso">
              "The most transformative face oil I've used. Instant morning dewiness."
            </p>
            <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-wider text-taupe">
              — Maya K., Verified Buyer
            </p>
          </div>

          {/* Floating Glassmorphism Badge 2: Organic Seal */}
          <div className="absolute -top-4 -right-4 rounded-2xl glass-panel px-4 py-3 shadow-lg border border-white/60">
            <p className="text-xs font-semibold text-espresso flex items-center gap-1.5">
              <span>🌿</span> Cruelty-Free Certified
            </p>
            <p className="text-[10px] text-taupe">Ethically harvested ingredients</p>
          </div>
        </div>
      </div>
    </section>
  );
}
