from django.contrib import admin

from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ("product_name", "unit_price", "quantity", "line_total")


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    inlines = (OrderItemInline,)
    list_display = ("id", "user", "email", "status", "total", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("email", "first_name", "last_name", "shipping_city")
    readonly_fields = ("subtotal", "shipping_total", "tax_total", "total", "created_at", "updated_at")

