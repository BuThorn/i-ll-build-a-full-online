import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getProduct } from "../api/shop";
import { useCart } from "../context/CartContext";
import type { Product } from "../types";

export function ProductPage() {
  const { slug = "" } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    getProduct(slug).then(setProduct);
  }, [slug]);

  if (!product) {
    return <p className="py-12 text-center text-black/60">Loading product...</p>;
  }

  const image = product.image_url || `https://placehold.co/900x760/f5f7f2/172026?text=${encodeURIComponent(product.name)}`;

  return (
    <section className="grid gap-8 lg:grid-cols-2">
      <div className="overflow-hidden rounded-lg bg-white">
        <img src={image} alt={product.name} className="aspect-[5/4] w-full object-cover" />
      </div>
      <div className="self-center">
        <p className="text-sm font-semibold uppercase text-moss">{product.category.name}</p>
        <h1 className="mt-2 text-4xl font-bold">{product.name}</h1>
        <p className="mt-4 text-2xl font-bold">${Number(product.price).toFixed(2)}</p>
        <p className="mt-6 leading-7 text-black/70">{product.description}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            className="focus-ring h-12 w-24 rounded-md border border-black/10 bg-white px-3"
            min={1}
            max={product.stock}
            type="number"
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
          />
          <button
            className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-md bg-clay px-6 font-semibold text-white disabled:cursor-not-allowed disabled:bg-black/30"
            disabled={!product.in_stock}
            onClick={() => addItem(product, quantity)}
          >
            <ShoppingCart className="h-5 w-5" />
            Add to cart
          </button>
        </div>
      </div>
    </section>
  );
}

