import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useCartStore } from "@/lib/cart-store";
import { apiFetch } from "@/lib/api";

type OrderStatus = "pending" | "successful" | "failed";

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference") || searchParams.get("checkout_token");
  const clear = useCartStore((s) => s.clear);
  const [status, setStatus] = useState<OrderStatus>("successful");

  useEffect(() => {
    // Clear cart immediately upon reaching order success
    clear();

    if (!reference || !reference.startsWith("tag-")) return;

    // Optional legacy Paystack polling if coming from older flow
    let cancelled = false;
    let attempts = 0;

    async function poll() {
      if (cancelled || attempts > 15) return;
      attempts += 1;

      try {
        const data = await apiFetch<{ order: { status: OrderStatus } }>(`/api/orders/${reference}`);
        if (!cancelled) setStatus(data.order.status);
      } catch {
        // Ignored
      }
      if (!cancelled) setTimeout(poll, 2000);
    }

    poll();
    return () => {
      cancelled = true;
    };
  }, [reference, clear]);

  return (
    <div className="mx-auto max-w-xl px-6 py-28 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-2xl text-emerald-600">
        ✓
      </div>

      <h1 className="font-display text-4xl italic text-espresso">Order Confirmed!</h1>
      <p className="mt-4 text-base text-taupe leading-relaxed">
        Thank you for shopping with Touch And GLOW. Your order has been placed and a detailed confirmation with tracking information has been sent to your email.
      </p>

      {reference && (
        <p className="mt-4 font-mono text-xs text-taupe/80">
          Order Reference: <span className="text-espresso font-medium">{reference}</span>
        </p>
      )}

      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/#shop"
          className="rounded-full bg-clay px-8 py-3.5 text-sm font-medium text-ivory transition-colors hover:bg-clay-dark"
        >
          Back to the collection
        </Link>
      </div>
    </div>
  );
}
