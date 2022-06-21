import json
from datetime import datetime

import requests
from django.contrib.auth.password_validation import (
    password_validators_help_texts, validate_password)
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.authentication import authenticate
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Todo, Trip, User, Waypoint
from .serializers import (TodoSerializer, TripSerializer, UserSerializer,
                          WaypointSerializer)


# UserViewSet class to list all users, retrieve a user, and to create a user
class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for the User class. 

    Methods: list(), get_user(), register(), add_friend(), 
             remove_friend()
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def list(self, request):
        """
        Lists all the users, and their associated information.
        """
        # queryset.all() is called to update the trip_counter attribute
        # as the queryset is cached.
        queryset = self.queryset.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
    
    @action(methods=['GET'], detail=True)
    def get_user(self, request, pk=None):
        """
        Retrieves an information of a user.

        Params
            
            pk: id of the user.
        """
        queryset = self.queryset.all()
        user = get_object_or_404(queryset, pk=pk)
        serializer = self.serializer_class(user)
        return Response(serializer.data)

    @action(methods=['POST'], detail=False)
    def register(self, request):
        """
        Registers a new user by creating a new User instance.
        """
        data = json.loads(request.body)
        # Retrieve fields
        email = data.get('email')
        username = data.get('username')
        password = data.get('password')
        confirm = data.get('confirm')
        # Check if passwords match
        if password != confirm:
            response = {
                'error': 'Passwords must match!',
                'status': 400
            }
            return Response(response, status=400)
        # Validate password
        try:
            validate_password(password)
        except ValidationError:
            response = {
                'error': password_validators_help_texts(),
                'status': 400
            }
            return Response(response, status=400)
        else:
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
                    'error': f'Username of name {username} already exists!',
                    'status': 409
                }
                return Response(response, status=409)
            else:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token)
                }, status=201)

class TripViewSet(viewsets.ModelViewSet):
    """
    ViewSet for the Trip class.

    Methods: list(), get_trip(), list_other_trip(), save_trip(),
             save_changes(), add_friend_to_trip()
    """
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    
    def list(self, request):
        """
        Lists all of request.user's trips
        """
        try:
            user = request.user
            trips = user.trip.all()
        except AttributeError:
            return HttpResponseRedirect('http://127.0.0.1:8000/api-auth/login')
        else:
            serializer = self.serializer_class(trips, many=True)
            return Response(serializer.data)

    @action(methods=['GET'], detail=True)
    def get_trip(self, request, pk=None):
        """
        Retrieves a trip object.

        Params
            
            pk: id of the trip object.
        """
        queryset = self.queryset.all()
        trip = get_object_or_404(queryset, pk=pk)    
        serializer = self.serializer_class(trip)
        return Response(serializer.data)   

    @action(methods=['GET'], detail=True)
    def list_other_trip(self, request, pk=None):
        """
        Lists the trips of a particular user, given the user's id.

        Params

            pk: The user's id.
        """
        try:
            user = User.objects.get(pk=pk)
            trips = user.trip.all()
        except User.DoesNotExist:
            return Response({
                'error': 'User does not exist!'
            }, status=404)
        else:
            serializer = self.serializer_class(trips, many=True)
            return Response(serializer.data)     
       
    @action(methods=['POST'], detail=False)
    def save_trip(self, request):
        """
        Saves a trip by creating a new trip instance.
        """
        data = json.loads(request.body)
        # User and trip length
        user = request.user
        # Create new trip instance, save it, then add the logged user
        try:
            trip = Trip.objects.create(name=data['trip_name'])
        except IntegrityError:
            response = {
                'error': f'''The title '{data["trip_name"]}' has already been used.''',
                'status': 400
            }
            return Response(response, status=400)
        else:
            trip.users.add(request.user)
            waypoints = data['waypoints']
            for waypoint in range(len(waypoints)):
                # Save waypoint object
                w = Waypoint.objects.create(
                    text=waypoints[waypoint]['text'],
                    place_name=waypoints[waypoint]['place_name'],
                    dateFrom=datetime.strptime(waypoints[waypoint]['dateFrom'], '%Y-%m-%d'),
                    timeFrom=datetime.strptime(waypoints[waypoint]['timeFrom'], '%H:%M'),
                    dateTo=datetime.strptime(waypoints[waypoint]['dateTo'], '%Y-%m-%d'),
                    timeTo=datetime.strptime(waypoints[waypoint]['timeTo'], '%H:%M')
                )
                trip.waypoints.add(w)
                # Query todo items, if any
                todos = waypoints[waypoint]['todo']
                if todos == []:
                    pass
                else:
                    for todo in todos:
                        t = Todo.objects.create(task=todo)
                        # Add the todo object into the waypoint object
                        w.todo.add(t)
            user.save()
            return Response(status=201)

    @action(methods=['PUT'], detail=True)
    def save_changes(self, request, pk=None):
        """
        Saves any changes made to an existing trip object.

        Params
            
            pk: id of the trip to be changed.
        """
        queryset = self.queryset.all()
        # Load the trip
        trip = get_object_or_404(queryset, pk=pk)
        # Load the data
        data = json.loads(request.body)
        if data.get('trip_name') is not None:
            # Get the trip name, and assign it
            trip_name = data['trip_name']
            if trip_name != '':
                try:
                    trip.name = trip_name
                    trip.save()
                except IntegrityError:
                    response = {
                        'error': f'''The title '{data["trip_name"]}' has already been used.''',
                        'status': 400
                    }
                    return Response(response, status=400)
        if data.get('waypoints') is not None:
            # Clear stopovers, if any
            trip.waypoints.clear()
            # Define new waypoints
            new_waypoints = data['waypoints']
            # Create new waypoints
            for waypoint in range(len(new_waypoints)):
                # Save waypoint object
                w = Waypoint(
                    text=new_waypoints[waypoint]['text'],
                    place_name=new_waypoints[waypoint]['place_name'],
                    dateFrom=datetime.strptime(new_waypoints[waypoint]['dateFrom'], '%Y-%m-%d'),
                    timeFrom=datetime.strptime(new_waypoints[waypoint]['timeFrom'], '%H:%M'),
                    dateTo=datetime.strptime(new_waypoints[waypoint]['dateTo'], '%Y-%m-%d'),
                    timeTo=datetime.strptime(new_waypoints[waypoint]['timeTo'], '%H:%M')
                )
                w.save()
                trip.waypoints.add(w)
                # Query todo items, if any
                todos = new_waypoints[waypoint]['todo']
                if todos == []:
                    pass
                else:
                    for todo in todos:
                        t = Todo(task=todo)
                        t.save()
                        # Add the todo object into the waypoint object
                        w.todo.add(t)
        # Provide the updated trip as a response
        serializer = self.serializer_class(trip)
        return Response(serializer.data, status=200)

class WaypointViewSet(viewsets.ModelViewSet):
    """
    ViewSet for the Waypoint class.

    Methods: get_waypoint()
    """
    queryset = Waypoint.objects.all()
    serializer_class = WaypointSerializer
    
    @action(methods=['GET'], detail=True)
    def get_waypoint(self, request, pk=None):
        """
        Retrieve a waypoint object.
        pk: id of the waypoint object.
        """
        queryset = self.queryset.all()
        waypoint = get_object_or_404(queryset, pk=pk)
        serializer = self.serializer_class(waypoint)
        return Response(serializer.data)

class TodoViewSet(viewsets.ModelViewSet):
    """
    ViewSet for the Todo class.

    Methods: get_todo()
    """
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer

    @action(methods=['GET'], detail=True)
    def get_todo(self, request, pk=None):
        """
        Retrieves a todo object.

        Params
            
            pk: id of the todo object.
        """
        queryset = self.queryset.all()
        todo = get_object_or_404(queryset, pk=pk)
        serializer = self.serializer_class(todo)
        return Response(serializer.data)      

class LoginView(APIView):
    def get(self, request):
        """
        Verifies if the user is logged in.
        """
        if not request.user.is_anonymous:    
            return Response(status=200)
        else:
            response = {
                'status': 'logged out'
            }
            return Response(response, status=401)
    
    def post(self, request):
        """
        Takes the username and password and verifies it.

        If username field is empty, returns 404 along with error message.

        If username does not exist, returns 404, along with error message
        indicating that user does not exist.

        Username and Password credentials are verified with authenticate(). 
        If authenticate returns None, user credentials are. Returns 401, and login fails.
        
        Else, provide the token for request authentication, and return a
        response status of 200.
        """
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        # Verify username
        try:
            User.objects.get(username=username)
        except User.DoesNotExist:
            if username == '':
                content = {
                    'message': "Username field empty.",
                    'status': 404
                }
            else:
                content = {
                    'message': f"User of username '{username}' does not exist.",
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
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }, status=200)
        else:
            content = {
                'message': 'Password is incorrect. Try again.',
            }
            return Response(content, status=401)     
