from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    email = models.EmailField(_('email address'), blank=True, unique=True)

class Trip(models.Model):
    name = models.TextField(unique=True)
    waypoints = models.ManyToManyField('Waypoint', related_name='waypoint')
    users = models.ManyToManyField(User, related_name='trip')

class Waypoint(models.Model):
    text = models.TextField(null=True)
    place_name = models.TextField(null=True)
    dateFrom = models.DateField(default=timezone.now, null=True)
    timeFrom = models.TimeField(default=timezone.now, null=True)
    dateTo = models.DateField(default=timezone.now, null=True)
    timeTo = models.TimeField(default=timezone.now, null=True)
    todo = models.ManyToManyField('Todo')

class Todo(models.Model):
    task = models.TextField(null=True)
