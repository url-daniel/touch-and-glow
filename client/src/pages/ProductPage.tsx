import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Product } from "@/types";
import { nairaFromKobo } from "@/types";
import { apiFetch } from "@/lib/api";
import AddToCartButton from "@/components/AddToCartButton";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    apiFetch<{ products: Product[] }>("/api/products")
      .then((data) => {
        const match = data.products.find((p) => p.slug === slug);
        if (!match) setNotFound(true);
        else setProduct(match);
      })
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return <p className="px-6 py-24 text-center text-taupe">Product not found.</p>;
  }

  if (!product) {
    return <p className="px-6 py-24 text-center text-taupe">Loading…</p>;
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-6 py-14 md:grid-cols-2">
      <div className="aspect-square overflow-hidden rounded-[2rem] bg-blush">
        <div className="flex h-full items-center justify-center font-display text-lg italic text-taupe">
          {product.name}
        </div>
      </div>

      <div className="flex flex-col justify-center">
        <h1 className="font-display text-4xl italic text-espresso">{product.name}</h1>
        <p className="mt-3 text-lg text-taupe">{nairaFromKobo(product.priceKobo)}</p>
        <p className="mt-6 max-w-prose leading-relaxed text-espresso/80">{product.description}</p>

        <p className="mt-6 text-sm text-taupe">
          {product.stock > 0 ? `${product.stock} in stock` : "Currently sold out"}
        </p>

        <AddToCartButton
          productId={product.id}
          name={product.name}
          priceKobo={product.priceKobo}
          imageUrl={product.imageUrl}
          stock={product.stock}
        />
      </div>
    </div>
  );
}
