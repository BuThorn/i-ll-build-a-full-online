from django.db.models import QuerySet
from rest_framework import mixins, viewsets

from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer


class CategoryViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    serializer_class = CategorySerializer
    lookup_field = "slug"

    def get_queryset(self) -> QuerySet[Category]:
        return Category.objects.filter(is_active=True)


class ProductViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    serializer_class = ProductSerializer
    lookup_field = "slug"
    filterset_fields = ("category__slug",)
    search_fields = ("name", "description", "category__name")
    ordering_fields = ("created_at", "price", "name")
    ordering = ("-created_at",)

    def get_queryset(self) -> QuerySet[Product]:
        return Product.objects.select_related("category").filter(is_active=True, category__is_active=True)

