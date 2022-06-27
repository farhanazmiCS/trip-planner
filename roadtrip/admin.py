from django.contrib import admin

from .models import Todo, Trip, User, Waypoint

admin.site.register(User)
admin.site.register(Trip)
admin.site.register(Waypoint)
admin.site.register(Todo)
