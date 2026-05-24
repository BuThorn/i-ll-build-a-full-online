from rest_framework import serializers

from apps.catalog.models import Product

from .models import Order, OrderItem, create_order_with_items


class OrderItemReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ("id", "product", "product_name", "unit_price", "quantity", "line_total")


class OrderItemWriteSerializer(serializers.Serializer):
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.filter(is_active=True), source="product")
    quantity = serializers.IntegerField(min_value=1, max_value=99)


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemReadSerializer(many=True, read_only=True)
    line_items = OrderItemWriteSerializer(many=True, write_only=True)

    class Meta:
        model = Order
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "shipping_address",
            "shipping_city",
            "shipping_postal_code",
            "shipping_country",
            "status",
            "subtotal",
            "shipping_total",
            "tax_total",
            "total",
            "items",
            "line_items",
            "created_at",
        )
        read_only_fields = ("status", "subtotal", "shipping_total", "tax_total", "total", "created_at")

    def create(self, validated_data):
        line_items = validated_data.pop("line_items")
        request = self.context.get("request")
        user = request.user if request and request.user.is_authenticated else None
        order = Order(user=user, **validated_data)
        try:
            return create_order_with_items(order, line_items)
        except ValueError as exc:
            raise serializers.ValidationError({"line_items": str(exc)}) from exc

