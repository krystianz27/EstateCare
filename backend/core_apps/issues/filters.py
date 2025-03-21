import django_filters
from django.db.models import Q

from .models import Issue


class IssueFilter(django_filters.FilterSet):
    status = django_filters.MultipleChoiceFilter(
        choices=Issue.IssueStatus.choices, method="filter_status"
    )

    class Meta:
        model = Issue
        fields = ["status"]

    def filter_status(self, queryset, name, value):
        return queryset.filter(Q(status__in=value))
