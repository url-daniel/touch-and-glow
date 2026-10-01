import { useEffect, useState } from "react";
import type { Product } from "@/types";
import { fetchShopifyProducts } from "@/lib/shopify";
import ProductCard from "./ProductCard";

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        const data = await fetchShopifyProducts();
        if (active) {
          setProducts(data);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load products");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <section id="shop" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-display text-3xl italic text-espresso">The collection</h2>
        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square rounded-3xl bg-blush/60" />
              <div className="mt-4 h-4 w-3/4 rounded bg-blush/60" />
              <div className="mt-2 h-3 w-1/3 rounded bg-blush/40" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="shop" className="mx-auto max-w-6xl px-6 py-16 text-center">
        <p className="text-taupe">Couldn't load products: {error}</p>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section id="shop" className="mx-auto max-w-6xl px-6 py-16 text-center">
        <h2 className="font-display text-3xl italic text-espresso">The collection</h2>
        <p className="mt-4 text-taupe">
          No products found in your Shopify store. Ensure your products are published to the Online Store / Storefront sales channel.
        </p>
      </section>
    );
  }

  return (
    <section id="shop" className="mx-auto max-w-6xl px-6 py-14">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-display text-3xl md:text-4xl italic text-espresso">The collection</h2>
          <p className="mt-2 text-sm text-taupe">
            Carefully formulated botanical skincare designed for natural, lasting radiance.
          </p>
        </div>
        <span className="hidden sm:inline-block text-xs uppercase tracking-wider text-taupe font-medium">
          {products.length} {products.length === 1 ? "Product" : "Products"}
        </span>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
