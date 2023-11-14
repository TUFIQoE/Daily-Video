from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    config_file = models.FileField(blank=True)
    schedule = models.JSONField(default=dict)
