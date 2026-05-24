from django.db.models import QuerySet
from rest_framework import permissions, viewsets

from .models import Order
from .serializers import OrderSerializer


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    http_method_names = ("get", "post", "head", "options")

    def get_permissions(self):
        if self.action == "create":
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self) -> QuerySet[Order]:
        user = self.request.user
        if user.is_staff:
            return Order.objects.prefetch_related("items").all()
        return Order.objects.prefetch_related("items").filter(user=user)

