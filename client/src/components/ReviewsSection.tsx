export default function ReviewsSection() {
  const reviews = [
    {
      name: "Sophia Adeyemi",
      location: "Lagos, NG",
      rating: 5,
      product: "Golden Nectar Glow Oil",
      title: "My skin has never held moisture like this",
      body: "Living in a humid climate usually makes oils feel heavy, but Touch And GLOW sinks in within 60 seconds. My hyperpigmentation from old breakouts has visibly faded after four weeks.",
      verified: true
    },
    {
      name: "Claire Montrose",
      location: "London, UK",
      rating: 5,
      product: "Ceramide Infusion Recovery Cream",
      title: "Saved my winter barrier",
      body: "I destroyed my barrier with harsh acids. This cream was the only thing that didn't sting. Within two days, the tight flakiness was completely replaced with plump, calm, radiant skin.",
      verified: true
    },
    {
      name: "Elena Rostova",
      location: "New York, USA",
      rating: 5,
      product: "Velvet Silk Cleansing Balm",
      title: "Melts waterproof SPF in seconds",
      body: "Rinses completely clean without any greasy film. The subtle botanical aroma makes taking my makeup off feel like a luxury spa facial every single night.",
      verified: true
    }
  ];

  return (
    <section id="reviews" className="py-20 md:py-28 bg-sand/20 border-t border-blush/60">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-peach text-lg">
              {"★".repeat(5)}
              <span className="text-xs font-semibold text-espresso ml-2">4.9 / 5.0 Global Rating</span>
            </div>
            <h2 className="mt-2 font-display text-3xl md:text-5xl italic text-espresso">
              Loved by Thousands of Glowing Faces
            </h2>
          </div>
          <span className="text-xs uppercase tracking-wider font-semibold text-taupe">
            Based on 15,000+ Verified Customers
          </span>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {reviews.map((r, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-3xl border border-blush/80 bg-ivory p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex text-peach text-sm">{"★".repeat(r.rating)}</div>
                  {r.verified && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                      ✓ Verified Buyer
                    </span>
                  )}
                </div>

                <h3 className="mt-4 font-display text-lg italic text-espresso">
                  "{r.title}"
                </h3>
                <p className="mt-3 text-xs md:text-sm text-taupe leading-relaxed">
                  {r.body}
                </p>
              </div>

              <div className="mt-6 border-t border-blush/60 pt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-espresso">{r.name}</p>
                  <p className="text-[11px] text-taupe">{r.location}</p>
                </div>
                <span className="text-[10px] italic text-clay-dark font-medium bg-blush/30 px-2.5 py-1 rounded-full">
                  {r.product}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
