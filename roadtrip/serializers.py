from rest_framework import serializers

from .models import Todo, Trip, User, Waypoint


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 
            'username', 
            'email', 
        ]

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ['id', 'task']

class WaypointSerializer(serializers.ModelSerializer):
    todo = TodoSerializer(many=True, read_only=True)
    class Meta:
        model = Waypoint
        fields = [
            'id', 
            'text', 
            'place_name', 
            'dateFrom', 
            'timeFrom',
            'dateTo',
            'timeTo', 
            'todo'
        ]
class TripSerializer(serializers.ModelSerializer):
    waypoints = WaypointSerializer(many=True, read_only=True)
    users = UserSerializer(many=True, read_only=True)
    class Meta:
        model = Trip()
        fields = [
            'id', 
            'name',
            'waypoints',
            'users'
        ]
