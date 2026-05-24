import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import { getCategories, getProducts } from "../api/shop";
import { ProductCard } from "../components/ProductCard";
import type { Category, Product } from "../types";

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [ordering, setOrdering] = useState("-created_at");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = { ordering };
    if (category) params.category__slug = category;
    if (search) params.search = search;
    getProducts(params)
      .then((data) => setProducts(data.results))
      .finally(() => setLoading(false));
  }, [category, ordering, search]);

  return (
    <div className="space-y-8">
      <section className="grid gap-8 rounded-lg bg-ink p-6 text-white md:grid-cols-[1.2fr_0.8fr] md:p-10">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase text-clay">Curated essentials</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Northstar Goods</h1>
          <p className="mt-4 max-w-xl text-white/75">
            Practical home, travel, and desk products selected for daily use, clean materials, and long-term value.
          </p>
        </div>
        <div className="min-h-52 rounded-lg bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80')] bg-cover bg-center" />
      </section>

      <section className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-black/45" />
          <input
            className="focus-ring w-full rounded-md border border-black/10 bg-white py-3 pl-10 pr-3"
            placeholder="Search products"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <select className="focus-ring rounded-md border border-black/10 bg-white px-3 py-3" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item.id} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
          <select className="focus-ring rounded-md border border-black/10 bg-white px-3 py-3" value={ordering} onChange={(event) => setOrdering(event.target.value)}>
            <option value="-created_at">Newest</option>
            <option value="price">Price: low to high</option>
            <option value="-price">Price: high to low</option>
            <option value="name">Name</option>
          </select>
        </div>
      </section>

      {loading ? (
        <p className="py-12 text-center text-black/60">Loading products...</p>
      ) : (
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      )}
    </div>
  );
}

