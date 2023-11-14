import uuid
from typing import Any

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.db import models
from django.utils.translation import gettext_lazy as _
from django_json_widget.widgets import JSONEditorWidget
from rest_framework.authtoken.models import Token

from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    fieldsets = (
        (None, {"fields": ("username", "password", "schedule")}),
        (_("Personal info"), {"fields": ("first_name", "last_name", "email")}),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )
    formfield_overrides = {
        models.JSONField: {"widget": JSONEditorWidget},
    }

    def save_model(
        self, request: Any, obj: CustomUser, form: Any, change: bool
    ) -> None:
        obj.username = obj.username or str(uuid.uuid4())
        super().save_model(request, obj, form, change)
        if not change:
            Token.objects.create(user=obj, key=Token.generate_key())
