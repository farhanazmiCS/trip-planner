from django.contrib import admin
from .models import User, Trip, Waypoint, Todo

# Register your models here.
admin.site.register(User)
admin.site.register(Trip)
admin.site.register(Waypoint)
admin.site.register(Todo)