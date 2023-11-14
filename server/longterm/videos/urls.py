from typing import Any, List

from rest_framework.routers import DefaultRouter

from longterm.videos.views import (
    EventViewSet,
    FeedbackCommentViewSet,
    ResultFormViewSet,
    WatchResultViewSet, MissingVideoViewSet,
)

router = DefaultRouter()
router.register("events", EventViewSet)
router.register("forms", ResultFormViewSet)
router.register("feedback-comments", FeedbackCommentViewSet)
router.register("watch-results", WatchResultViewSet)
router.register("missing-videos", MissingVideoViewSet)

urlpatterns: List[Any] = []
