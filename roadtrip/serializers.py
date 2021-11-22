from rest_framework import serializers
from .models import Todo, User, Trip, Waypoint

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip()
        fields = ['id', 'origin', 'destination', 'waypoint', 'users']

class WaypointSerializer(serializers.ModelSerializer):
    class Meta:
        model = Waypoint
        fields = ['id', 'text', 'place_name', 'longitude', 'latitude', 'dateTimeFrom', 'dateTimeTo', 'todo']

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ['id', 'task']