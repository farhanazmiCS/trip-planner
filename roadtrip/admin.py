from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Trip, Waypoint, Todo, Notification

# Register your models here.
admin.site.register(User)
admin.site.register(Trip)
admin.site.register(Waypoint)
admin.site.register(Todo)
admin.site.register(Notification)