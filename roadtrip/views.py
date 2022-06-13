import json
from os import error, stat
from datetime import datetime
from time import strptime
from django.contrib import auth
from django.contrib.auth.models import AnonymousUser
from django.core.exceptions import ValidationError, PermissionDenied
from django.db.models import query
from django.http import HttpResponse, HttpResponseForbidden, HttpResponseNotFound, HttpResponseRedirect
from django.http.response import Http404
from django.shortcuts import get_object_or_404, render
from django.utils import translation
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action, api_view, authentication_classes, permission_classes
from rest_framework.reverse import reverse
from rest_framework.authentication import authenticate

from django.contrib.auth import login, logout

from .models import Notification, User, Trip, Waypoint, Todo
from .serializers import NotificationSerializer, TodoSerializer, UserSerializer, TripSerializer, WaypointSerializer
from roadtrip import serializers

from django.contrib.auth.password_validation import password_validators_help_texts, validate_password
from django.db import IntegrityError

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
        data = request.POST
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
                # Create token for user
                token = Token.objects.create(user=user)
                # Provide a response to the client
                response = {
                    'username': request.user.username,
                    'token': token.key,
                    'status': 201
                }
                return Response(response, status=201)

    @action(methods=['PUT'], detail=True)
    def add_friend(self, request, pk=None):
        """
        Inserts a new User instance to the 'friends' attribute of a User object.
        
        Params
        
            pk: id of the User to be added as a friend.
        """
        queryset = self.queryset.all()
        user = get_object_or_404(queryset, pk=pk)
        data = json.loads(request.body)
        friend = data.get('friend')
        user.friends.add(friend['id'])
        user.save()
        return Response(status=200)
    
    @action(methods=['DELETE'], detail=True)
    def remove_friend(self, request, pk=None):
        """
        This function will remove each user from their friends' list.

        Params
            
            pk: id of the user to 'unfriend'.
        """
        queryset = self.queryset.all()
        # User objects
        user1 = request.user
        user2 = get_object_or_404(queryset, pk=pk)
        # Remove the user objects from both users
        user1.friends.remove(user2)
        user2.friends.remove(user1)
        # Save changes
        user1.save()
        user2.save()
        return Response(status=200)

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
            trip = Trip(name=data['trip_name'])
            trip.save()
        except IntegrityError:
            response = {
                'error': f'''The title '{data["tripName"]}' has already been used.''',
                'status': 400
            }
            return Response(response, status=400)
        else:
            trip.users.add(request.user)
            waypoints = data['waypoints']
            for waypoint in range(len(waypoints)):
                # Save waypoint object
                w = Waypoint(
                    text=waypoints[waypoint]['text'],
                    place_name=waypoints[waypoint]['place_name'],
                    dateFrom=datetime.strptime(waypoints[waypoint]['dateFrom'], '%Y-%m-%d'),
                    timeFrom=datetime.strptime(waypoints[waypoint]['timeFrom'], '%H:%M'),
                    dateTo=datetime.strptime(waypoints[waypoint]['dateTo'], '%Y-%m-%d'),
                    timeTo=datetime.strptime(waypoints[waypoint]['timeTo'], '%H:%M')
                )
                w.save()  
                trip.waypoints.add(w)
                # Query todo items, if any
                todos = waypoints[waypoint]['todo']
                if todos == []:
                    pass
                else:
                    for todo in todos:
                        t = Todo(task=todo)
                        t.save()
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

    @action(methods=['PUT'], detail=True)
    def add_friend_to_trip(self, request, pk=None):
        """
        Adds a user to the 'users' attribute in a trip object.

        Params

            pk: id of the trip object.
        """
        queryset = self.queryset.all()
        user = request.user
        trip = get_object_or_404(queryset, pk=pk)
        # Add user into the trip
        trip.users.add(user)
        user.save()
        return Response(status=200)

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

class NotificationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for the Notification class.

    Methods: list(), my_requests_friends(), my_requests_trips(),
             send_request(), delete_notification()
    """
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
   
    def list(self, request):
        """
        Lists all the notifications for request.user.
        """
        user = request.user 
        try:
            notifications = user.my_notifications.all()
        except AttributeError:
            return HttpResponseRedirect('http://127.0.0.1:8000/api-auth/login')
        else:
            serializer = self.serializer_class(notifications, many=True)
            return Response(serializer.data)

    
    @action(methods=['GET'], detail=False)
    def my_requests_friends(self, request):
        """
        Lists all the friend requests made by request.user.
        """
        user = request.user
        try:
            friend_requests = user.my_requests.filter(is_addFriend=True)
        except AttributeError:
            return HttpResponseRedirect('http://127.0.0.1:8000/api-auth/login')
        else:
            serializer = self.serializer_class(friend_requests, many=True)
            return Response(serializer.data)

    
    @action(methods=['GET'], detail=False)
    def my_requests_trips(self, request):
        """
        Lists all the trip invites made by request.user.
        """
        user = request.user
        try:
            trip_requests = user.my_requests.filter(is_inviteToTrip=True)
        except AttributeError:
            return HttpResponseRedirect('http://127.0.0.1:8000/api-auth/login')
        else:
            serializer = self.serializer_class(trip_requests, many=True)
            return Response(serializer.data)

    
    @action(methods=['POST'], detail=False)
    def send_request(self, request):
        """
        Send a notification by creating a new notification object, 
        either a friend request, or a trip invite.
        """
        data = json.loads(request.body)
        # Retrieve user objects
        user = User.objects.get(username=data.get('username'))
        userToAdd = User.objects.get(username=data.get('toAddUsername'))
        if data.get('is_addFriend') is not None:
            new_notification = Notification(
                frm=user,
                to=userToAdd,
                is_addFriend=True
            )
            new_notification.save()
        elif data.get('is_inviteToTrip') is not None:
            # Retrieve trip id
            trip = data['trip']
            new_notification = Notification(
                frm=user,
                to=userToAdd,
                is_inviteToTrip=True,
                trip=Trip.objects.get(id=trip)
            )
            new_notification.save()
        return Response(status=200)

    @action(methods=['DELETE'], detail=True)
    def delete_notification(self, request, pk=None):
        """
        Deletes a notification object. Used when a user accepts/decline a notification.

        Params

            pk: id of notification object to delete.
        """
        queryset = self.queryset.all()
        notification = get_object_or_404(queryset, pk=pk)
        notification.delete()
        return Response(status=200)       

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
            # Provide user with auth token
            token = Token.objects.get(user=user)
            # Successful login, return the token
            content = {
                'token': token.key,
                'username': user.username,
                'message': 'Authentication success!',
                'status': 200
            }
            return Response(content, status=200)
        else:
            message = 'Password is incorrect. Try again.'
            content = {
                'user': str(request.user),  # returns AnonymousUser instance if not authenticated
                'auth': str(request.auth),  # None
                'message': message,
                'status': 401
            }
            return Response(content, status=401)     
