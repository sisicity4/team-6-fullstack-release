from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from django.contrib.auth.models import User

from api.models import WorkoutSession


class Command(BaseCommand):
    help = "List users who have not logged workouts recently."

    def add_arguments(self, parser):
        parser.add_argument("--days", type=int, default=7)

    def handle(self, *args, **options):
        days = options["days"]
        threshold = timezone.now() - timedelta(days=days)
        active_user_ids = (
            WorkoutSession.objects.filter(performed_at__gte=threshold)
            .values_list("user_id", flat=True)
            .distinct()
        )
        inactive_users = (
            User.objects.exclude(id__in=active_user_ids)
            .values_list("username", flat=True)
            .order_by("username")
        )

        self.stdout.write("Inactive users:")
        for username in inactive_users:
            self.stdout.write(f"- {username}")
