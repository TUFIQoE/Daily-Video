from typing import Optional

import django_filters


class ExternalIdFilterSet(django_filters.FilterSet):
    external_id_key: Optional[str] = None

    external_id = django_filters.CharFilter(method="filter_id")

    def filter_id(self, qs, name, value):
        ids = value.split(",")
        return qs.filter(**{self.external_id_key: ids})


class UsersFilterSet(ExternalIdFilterSet):
    external_id_key = "schedule__external_id__in"

