from datetime import date, timedelta
from decimal import Decimal

from django.apps import apps
from django.contrib.auth import get_user_model
from django.db.models import Count, DecimalField, Sum
from django.db.models.functions import Coalesce, TruncDay, TruncMonth
from django.utils import timezone
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import DashboardStatsSerializer


class DashboardStatsView(APIView):
    permission_classes = (permissions.IsAdminUser,)

    def get(self, request):
        now = timezone.now()
        today = now.date()
        thirty_days_ago = today - timedelta(days=29)
        one_year_ago = today - timedelta(days=365)

        user_count = get_user_model().objects.count()
        ProductModel = apps.get_model("catalog", "Product")
        OrderModel = apps.get_model("orders", "Order")
        product_count = ProductModel.objects.count()
        orders = OrderModel.objects.filter(status=OrderModel.Status.PAID)
        order_count = orders.count()

        total_sales = orders.aggregate(
            total=Coalesce(Sum("total", output_field=DecimalField(max_digits=14, decimal_places=2)), Decimal("0.00"))
        )["total"]

        daily_queryset = (
            orders.filter(created_at__date__gte=thirty_days_ago)
            .annotate(date=TruncDay("created_at"))
            .values("date")
            .annotate(orders=Count("pk"), revenue=Coalesce(Sum("total", output_field=DecimalField(max_digits=14, decimal_places=2)), Decimal("0.00")))
            .order_by("date")
        )

        daily_map = {item["date"]: item for item in daily_queryset}
        daily = []
        for day_number in range(30):
            day = thirty_days_ago + timedelta(days=day_number)
            entry = daily_map.get(day, {"orders": 0, "revenue": Decimal("0.00")})
            daily.append({"date": day, "orders": entry["orders"], "revenue": entry["revenue"]})

        monthly_queryset = (
            orders.filter(created_at__date__gte=one_year_ago)
            .annotate(month=TruncMonth("created_at"))
            .values("month")
            .annotate(orders=Count("pk"), revenue=Coalesce(Sum("total", output_field=DecimalField(max_digits=14, decimal_places=2)), Decimal("0.00")))
            .order_by("month")
        )

        monthly_map = {item["month"].strftime("%Y-%m"): item for item in monthly_queryset}
        monthly = []

        def first_day_of_month(source_date: date, months_delta: int) -> date:
            year = source_date.year + ((source_date.month - 1 + months_delta) // 12)
            month = ((source_date.month - 1 + months_delta) % 12) + 1
            return date(year, month, 1)

        for offset in range(-11, 1):
            month_date = first_day_of_month(today, offset)
            month_key = month_date.strftime("%Y-%m")
            entry = monthly_map.get(month_key, {"orders": 0, "revenue": Decimal("0.00")})
            monthly.append({"month": month_key, "orders": entry["orders"], "revenue": entry["revenue"]})

        payload = {
            "users": user_count,
            "products": product_count,
            "orders": order_count,
            "total_sales": total_sales,
            "daily": daily,
            "monthly": list(reversed(monthly)),
        }

        serializer = DashboardStatsSerializer(payload, context={"request": request})
        return Response(serializer.data)
