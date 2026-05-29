from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.catalog.views import CategoryViewSet, ProductViewSet
from apps.dashboard.views import DashboardStatsView
from apps.orders.views import OrderViewSet
from apps.users.views import CurrentUserView, RegisterView

router = DefaultRouter()
router.register("categories", CategoryViewSet, basename="category")
router.register("products", ProductViewSet, basename="product")
router.register("orders", OrderViewSet, basename="order")

urlpatterns = [
    path("", lambda request: JsonResponse({
        "message": "Welcome to the Online Shop API",
        "api_root": "/api/",
        "auth_register": "/api/auth/register/",
        "auth_token": "/api/auth/token/",
    })),
    path("admin/", admin.site.urls),
    path("api/auth/register/", RegisterView.as_view(), name="register"),
    path("api/auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/me/", CurrentUserView.as_view(), name="current_user"),
    path("api/dashboard/stats/", DashboardStatsView.as_view(), name="dashboard_stats"),
    path("api/", include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

