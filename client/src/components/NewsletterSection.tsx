import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubscribed(true);
  }

  function handleCopy() {
    navigator.clipboard.writeText("GLOW15");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="bg-espresso text-ivory py-20 md:py-24 relative overflow-hidden">
      {/* Subtle organic light accent */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-peach/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-clay/10 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <span className="text-xs uppercase tracking-widest font-semibold text-peach">
          The Inner Glow Club
        </span>
        <h2 className="mt-2 font-display text-3xl md:text-5xl italic text-ivory">
          Unlock 15% Off Your First Order
        </h2>
        <p className="mt-4 max-w-xl mx-auto text-xs md:text-sm text-blush/80 leading-relaxed">
          Subscribe for intimate skincare rituals, early-access notifications on limited cold-pressed harvests, and botanical guidance.
        </p>

        {!subscribed ? (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="Enter your email address…"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-full border border-blush/30 bg-espresso/60 px-5 py-3 text-xs text-ivory placeholder:text-blush/50 focus:border-peach focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-clay px-8 py-3 text-xs font-semibold text-ivory transition-all hover:bg-clay-dark shadow active:scale-95"
            >
              Join Club
            </button>
          </form>
        ) : (
          <div className="mt-8 max-w-md mx-auto rounded-3xl border border-peach/40 bg-sand/10 p-6 backdrop-blur-md animate-fadeIn">
            <p className="text-sm font-semibold text-peach flex items-center justify-center gap-2">
              <span>✨</span> Welcome to Touch And GLOW!
            </p>
            <p className="mt-2 text-xs text-blush/80">
              Your 15% promotional discount code is ready to use at checkout:
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <span className="font-mono text-base font-bold bg-ivory text-espresso px-4 py-2 rounded-xl tracking-wider">
                GLOW15
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-xl border border-peach/50 bg-peach/20 px-4 py-2 text-xs font-semibold text-peach hover:bg-peach/30 transition-colors"
              >
                {copied ? "✓ Copied!" : "Copy Code"}
              </button>
            </div>
          </div>
        )}

        <p className="mt-4 text-[10px] text-blush/50">
          No spam, ever. Unsubscribe with one click at any time.
        </p>
      </div>
    </section>
  );
}
