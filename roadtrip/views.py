import json
from os import error, stat
from datetime import datetime
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
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # To get all users
    def list(self, request):
        # queryset.all() is called to update the trip_counter attribute
        # as the queryset is cached.
        queryset = self.queryset.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
    
    # To get an individual user
    @action(methods=['GET'], detail=True)
    def get_user(self, request, pk=None):
        queryset = self.queryset.all()
        user = get_object_or_404(queryset, pk=pk)
        serializer = self.serializer_class(user)
        return Response(serializer.data)

    @action(methods=['POST'], detail=False)
    def register(self, request):
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
                    'status': 400
                }
                return Response(response, status=400)
            else:
                # Create token for user
                token = Token.objects.create(user=user)
                # Log the user in
                login(request, user)
                response = {
                    'username': request.user.username,
                    'token': token.key,
                    'status': 200
                }
                return Response(response, status=200)

    # Adding friends
    @action(methods=['PUT'], detail=True)
    def add_friend(self, request, pk=None):
        queryset = self.queryset.all()
        user = get_object_or_404(queryset, pk=pk)
        data = json.loads(request.body)
        friend = data.get('friend')
        user.friends.add(friend['id'])
        user.friendCounter = len(user.friends.all())
        user.save()
        return Response(status=200)
    
    # Unfriend
    @action(methods=['DELETE'], detail=True)
    def remove_friend(self, request, pk=None):
        queryset = self.queryset.all()
        # User objects
        user1 = request.user
        user2 = get_object_or_404(queryset, pk=pk)
        # Remove the user objects from both users
        user1.friends.remove(user2)
        user2.friends.remove(user1)
        # Update friendCounter
        user1.friendCounter = len(user1.friends.all())
        user2.friendCounter = len(user2.friends.all())
        # Save changes
        user1.save()
        user2.save()
        return Response(status=200)

class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    # View to list all the trips for the logged on user
    def list(self, request):
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
        queryset = self.queryset.all()
        trip = get_object_or_404(queryset, pk=pk)    
        serializer = self.serializer_class(trip)
        return Response(serializer.data)   

    # View to list all the trips for other users
    @action(methods=['GET'], detail=True)
    def list_other_trip(self, request, pk=None):
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
       
    # View to save a trip
    @action(methods=['POST'], detail=False)
    def save_trip(self, request):
        data = json.loads(request.body)
        # User and trip length
        user = request.user
        # Create new trip instance, save it, then add the logged user
        try:
            trip = Trip(name=data['tripName'])
            trip.save()
        except IntegrityError:
            response = {
                'error': f'''The title '{data["tripName"]}' has already been used.''',
                'status': 400
            }
            return Response(response, status=400)
        else:
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
                        t = Todo(task=todo)
                        t.save()
                        # Add the todo object into the waypoint object
                        w.todo.add(t)
            user.tripCounter = len(user.trip.all())
            user.save()
            return Response(status=200)

    @action(methods=['PUT'], detail=True)
    def add_friend_to_trip(self, request, pk=None):
        queryset = self.queryset.all()
        user = request.user
        trip = get_object_or_404(queryset, pk=pk)
        # Add user into the trip
        trip.users.add(user)
        # Update user trip counter
        user.tripCounter = len(user.trip.all())
        user.save()
        return Response(status=200)

class WaypointViewSet(viewsets.ModelViewSet):
    queryset = Waypoint.objects.all()
    serializer_class = WaypointSerializer
    @action(methods=['GET'], detail=True)
    def get_waypoint(self, request, pk=None):
        queryset = self.queryset.all()
        waypoint = get_object_or_404(queryset, pk=pk)
        serializer = self.serializer_class(waypoint)
        return Response(serializer.data)

class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    @action(methods=['GET'], detail=True)
    def get_todo(self, request, pk=None):
        queryset = self.queryset.all()
        todo = get_object_or_404(queryset, pk=pk)
        serializer = self.serializer_class(todo)
        return Response(serializer.data)

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    # List the notifications of logged on user
    def list(self, request):
        user = request.user 
        try:
            notifications = user.my_notifications.all()
        except AttributeError:
            return HttpResponseRedirect('http://127.0.0.1:8000/api-auth/login')
        else:
            serializer = self.serializer_class(notifications, many=True)
            return Response(serializer.data)

    # List the notification requests made by the user
    @action(methods=['GET'], detail=False)
    def my_requests_friends(self, request):
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
        user = request.user
        try:
            trip_requests = user.my_requests.filter(is_inviteToTrip=True)
        except AttributeError:
            return HttpResponseRedirect('http://127.0.0.1:8000/api-auth/login')
        else:
            serializer = self.serializer_class(trip_requests, many=True)
            return Response(serializer.data)

    # Sending notification to other user
    @action(methods=['POST'], detail=False)
    def send_request(self, request):
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
        queryset = self.queryset.all()
        notification = get_object_or_404(queryset, pk=pk)
        notification.delete()
        return Response(status=200)       

class LoginView(APIView):
    def get(self, request):
        if request.user != None:    
            return Response(status=200)

    def post(self, request):
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
            message = 'Password is incorrect. Try again.'
            content = {
                'user': str(request.user),  # returns AnonymousUser instance if not authenticated
                'auth': str(request.auth),  # None
                'message': message,
                'status': 401
            }
            return Response(content, status=401)     
  
class LogoutView(APIView):
    def get(self, request):
        logout(request)
        return Response(reverse('login'))
