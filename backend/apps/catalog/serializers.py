from rest_framework import serializers

from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("id", "name", "slug", "description")


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    in_stock = serializers.BooleanField(read_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            "id",
            "category",
            "name",
            "slug",
            "description",
            "price",
            "compare_at_price",
            "image_url",
            "stock",
            "in_stock",
            "created_at",
        )

    def get_image_url(self, obj: Product) -> str:
        request = self.context.get("request")
        if not obj.image:
            return ""
        url = obj.image.url
        return request.build_absolute_uri(url) if request else url

