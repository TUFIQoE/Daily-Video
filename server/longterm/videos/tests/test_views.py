import datetime

import pytest
import pytz
from django.urls import reverse

from longterm.videos.models import FeedbackComment, WatchResult


class TestFeedbackCommentViewSet:
    def setup_method(self):
        self.data = {
            "video": "some/video/video.mp4",
            "date": "2021-11-27T22:04:00",
            "comment": "feedback",
        }

    def test_create_feedback_comment(self, admin_client, admin_user):

        response = admin_client.post(reverse("feedbackcomment-list"), data=self.data)

        assert response.status_code == 201, response.data
        obj = FeedbackComment.objects.get()

        assert obj.user == admin_user
        assert obj.date == datetime.datetime(2021, 11, 27, 21, 4, 0, tzinfo=pytz.UTC)


class TestWatchResultViewSet:
    def setup_method(self):
        self.data = {
            "date": "2021-11-27T22:04:00",
            "result": {"some_key": "some_value"},
        }

    def test_create_watch_rsult(self, admin_client, admin_user):
        response = admin_client.post(
            reverse("watchresult-list"), data=self.data, content_type="application/json"
        )

        assert response.status_code == 201, response.data
        obj = WatchResult.objects.get()

        assert obj.user == admin_user
        assert obj.date == datetime.datetime(2021, 11, 27, 21, 4, 0, tzinfo=pytz.UTC)
