import uuid

from django.conf import settings
from django.db import models


class FeedbackComment(models.Model):
    video = models.CharField(max_length=1024)
    date = models.DateTimeField()
    comment = models.TextField()

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)

    def __str__(self):
        return f"Feedback for {self.video} from user_id {self.user_id}"


class Event(models.Model):
    user = models.ForeignKey("accounts.CustomUser", on_delete=models.CASCADE)
    event = models.JSONField()


class ResultForm(models.Model):
    token = models.UUIDField(primary_key=True, default=uuid.uuid4)
    form_config = models.JSONField(blank=False, null=False)
    active = models.BooleanField(default=True, blank=True)


class WatchResult(models.Model):
    date = models.DateTimeField()
    result = models.JSONField()
    user = models.ForeignKey("accounts.CustomUser", on_delete=models.CASCADE)

    def __str__(self):
        return f"Result {self.date.date()}"


class MissingVideo(models.Model):
    date = models.DateTimeField()
    video = models.CharField(max_length=1024)

    user = models.ForeignKey("accounts.CustomUser", on_delete=models.CASCADE)
