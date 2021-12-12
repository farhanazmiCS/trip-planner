# Generated by Django 3.2.4 on 2021-12-12 09:59

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('roadtrip', '0010_remove_trip_users'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='notifications',
        ),
        migrations.AddField(
            model_name='trip',
            name='users',
            field=models.ManyToManyField(related_name='trip', to=settings.AUTH_USER_MODEL),
        ),
    ]
