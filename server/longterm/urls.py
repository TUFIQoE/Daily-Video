from django.contrib import admin
from django.urls import include, path, re_path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from rest_framework.routers import DefaultRouter

from longterm.videos.urls import router as videos_router

schema_view = get_schema_view(
    openapi.Info(
        title="LongTerm API",
        default_version="v1",
        contact=openapi.Contact(email="example@email.com"),
    ),
    public=True,
    permission_classes=(permissions.IsAuthenticated,),
)


router = DefaultRouter()
router.registry.extend(videos_router.registry)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path("api/", include("longterm.accounts.urls")),
    re_path(
        r"^swagger(?P<format>\.json|\.yaml)$",
        schema_view.without_ui(cache_timeout=0),
        name="schema-json",
    ),
    path(
        "api/doc/", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"
    ),
    path(
        "api/swagger/",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger",
    ),
]
