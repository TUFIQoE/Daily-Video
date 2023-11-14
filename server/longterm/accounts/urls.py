from django.urls import include, path
from rest_framework.routers import DefaultRouter

from longterm.accounts.views import CustomTokenCreateView, CustomUserViewSet

app_name = "accounts"

router = DefaultRouter()
router.register("users", CustomUserViewSet, basename="users")

urlpatterns = [
    path(r"", include(router.urls)),
    path(r"users/token/login/", CustomTokenCreateView.as_view()),
]
