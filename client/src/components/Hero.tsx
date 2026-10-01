export default function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-6 pb-20 pt-14 md:grid-cols-[1.1fr_0.9fr] md:gap-6 md:pt-20">
      <div className="flex flex-col justify-center">
        <h1 className="max-w-md font-display text-5xl italic leading-[1.1] text-espresso md:text-6xl">
          Body care that gives skin time to actually drink it in.
        </h1>
        <p className="mt-6 max-w-sm text-base leading-relaxed text-taupe">
          Shea butters whipped by hand, oils pressed cold, scrubs ground fine enough to
          use every day. No fillers, no rush.
        </p>
        <a
          href="#shop"
          className="mt-8 w-fit rounded-full bg-clay px-7 py-3 text-sm font-medium text-ivory transition-colors hover:bg-clay-dark"
        >
          Shop the collection
        </a>
      </div>

      <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-blush md:translate-y-8">
        {/* Replace with a real product photograph before launch */}
        <div className="flex h-full items-center justify-center font-display text-lg italic text-taupe">
          product photography
        </div>
      </div>
    </section>
  );
}
