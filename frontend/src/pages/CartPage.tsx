import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { PriceSummary } from "../components/PriceSummary";
import { useCart } from "../context/CartContext";

export function CartPage() {
  const { items, removeItem, subtotal, updateQuantity } = useCart();

  if (items.length === 0) {
    return (
      <section className="rounded-lg bg-white p-10 text-center">
        <h1 className="text-3xl font-bold">Your cart is empty</h1>
        <Link to="/" className="focus-ring mt-6 inline-flex rounded-md bg-ink px-5 py-3 font-semibold text-white">
          Continue shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Cart</h1>
        {items.map((item) => (
          <article key={item.product.id} className="grid gap-4 rounded-lg border border-black/10 bg-white p-4 sm:grid-cols-[96px_1fr_auto]">
            <img
              className="h-24 w-24 rounded-md object-cover"
              src={item.product.image_url || `https://placehold.co/220x220/f5f7f2/172026?text=${encodeURIComponent(item.product.name)}`}
              alt={item.product.name}
            />
            <div>
              <h2 className="font-semibold">{item.product.name}</h2>
              <p className="text-sm text-black/60">${Number(item.product.price).toFixed(2)}</p>
              <input
                className="focus-ring mt-3 h-10 w-24 rounded-md border border-black/10 px-3"
                min={1}
                max={item.product.stock}
                type="number"
                value={item.quantity}
                onChange={(event) => updateQuantity(item.product.id, Number(event.target.value))}
              />
            </div>
            <button className="focus-ring h-10 w-10 rounded-md text-black/60 hover:bg-mist hover:text-clay" onClick={() => removeItem(item.product.id)} aria-label="Remove item">
              <Trash2 className="mx-auto h-5 w-5" />
            </button>
          </article>
        ))}
      </div>
      <aside className="space-y-4">
        <PriceSummary subtotal={subtotal} />
        <Link to="/checkout" className="focus-ring flex h-12 items-center justify-center rounded-md bg-clay font-semibold text-white">
          Checkout
        </Link>
      </aside>
    </section>
  );
}

