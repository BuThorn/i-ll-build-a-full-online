import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";
import type { Product } from "../types";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const image = product.image_url || `https://placehold.co/640x520/f5f7f2/172026?text=${encodeURIComponent(product.name)}`;

  return (
    <article className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm">
      <Link to={`/products/${product.slug}`} className="block aspect-[4/3] overflow-hidden bg-mist">
        <img src={image} alt={product.name} className="h-full w-full object-cover transition duration-300 hover:scale-105" />
      </Link>
      <div className="space-y-3 p-4">
        <div>
          <p className="text-xs font-semibold uppercase text-moss">{product.category.name}</p>
          <Link to={`/products/${product.slug}`} className="mt-1 block text-lg font-semibold hover:text-clay">
            {product.name}
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-bold">${Number(product.price).toFixed(2)}</p>
          <button
            className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-md bg-ink text-white disabled:cursor-not-allowed disabled:bg-black/30"
            disabled={!product.in_stock}
            onClick={() => addItem(product)}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </article>
  );
}

