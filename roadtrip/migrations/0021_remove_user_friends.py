# Generated by Django 4.0.1 on 2022-06-27 02:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('roadtrip', '0020_delete_notification'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='friends',
        ),
    ]
