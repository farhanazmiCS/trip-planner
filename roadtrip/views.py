import json
from os import error, stat
from datetime import datetime
from django.contrib import auth
from django.db.models import query
from django.http.response import Http404
from django.shortcuts import get_object_or_404, render
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.reverse import reverse
from rest_framework.authentication import authenticate

from django.contrib.auth import login, logout

from .models import User, Trip, Waypoint, Todo
from .serializers import UserSerializer, TripSerializer
from roadtrip import serializers

# UserViewSet class to list all users, retrieve a user, and to create a user
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    # To get all users
    def list(self, request):
        queryset = self.queryset
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)
    
    # To get an individual user
    def retrieve(self, request, pk=None):
        queryset = self.queryset
        user = get_object_or_404(queryset, pk=pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def create(self, request):
        pass

class TripViewSet(viewsets.ModelViewSet):
    # View to list all the trips for the logged on user
    def list(self, request):
        try:
            user = User.objects.get(user=request.user)
            trips = user.trip.all()
        except Trip.DoesNotExist:
            return Http404
        
        serializer = TripSerializer(trips)
        return Response(serializer.data)
       
    # View to save a trip
    def create(self, request):
        data = json.loads(request.body)
        # Create new trip instance, save it, then add the logged user
        trip = Trip()
        trip.save()
        trip.users.add(request.user.id)
        for waypoint in enumerate(data['waypoints']):
            dateTimeFrom = waypoint[1]['dateFrom'] + ' ' + waypoint[1]['timeFrom']
            dateTimeTo = waypoint[1]['dateTo'] + ' ' + waypoint[1]['timeTo']
            # Save waypoint object
            w = Waypoint(
                text=waypoint[1]['text'],
                place_name=waypoint[1]['place_name'],
                longitude=waypoint[1]['longitude'],
                latitude=waypoint[1]['latitude'],
                dateTimeFrom=datetime.strptime(dateTimeFrom, '%Y-%m-%d %H:%M'),
                dateTimeTo=datetime.strptime(dateTimeTo, '%Y-%m-%d %H:%M'),
            )
            w.save()
            # Add the waypoint to their respective classifications (origin, destination, waypoints)
            if waypoint[0] == 0:
                trip.origin = w
                trip.save()
            elif waypoint[0] == len(data['waypoints']) - 1:
                trip.destination = w
                trip.save()
            else:
                trip.waypoint.add(w)
            # Query todo items, if any
            todos = waypoint[1]['todo']
            if todos == []:
                pass
            else:
                for todo in todos:
                    t = Todo(task=todo['value'])
                    t.save()
                    # Add the todo object into the waypoint object
                    w.todo.add(t)
        return Response(status=200)

class LoginView(APIView):
    def get(self, request):
        return Response(status=200)

    def post(self, request):
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
            
        # Verify username
        try:
            User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({
                'error': f'User of username {username} does not exist.',
            },
            status=400)
        
        # Authenticate user
        user = authenticate(
            request, 
            username=username, 
            password=password
        )

        if user is not None:
            login(request, user)
            # Provide user with auth token
            token = Token.objects.get(user=user)
            # Successful login, return the token
            content = {
                'token': token.key,
                'username': str(request.user),
                'message': 'Authentication success!',
                'status': 200
            }
            return Response(content)
        else:
            message = 'Incorrect passcode.'
            content = {
                'user': str(request.user),  # returns AnonymousUser instance if not authenticated
                'auth': str(request.auth),  # None
                'message': message,
                'status': 400
            }
            return Response(content)
            
class LogoutView(APIView):
    def get(self, request):
        logout(request)
        return Response(reverse('login'))
