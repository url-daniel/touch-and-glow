import { useState } from "react";
import { isShopifyConfigured } from "@/lib/shopify";

export default function ShopifySetupNotice() {
  const [dismissed, setDismissed] = useState(false);
  const configured = isShopifyConfigured();

  if (configured || dismissed) return null;

  return (
    <div className="bg-sand/60 border-b border-blush/60 px-4 py-3 text-xs text-taupe">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-clay animate-pulse" />
          <span>
            <strong>Shopify Headless Mode:</strong> Showing demo products. Add{" "}
            <code className="rounded bg-ivory px-1.5 py-0.5 font-mono text-espresso">
              VITE_SHOPIFY_STORE_DOMAIN
            </code>{" "}
            and{" "}
            <code className="rounded bg-ivory px-1.5 py-0.5 font-mono text-espresso">
              VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN
            </code>{" "}
            to your Vercel or local <code className="rounded bg-ivory px-1.5 py-0.5 font-mono text-espresso">.env</code> to stream live Shopify products and checkout.
          </span>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="shrink-0 text-espresso/60 hover:text-espresso"
          aria-label="Dismiss banner"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
