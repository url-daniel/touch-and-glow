import { useEffect, useState, useMemo } from "react";
import type { Product } from "@/types";
import { fetchShopifyProducts } from "@/lib/shopify";
import ProductCard from "./ProductCard";

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "name-asc">("featured");

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

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let list = [...products];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q)
      );
    }

    // Filter by category
    if (activeCategory !== "all") {
      list = list.filter((p) => {
        const text = `${p.name} ${p.description}`.toLowerCase();
        if (activeCategory === "oil") return text.includes("oil") || text.includes("serum");
        if (activeCategory === "cleanser") return text.includes("clean") || text.includes("balm") || text.includes("scrub");
        if (activeCategory === "cream") return text.includes("cream") || text.includes("butter") || text.includes("recovery");
        if (activeCategory === "in-stock") return p.availableForSale && p.stock > 0;
        return true;
      });
    }

    // Sort
    if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name-asc") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [products, searchQuery, activeCategory, sortBy]);

  const categories = [
    { id: "all", label: "All Formulations" },
    { id: "oil", label: "Oils & Serums" },
    { id: "cream", label: "Creams & Butters" },
    { id: "cleanser", label: "Cleansers & Balms" },
    { id: "in-stock", label: "Ready to Ship" }
  ];

  if (loading) {
    return (
      <section id="shop" className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl md:text-4xl italic text-espresso">The Collection</h2>
            <p className="mt-2 text-sm text-taupe">Loading botanical formulations…</p>
          </div>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
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
      <section id="shop" className="mx-auto max-w-6xl px-6 py-20 text-center">
        <p className="text-taupe">Couldn't load collection: {error}</p>
      </section>
    );
  }

  return (
    <section id="shop" className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-clay-dark">
            Shopify Catalog
          </span>
          <h2 className="mt-1 font-display text-3xl md:text-4xl lg:text-5xl italic text-espresso">
            The Collection
          </h2>
          <p className="mt-2 max-w-lg text-sm text-taupe">
            Carefully extracted botanical elixirs, whipped butters, and nutrient-dense hydration.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search products…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-espresso/20 bg-ivory/80 px-4 py-2.5 pl-10 text-xs text-espresso placeholder:text-taupe/60 shadow-sm focus:border-clay focus:bg-ivory focus:outline-none transition-all"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3.5 top-3 h-4 w-4 text-taupe/60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-2.5 text-xs text-taupe hover:text-espresso"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filter Category Pills & Sort Bar */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-blush/60 pb-6">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
                activeCategory === cat.id
                  ? "bg-espresso text-ivory shadow-sm"
                  : "border border-espresso/15 bg-ivory/70 text-taupe hover:border-espresso/30 hover:text-espresso"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sort & Count */}
        <div className="flex items-center gap-4 text-xs text-taupe">
          <span className="hidden sm:inline font-medium">
            {filteredProducts.length} {filteredProducts.length === 1 ? "Product" : "Products"}
          </span>

          <label className="flex items-center gap-2 font-medium">
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-full border border-espresso/15 bg-ivory px-3 py-1.5 text-xs text-espresso focus:outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Alphabetical: A-Z</option>
            </select>
          </label>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-display text-2xl italic text-espresso">No products match your search</p>
          <p className="mt-2 text-sm text-taupe">Try adjusting your filters or search keywords.</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
            }}
            className="mt-6 rounded-full bg-clay px-6 py-2.5 text-xs font-medium text-ivory hover:bg-clay-dark"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
