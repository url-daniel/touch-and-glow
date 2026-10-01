import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useCartStore } from "@/lib/cart-store";
import { apiFetch } from "@/lib/api";

type OrderStatus = "pending" | "successful" | "failed";

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const clear = useCartStore((s) => s.clear);
  const [status, setStatus] = useState<OrderStatus>("pending");

  useEffect(() => {
    if (!reference) return;

    // The Paystack webhook confirms payment asynchronously, usually within
    // a second or two of landing here — so we poll briefly rather than
    // assuming success just because the customer was redirected back.
    let cancelled = false;
    let attempts = 0;

    async function poll() {
      if (cancelled || attempts > 15) return;
      attempts += 1;

      try {
        const data = await apiFetch<{ order: { status: OrderStatus } }>(`/api/orders/${reference}`);
        if (!cancelled) setStatus(data.order.status);
        if (data.order.status === "successful") {
          clear();
          return;
        }
      } catch {
        // order not found yet or transient error — keep polling
      }
      if (!cancelled) setTimeout(poll, 2000);
    }

    poll();
    return () => {
      cancelled = true;
    };
  }, [reference, clear]);

  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      {status === "successful" && (
        <>
          <h1 className="font-display text-3xl italic text-espresso">Order confirmed</h1>
          <p className="mt-4 text-taupe">
            Thank you — a confirmation is on its way to your email. We'll start packing it up.
          </p>
        </>
      )}
      {status === "pending" && (
        <>
          <h1 className="font-display text-3xl italic text-espresso">Confirming your payment…</h1>
          <p className="mt-4 text-taupe">This usually takes a few seconds.</p>
        </>
      )}
      {status === "failed" && (
        <>
          <h1 className="font-display text-3xl italic text-espresso">Payment didn't go through</h1>
          <p className="mt-4 text-taupe">No charge was completed. You can try again from your cart.</p>
        </>
      )}
      <Link to="/#shop" className="mt-8 inline-block text-sm text-clay-dark underline">
        Back to the collection
      </Link>
    </div>
  );
}
