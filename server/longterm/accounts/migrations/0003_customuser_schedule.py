# Generated by Django 3.2.8 on 2021-11-03 18:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0002_customuser_config_file"),
    ]

    operations = [
        migrations.AddField(
            model_name="customuser",
            name="schedule",
            field=models.JSONField(default={}),
            preserve_default=False,
        ),
    ]