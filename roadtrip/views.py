import json
from os import error, stat
from django.contrib import auth
from django.db.models import query
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

from .models import User
from .serializers import UserSerializer
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

class IndexView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
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



            

            



            

    



