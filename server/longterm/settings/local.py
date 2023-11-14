from .base import *

SECRET_KEY = "secret_key"

# ------------- DATABASES -------------
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": env("POSTGRES_DB", "longterm"),
        "USER": env("POSTGRES_USER", "longterm"),
        "PASSWORD": env("POSTGRES_PASSWORD", "longterm"),
        "HOST": env("POSTGRES_HOST", "localhost"),
    }
}
