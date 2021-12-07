import json
from os import error, stat
from datetime import datetime
from django.contrib import auth
from django.contrib.auth.models import AnonymousUser
from django.core.exceptions import ValidationError
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
from .serializers import TodoSerializer, UserSerializer, TripSerializer, WaypointSerializer
from roadtrip import serializers

from django.contrib.auth.password_validation import password_validators_help_text_html, validate_password
from django.db import IntegrityError


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
        data = json.loads(request.body)
        # Retrieve fields
        email = data.get('email')
        username = data.get('username')
        password = data.get('password')
        confirm = data.get('confirm')
        # Check if passwords match
        if password != confirm:
            response = {
                'error': 'Passwords must match!'
            }
            return Response(response, status=400)
        # Validate password
        try:
            validate_password(password)
        except ValidationError:
            response = {
                'error': password_validators_help_text_html
            }
            return Response(response, status=400)
        # Create user instance
        try:
            user = User.objects.create_user(
                email=email,
                username=username,
                password=password,
            )
            user.save()
        except IntegrityError:
            response = {
                'error': f'Username of name {username} already exists!'
            }
            return Response(response, status=400)
        # Create token for user
        token = Token.objects.create(user=user)
        # Log the user in
        login(request, user)
        response = {
            'username': request.user.username,
            'token': token.key
        }
        return Response(response, status=200)

class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.all()
    # View to list all the trips for the logged on user
    def list(self, request):
        try:
            user = User.objects.get(username=request.user.username)
            trips = user.trip.all()
        except Trip.DoesNotExist:
            return Http404
        
        serializer = TripSerializer(trips, many=True)
        return Response(serializer.data)

    # View to list all the trips for other users
    def listOther(self, request, pk=None):
        try:
            user = User.objects.get(pk=pk)
            trips = user.trip.all()
        except Trip.DoesNotExist:
            return Http404
        
        serializer = TripSerializer(trips, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = self.queryset
        trip = get_object_or_404(queryset, pk=pk)    
        serializer = TripSerializer(trip)
        return Response(serializer.data)        
       
    # View to save a trip
    def create(self, request):
        data = json.loads(request.body)
        # Create new trip instance, save it, then add the logged user
        try:
            trip = Trip(name=data['tripName'])
            trip.save()
        except IntegrityError:
            response = {
                'error': f'''The title '{data["tripName"]}' has already been used.'''
            }
            return Response(response, status=400)
        trip.users.add(request.user)
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


class WaypointViewSet(viewsets.ModelViewSet):
    queryset = Waypoint.objects.all()
    def retrieve(self, request, pk=None):
        queryset = self.queryset
        waypoint = get_object_or_404(queryset, pk=pk)
        serializer = WaypointSerializer(waypoint)
        return Response(serializer.data)


class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.all()
    def retrieve(self, request, pk=None):
        queryset = self.queryset
        todo = get_object_or_404(queryset, pk=pk)
        serializer = TodoSerializer(todo)
        return Response(serializer.data)

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
            content = {
                'message': f'User of username {username} does not exist.',
                'status': 404
            }
            return Response(content, status=404)
        
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
                'username': request.user.username,
                'message': 'Authentication success!',
                'status': 200
            }
            return Response(content, status=200)
        else:
            message = 'Incorrect passcode.'
            content = {
                'user': str(request.user),  # returns AnonymousUser instance if not authenticated
                'auth': str(request.auth),  # None
                'message': message,
                'status': 400
            }
            return Response(content, status=400)
            
class LogoutView(APIView):
    def get(self, request):
        logout(request)
        return Response(reverse('login'))
