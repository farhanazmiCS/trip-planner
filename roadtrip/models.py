from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import date, time

# Create your models here.
class User(AbstractUser):
    friends = models.ManyToManyField('User', related_name='friend')

class Trip(models.Model):
    name = models.TextField(unique=True)
    waypoints = models.ManyToManyField('Waypoint', related_name='waypoint')
    users = models.ManyToManyField(User, related_name='trip')

class Waypoint(models.Model):
    text = models.TextField(null=True)
    place_name = models.TextField(null=True)
    dateFrom = models.DateField(default=None, null=True)
    timeFrom = models.TimeField(default=None, null=True)
    dateTo = models.DateField(default=None, null=True)
    timeTo = models.TimeField(default=None, null=True)
    todo = models.ManyToManyField('Todo')

class Todo(models.Model):
    task = models.TextField(null=True)

class Notification(models.Model):
    frm = models.ForeignKey(User, on_delete=models.CASCADE, related_name='my_requests')
    to = models.ForeignKey(User, on_delete=models.CASCADE, related_name='my_notifications')
    is_addFriend = models.BooleanField(default=False)
    is_inviteToTrip = models.BooleanField(default=False)
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, null=True, related_name='trip')
