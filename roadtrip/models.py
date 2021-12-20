from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    friends = models.ManyToManyField('User', related_name='friend')
    friendCounter = models.IntegerField(default=0)
    tripCounter = models.IntegerField(default=0)

class Trip(models.Model):
    name = models.CharField(max_length=50, unique=True)
    origin = models.ForeignKey('Waypoint', on_delete=models.CASCADE, null=True, related_name='origin')
    destination = models.ForeignKey('Waypoint', on_delete=models.CASCADE, null=True, related_name='destination')
    waypoint = models.ManyToManyField('Waypoint', related_name='waypoint')
    users = models.ManyToManyField(User, related_name='trip')

class Waypoint(models.Model):
    text = models.CharField(max_length=100, null=True)
    place_name = models.CharField(max_length=100, null=True)
    longitude = models.DecimalField(decimal_places=4, max_digits=10, null=True)
    latitude = models.DecimalField(decimal_places=4, max_digits=10, null=True)
    dateTimeFrom = models.DateTimeField(default=None, null=True)
    dateTimeTo = models.DateTimeField(default=None, null=True)
    todo = models.ManyToManyField('Todo')

class Todo(models.Model):
    task = models.TextField(null=True)

class Notification(models.Model):
    frm = models.ForeignKey(User, on_delete=models.CASCADE, related_name='my_requests')
    to = models.ForeignKey(User, on_delete=models.CASCADE, related_name='my_notifications')
    is_addFriend = models.BooleanField(default=False)
    is_inviteToTrip = models.BooleanField(default=False)
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, null=True, related_name='trip')
