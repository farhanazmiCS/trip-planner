# Generated by Django 4.0.1 on 2022-01-16 15:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('roadtrip', '0014_notification_trip'),
    ]

    operations = [
        migrations.AlterField(
            model_name='trip',
            name='name',
            field=models.CharField(max_length=500, unique=True),
        ),
        migrations.AlterField(
            model_name='waypoint',
            name='place_name',
            field=models.CharField(max_length=1000, null=True),
        ),
        migrations.AlterField(
            model_name='waypoint',
            name='text',
            field=models.CharField(max_length=1000, null=True),
        ),
    ]
