import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { createOrder } from "../api/shop";
import { PriceSummary } from "../components/PriceSummary";
import { useCart } from "../context/CartContext";

export function CheckoutPage() {
  const { clearCart, items, subtotal } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      email: form.get("email"),
      first_name: form.get("first_name"),
      last_name: form.get("last_name"),
      shipping_address: form.get("shipping_address"),
      shipping_city: form.get("shipping_city"),
      shipping_postal_code: form.get("shipping_postal_code"),
      shipping_country: form.get("shipping_country"),
      line_items: items.map((item) => ({ product_id: item.product.id, quantity: item.quantity })),
    };
    try {
      await createOrder(payload);
      clearCart();
      navigate("/");
    } catch {
      setError("We could not place your order. Please check inventory and try again.");
    }
  }

  if (items.length === 0) {
    return (
      <section className="rounded-lg bg-white p-10 text-center">
        <h1 className="text-3xl font-bold">No items to checkout</h1>
        <Link to="/" className="focus-ring mt-6 inline-flex rounded-md bg-ink px-5 py-3 font-semibold text-white">
          Continue shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <form className="space-y-5 rounded-lg border border-black/10 bg-white p-6" onSubmit={handleSubmit}>
        <h1 className="text-3xl font-bold">Checkout</h1>
        {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <div className="grid gap-4 sm:grid-cols-2">
          <Input name="first_name" label="First name" />
          <Input name="last_name" label="Last name" />
        </div>
        <Input name="email" label="Email" type="email" />
        <Input name="shipping_address" label="Address" />
        <div className="grid gap-4 sm:grid-cols-3">
          <Input name="shipping_city" label="City" />
          <Input name="shipping_postal_code" label="Postal code" />
          <Input name="shipping_country" label="Country" />
        </div>
        <button className="focus-ring h-12 rounded-md bg-clay px-6 font-semibold text-white">Place order</button>
      </form>
      <PriceSummary subtotal={subtotal} />
    </section>
  );
}

function Input({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input className="focus-ring mt-1 w-full rounded-md border border-black/10 px-3 py-3" name={name} required type={type} />
    </label>
  );
}

