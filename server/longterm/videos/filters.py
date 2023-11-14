import django_filters

from longterm.accounts.filters import ExternalIdFilterSet


class DateFilter(django_filters.FilterSet):
    start_date = django_filters.DateTimeFilter(field_name="date", lookup_expr="gt")
    stop_date = django_filters.DateTimeFilter(field_name="date", lookup_expr="lt")


class FeedbackCommentsFilterSet(DateFilter, ExternalIdFilterSet):
    external_id_key = "user__schedule__external_id__in"


class MissingVideoFilterSet(ExternalIdFilterSet):
    external_id_key = "user__schedule__external_id__in"


class WatchResultFilterSet(DateFilter, ExternalIdFilterSet):

    external_id_key = "user__schedule__external_id__in"
