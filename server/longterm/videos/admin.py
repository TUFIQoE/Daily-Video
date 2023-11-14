from django.contrib import admin

from longterm.videos.models import FeedbackComment, WatchResult


@admin.register(FeedbackComment)
class FeedbackCommentAdmin(admin.ModelAdmin):
    pass


@admin.register(WatchResult)
class WatchResultAdmin(admin.ModelAdmin):
    list_display = ("__str__", "date", "get_external_id")
    date_hierarchy = "date"
    list_filter = ("user",)

    @admin.display(description="External ID", ordering="user__schedule__external_id")
    def get_external_id(self, obj: WatchResult):
        return obj.user.schedule.get("external_id")
