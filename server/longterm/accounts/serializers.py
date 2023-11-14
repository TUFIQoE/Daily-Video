from djoser.conf import settings
from rest_framework import serializers

from longterm.accounts.models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = (
            "id",
            "username",
        )


class UserConfigSerializer(serializers.Serializer):
    schedule = serializers.JSONField(read_only=True)

    class Meta:
        read_only_fields = ("schedule",)


class UserExternalIdSerializer(serializers.Serializer):
    external_id = serializers.CharField(source="username")


class TokenCreateSerializer(serializers.Serializer):
    user = None

    external_id = serializers.CharField()

    default_error_messages = {
        "invalid_credentials": settings.CONSTANTS.messages.INVALID_CREDENTIALS_ERROR,
        "inactive_account": settings.CONSTANTS.messages.INACTIVE_ACCOUNT_ERROR,
    }

    def validate(self, data):
        if user := CustomUser.objects.filter(
            schedule__external_id=data["external_id"],
        ).first():
            self.user = user
            return data
        self.fail("invalid_credentials")


class DataSerializer(serializers.Serializer):
    name = serializers.CharField()
    surname = serializers.CharField()

    def validate(self):
        self.fail("beznadziejny serializer")


class CompanySerializer(serializers.Serializer):
    company_name = serializers.CharField()
    city = serializers.CharField()
    boss = DataSerializer()


# { prefix + separator + k if prefix else k : v
#              for kk, vv in dd.items()
#              for k, v in flatten_dict(vv, separator, kk).items()
#              } if isinstance(dd, dict) else { prefix : dd }


def simplify(errors, prefix="") -> dict:
    separator = "."
    result = []
    if isinstance(errors, dict):
        for kk, vv in errors.items():
            for k in simplify(vv, kk):
                result.append(f"{prefix}{separator}{k}" if prefix else k)
    else:
        result.append(prefix)
    return result
