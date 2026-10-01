import { useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "@/lib/cart-store";
import { nairaFromKobo } from "@/types";
import { apiFetch } from "@/lib/api";

export default function CheckoutPage() {
  const { lines, setQuantity, removeItem, totalKobo } = useCartStore();
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const data = await apiFetch<{ authorizationUrl: string }>("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          items: lines.map((l) => ({ productId: l.productId, quantity: l.quantity }))
        })
      });

      // Hand off to Paystack's hosted checkout. We don't clear the cart
      // here — it clears once payment is confirmed, so an abandoned
      // Paystack session doesn't lose the customer's cart.
      window.location.href = data.authorizationUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl italic text-espresso">Your cart is empty</h1>
        <Link to="/#shop" className="mt-6 inline-block text-sm text-clay-dark underline">
          Back to the collection
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="font-display text-3xl italic text-espresso">Checkout</h1>

      <div className="mt-8 divide-y divide-blush border-y border-blush">
        {lines.map((line) => (
          <div key={line.productId} className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="text-espresso">{line.name}</p>
              <p className="text-sm text-taupe">{nairaFromKobo(line.priceKobo)} each</p>
            </div>

            <div className="flex items-center gap-4">
              <input
                type="number"
                min={1}
                max={line.stock}
                value={line.quantity}
                onChange={(e) => setQuantity(line.productId, Number(e.target.value))}
                className="w-16 rounded-full border border-espresso/15 bg-ivory px-3 py-1 text-center text-sm"
              />
              <button
                type="button"
                onClick={() => removeItem(line.productId)}
                className="text-sm text-taupe hover:text-espresso"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-right font-display text-xl italic text-espresso">
        Total: {nairaFromKobo(totalKobo())}
      </p>

      <form onSubmit={handleSubmit} className="mt-10 grid gap-5">
        <label className="grid gap-1.5 text-sm text-taupe">
          Full name
          <input
            required
            value={form.customerName}
            onChange={(e) => setForm({ ...form, customerName: e.target.value })}
            className="rounded-xl border border-espresso/15 bg-ivory px-4 py-2.5 text-espresso"
          />
        </label>

        <label className="grid gap-1.5 text-sm text-taupe">
          Email
          <input
            required
            type="email"
            value={form.customerEmail}
            onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
            className="rounded-xl border border-espresso/15 bg-ivory px-4 py-2.5 text-espresso"
          />
        </label>

        <label className="grid gap-1.5 text-sm text-taupe">
          Phone (optional)
          <input
            value={form.customerPhone}
            onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
            className="rounded-xl border border-espresso/15 bg-ivory px-4 py-2.5 text-espresso"
          />
        </label>

        <label className="grid gap-1.5 text-sm text-taupe">
          Shipping address
          <textarea
            required
            rows={3}
            value={form.shippingAddress}
            onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
            className="rounded-xl border border-espresso/15 bg-ivory px-4 py-2.5 text-espresso"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-full bg-clay px-7 py-3 text-sm font-medium text-ivory transition-colors hover:bg-clay-dark disabled:opacity-60"
        >
          {submitting ? "Taking you to payment…" : "Pay with Paystack"}
        </button>
      </form>
    </div>
  );
}
