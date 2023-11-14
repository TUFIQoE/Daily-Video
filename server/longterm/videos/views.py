from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from rest_framework import mixins, viewsets

from longterm.videos.filters import FeedbackCommentsFilterSet, WatchResultFilterSet, MissingVideoFilterSet
from longterm.videos.models import Event, FeedbackComment, ResultForm, WatchResult, MissingVideo
from longterm.videos.serializers import (
    EventSerializer,
    FeedbackCommentSerializer,
    ResultFormSerializer,
    WatchResultSerializer, MissingVideoSerializer,
)


class FeedbackCommentViewSet(
    mixins.CreateModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet
):
    queryset = FeedbackComment.objects.all()
    serializer_class = FeedbackCommentSerializer
    filterset_class = FeedbackCommentsFilterSet


class EventViewSet(
    mixins.CreateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Event.objects.all()
    serializer_class = EventSerializer


class ResultFormViewSet(viewsets.ModelViewSet):
    queryset = ResultForm.objects.filter(active=True)
    serializer_class = ResultFormSerializer


@method_decorator(
    swagger_auto_schema(
        operation_description="Endpoint used by mobile client to save results after watching video by user."
    ),
    name="create",
)
class WatchResultViewSet(
    mixins.CreateModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet
):
    queryset = WatchResult.objects.filter()
    serializer_class = WatchResultSerializer
    filterset_class = WatchResultFilterSet


class MissingVideoViewSet(
    mixins.CreateModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet
):
    queryset = MissingVideo.objects.all()
    serializer_class = MissingVideoSerializer
    filterset_class = MissingVideoFilterSet
