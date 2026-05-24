export function PriceSummary({ subtotal }: { subtotal: number }) {
  const shipping = subtotal >= 75 || subtotal === 0 ? 0 : 8.99;
  const tax = subtotal * 0.07;
  const total = subtotal + shipping + tax;

  return (
    <div className="space-y-3 rounded-lg border border-black/10 bg-white p-5">
      <div className="flex justify-between text-sm">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span>Shipping</span>
        <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span>Estimated tax</span>
        <span>${tax.toFixed(2)}</span>
      </div>
      <div className="border-t border-black/10 pt-3">
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

