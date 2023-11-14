from django.utils.decorators import method_decorator
from djoser.conf import settings as djoser_settings
from djoser.views import TokenCreateView
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from longterm.accounts.filters import UsersFilterSet
from longterm.accounts.models import CustomUser
from longterm.accounts.serializers import UserConfigSerializer, UserExternalIdSerializer
from longterm.accounts.services import UpdateUserScheduleService


class CustomUserViewSet(mixins.ListModelMixin, GenericViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserExternalIdSerializer

    def get_serializer_class(self):
        if self.action in ("update_schedule", "schedules"):
            return UserConfigSerializer
        return super().get_serializer_class()

    @property
    def filterset_class(self):
        if self.action in ["schedules"]:
            return UsersFilterSet

    @swagger_auto_schema(
        method="get",
        responses={200: openapi.Response("user config", UserConfigSerializer())},
        operation_description="Return whole merged user schedule (used by mobile client)",
    )
    @action(methods=["GET"], detail=False, url_path="me/config")
    def config(self, request):
        return Response({"schedule": request.user.schedule})

    @swagger_auto_schema(
        method="post",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={"schedule": openapi.Schema(type=openapi.TYPE_OBJECT)},
        ),
        responses={200: openapi.Response("schedule", UserConfigSerializer())},
        operation_description="API for updating and merging users' schedule. "
        "If user does not exist, he is created.",
    )
    @action(methods=["POST"], detail=False)
    def update_schedule(self, request):
        result = UpdateUserScheduleService(request.data["schedule"]).run()
        return Response(result)

    @action(methods=["GET"], detail=False)
    def schedules(self, request):
        return Response(
            self.filter_queryset(CustomUser.objects.all()).values("id", "schedule")
        )


@method_decorator(
    name="post",
    decorator=swagger_auto_schema(responses={200: djoser_settings.SERIALIZERS.token}),
)
class CustomTokenCreateView(TokenCreateView):
    pass
