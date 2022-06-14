from rest_framework import serializers
from .models import Notification, Todo, User, Trip, Waypoint


class FriendSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 
            'username', 
            'email'
        ]

class UserSerializer(serializers.ModelSerializer):
    friends = FriendSerializer(many=True, read_only=True)
    class Meta:
        model = User
        fields = [
            'id', 
            'username', 
            'email', 
            'friends', 
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

class NotificationSerializer(serializers.ModelSerializer):
    frm = UserSerializer(read_only=True)
    to = UserSerializer(read_only=True)
    trip = TripSerializer(read_only=True)
    class Meta:
        model = Notification()
        fields = [
            'id',
            'frm',
            'to',
            'add_friend',
            'invite_to_trip',
            'trip'
        ]