from rest_framework import serializers
from .models import User, Trip

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = ['id, origin, destination, waypoint, users']