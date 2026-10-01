import { useEffect, useState } from "react";
import type { Product } from "@/types";
import { apiFetch } from "@/lib/api";
import ProductCard from "./ProductCard";

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<{ products: Product[] }>("/api/products")
      .then((data) => setProducts(data.products))
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <p className="px-6 py-16 text-center text-taupe">Couldn't load products: {error}</p>;
  }

  if (!products) {
    return <p className="px-6 py-16 text-center text-taupe">Loading…</p>;
  }

  if (products.length === 0) {
    return (
      <p className="px-6 py-16 text-center text-taupe">
        Nothing in the shop yet — run <code>npm run prisma:seed</code> in the server project.
      </p>
    );
  }

  return (
    <section id="shop" className="mx-auto max-w-6xl px-6 py-10">
      <h2 className="font-display text-3xl italic text-espresso">The collection</h2>
      <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
