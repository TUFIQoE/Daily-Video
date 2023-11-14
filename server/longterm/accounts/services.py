from datetime import timedelta
from pprint import pprint
from typing import Optional

from django.utils import timezone
from django.utils.dateparse import parse_datetime
from django.utils.timezone import is_aware, make_aware
from rest_framework.exceptions import ValidationError

from longterm.accounts.models import CustomUser


class UpdateUserScheduleService:
    DATETIME_FORMAT = "%Y-%m-%dT%H:%M:%S"

    def __init__(self, new_schedule: dict):
        self.new_schedule = new_schedule
        self._user: Optional[CustomUser] = None

    @property
    def user(self):
        if not self._user:
            if not (external_id := self.new_schedule.get("external_id")):
                raise ValidationError("No user identifier specified")
            self._user, created = CustomUser.objects.get_or_create(username=external_id)
            if created:
                self._user.schedule = self.new_schedule
                self._user.first_name = self.new_schedule.get("name", "")
                self._user.last_name = self.new_schedule.get("surname", "")
        return self._user

    @staticmethod
    def parse_datetime(datetime_str: str):
        parsed_datetime = parse_datetime(datetime_str)
        if parsed_datetime and not is_aware(parsed_datetime):
            parsed_datetime = make_aware(parsed_datetime)
        return parsed_datetime

    @staticmethod
    def schedule_as_dict(schedule: list):
        return {item["start"]: item for item in schedule}

    def filter_schedule_by_date(self, begin, schedule: dict):
        return {
            key: value
            for key, value in schedule.items()
            if self.parse_datetime(key).date() >= begin
        }

    def run(self):
        update_since = timezone.localtime().date() + timedelta(days=2)
        current_schedule_map: dict = self.schedule_as_dict(
            self.user.schedule.get("schedule", [])
        )
        items_to_update_map: dict = self.filter_schedule_by_date(
            update_since, self.schedule_as_dict(self.new_schedule["schedule"])
        )
        current_schedule_map.update(items_to_update_map)
        pprint(current_schedule_map)
        self.user.schedule["schedule"] = list(current_schedule_map.values())
        self.user.save()
        return self.user.schedule["schedule"]
