# Generated by Django 4.0.1 on 2022-06-06 12:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('roadtrip', '0017_alter_trip_name_alter_waypoint_place_name_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='trip',
            old_name='waypoint',
            new_name='waypoints',
        ),
        migrations.RemoveField(
            model_name='trip',
            name='destination',
        ),
        migrations.RemoveField(
            model_name='trip',
            name='origin',
        ),
        migrations.RemoveField(
            model_name='user',
            name='friendCounter',
        ),
        migrations.RemoveField(
            model_name='user',
            name='tripCounter',
        ),
        migrations.RemoveField(
            model_name='waypoint',
            name='dateTimeFrom',
        ),
        migrations.RemoveField(
            model_name='waypoint',
            name='dateTimeTo',
        ),
        migrations.RemoveField(
            model_name='waypoint',
            name='latitude',
        ),
        migrations.RemoveField(
            model_name='waypoint',
            name='longitude',
        ),
        migrations.AddField(
            model_name='waypoint',
            name='dateFrom',
            field=models.DateField(default=None, null=True),
        ),
        migrations.AddField(
            model_name='waypoint',
            name='dateTo',
            field=models.DateField(default=None, null=True),
        ),
        migrations.AddField(
            model_name='waypoint',
            name='timeFrom',
            field=models.TimeField(default=None, null=True),
        ),
        migrations.AddField(
            model_name='waypoint',
            name='timeTo',
            field=models.TimeField(default=None, null=True),
        ),
    ]
