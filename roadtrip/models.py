from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    pass

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
