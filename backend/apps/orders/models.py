from decimal import Decimal

from django.conf import settings
from django.db import models, transaction

from apps.catalog.models import Product


class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        PAID = "paid", "Paid"
        SHIPPED = "shipped", "Shipped"
        CANCELLED = "cancelled", "Cancelled"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="orders", null=True, blank=True, on_delete=models.SET_NULL)
    email = models.EmailField()
    first_name = models.CharField(max_length=80)
    last_name = models.CharField(max_length=80)
    shipping_address = models.CharField(max_length=255)
    shipping_city = models.CharField(max_length=120)
    shipping_postal_code = models.CharField(max_length=20)
    shipping_country = models.CharField(max_length=80)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    shipping_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return f"Order #{self.pk}"

    def recalculate_totals(self) -> None:
        subtotal = sum((item.line_total for item in self.items.all()), Decimal("0.00"))
        self.subtotal = subtotal
        self.shipping_total = Decimal("0.00") if subtotal >= Decimal("75.00") else Decimal("8.99")
        self.tax_total = (subtotal * Decimal("0.07")).quantize(Decimal("0.01"))
        self.total = self.subtotal + self.shipping_total + self.tax_total


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name="order_items", on_delete=models.PROTECT)
    product_name = models.CharField(max_length=180)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()
    line_total = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        ordering = ("id",)

    def __str__(self) -> str:
        return f"{self.product_name} x {self.quantity}"


def create_order_with_items(order: Order, items: list[dict]) -> Order:
    with transaction.atomic():
        order.save()
        order_items = []
        for item in items:
            product = Product.objects.select_for_update().get(pk=item["product"].pk)
            quantity = item["quantity"]
            if product.stock < quantity:
                raise ValueError(f"{product.name} only has {product.stock} units available.")
            product.stock -= quantity
            product.save(update_fields=("stock", "updated_at"))
            order_items.append(
                OrderItem(
                    order=order,
                    product=product,
                    product_name=product.name,
                    unit_price=product.price,
                    quantity=quantity,
                    line_total=product.price * quantity,
                )
            )
        OrderItem.objects.bulk_create(order_items)
        order.recalculate_totals()
        order.save(update_fields=("subtotal", "shipping_total", "tax_total", "total", "updated_at"))
    return order

