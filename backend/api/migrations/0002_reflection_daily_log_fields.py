# Generated manually for the daily UI log sync.

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="reflection",
            name="counter_duration_seconds",
            field=models.PositiveSmallIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="reflection",
            name="log_date",
            field=models.DateField(db_index=True, default=django.utils.timezone.localdate),
        ),
        migrations.AddField(
            model_name="reflection",
            name="reason_id",
            field=models.CharField(blank=True, max_length=32),
        ),
        migrations.AlterModelOptions(
            name="reflection",
            options={"ordering": ["-log_date", "-logged_at"]},
        ),
    ]
