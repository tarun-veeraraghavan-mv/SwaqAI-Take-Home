# Generated by Django 5.2.4 on 2025-07-25 16:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Channel",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("channel_id", models.TextField()),
                ("title", models.TextField()),
                ("description", models.TextField()),
                ("thumbnail", models.TextField()),
                ("published_at", models.TextField()),
                ("subscriber_count", models.IntegerField()),
                ("video_count", models.IntegerField()),
                ("view_count", models.IntegerField()),
            ],
        ),
    ]
