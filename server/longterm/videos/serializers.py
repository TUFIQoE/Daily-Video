from django.db import models
from rest_framework import serializers

from longterm.videos.models import Event, FeedbackComment, ResultForm, WatchResult, MissingVideo


class FeedbackCommentSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    external_id = serializers.SerializerMethodField()

    class Meta:
        model = FeedbackComment
        fields = ("video", "user", "external_id", "date", "comment")

    def get_external_id(self, obj: FeedbackComment):
        return obj.user.schedule.get("external_id", "")


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ("user", "event")


class ResultFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResultForm
        fields = ("token", "form_config")


class WatchResultJSONField(serializers.JSONField):
    def to_representation(self, value):
        if value.get("video") and (
            feedback_comment := FeedbackComment.objects.filter(
                video=value.get("video"), user=self.parent.instance.user
            ).first()
        ):
            feedback_comment_data = FeedbackCommentSerializer(feedback_comment).data
            value["user_feedback"] = feedback_comment_data
        else:
            value["user_feedback"] = None
        print(value)
        return super().to_representation(value)


class WatchResultListSerializer(serializers.ListSerializer):
    def to_representation(self, data):
        iterable = data.all() if isinstance(data, models.Manager) else data
        return [type(self.child)(item).to_representation(item) for item in iterable]


class WatchResultSerializer(serializers.ModelSerializer):

    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    external_id = serializers.SerializerMethodField()
    result = WatchResultJSONField()

    class Meta:
        model = WatchResult
        fields = ("user", "external_id", "date", "result")
        list_serializer_class = WatchResultListSerializer

    def get_external_id(self, obj: FeedbackComment):
        return obj.user.schedule.get("external_id", "")


class MissingVideoSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    external_id = serializers.SerializerMethodField()

    class Meta:
        model = MissingVideo
        fields = ("user", "external_id", "date", "video")

    def get_external_id(self, obj: FeedbackComment):
        return obj.user.schedule.get("external_id", "")

