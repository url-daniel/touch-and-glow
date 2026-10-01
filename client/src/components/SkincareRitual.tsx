export default function SkincareRitual() {
  const steps = [
    {
      num: "01",
      step: "Purify",
      title: "Melt & Cleanse",
      desc: "Warm an almond-sized amount of botanical balm between dry palms. Massage into skin to effortlessly dissolve SPF, environmental grime, and impurities while nourishing the moisture barrier.",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80",
      tag: "AM / PM Essential"
    },
    {
      num: "02",
      step: "Replenish",
      title: "Hydrate & Plump",
      desc: "Press 3-4 drops of concentrated multi-weight hyaluronic essence into damp skin. Deep cellular hydration floods the stratum corneum for immediate suppleness and elasticity.",
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=80",
      tag: "Deep Hydration"
    },
    {
      num: "03",
      step: "Illuminate",
      title: "Seal & Protect",
      desc: "Finish with 3 drops of cold-pressed botanical oil or barrier cream. Locks in all preceding hydration and bestows an unmistakable, non-greasy golden glow throughout the day.",
      image: "https://images.unsplash.com/photo-1608248597358-1e4e20986161?auto=format&fit=crop&w=700&q=80",
      tag: "Luminous Glow"
    }
  ];

  return (
    <section id="ritual" className="bg-sand/30 border-y border-blush/60 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-clay-dark">
            Three Steps to Radiance
          </span>
          <h2 className="mt-2 font-display text-3xl md:text-5xl italic text-espresso">
            The Glow Ritual
          </h2>
          <p className="mt-4 text-sm md:text-base text-taupe leading-relaxed">
            A simple, slow-crafted three-phase daily discipline that restores biological balance, calms inflammation, and yields translucent, touchable luminosity.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="group flex flex-col overflow-hidden rounded-[2rem] bg-ivory p-6 shadow-sm border border-blush/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-blush">
                <img
                  src={s.image}
                  alt={s.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute left-3 top-3 rounded-full bg-ivory/90 backdrop-blur-sm px-3 py-1 text-[11px] font-semibold text-clay-dark shadow-sm">
                  {s.tag}
                </span>
                <span className="absolute right-3 bottom-3 font-display text-4xl italic font-semibold text-ivory/80 drop-shadow">
                  {s.num}
                </span>
              </div>

              {/* Text */}
              <div className="mt-6 flex flex-col flex-1 justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-clay">
                    Step {s.num} • {s.step}
                  </span>
                  <h3 className="mt-1 font-display text-xl italic text-espresso">{s.title}</h3>
                  <p className="mt-2 text-xs md:text-sm text-taupe leading-relaxed">{s.desc}</p>
                </div>

                <a
                  href="#shop"
                  className="mt-6 inline-flex items-center text-xs font-semibold text-clay-dark underline hover:text-clay transition-colors"
                >
                  Shop Formulations for Step {s.num} →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
