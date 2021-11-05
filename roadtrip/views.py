import json
from os import error
from django.contrib import auth
from django.db.models import query
from django.shortcuts import get_object_or_404, render
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.reverse import reverse

from django.contrib.auth import authenticate, login, logout

from .models import User
from .serializers import UserSerializer
from roadtrip import serializers

# UserViewSet class to list all users, retrieve a user, and to create a user
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    # To get all users
    @api_view(['GET'])
    def list(self, request):
        queryset = self.queryset
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)
    
    # To get an individual user
    @api_view(['GET'])
    def retrieve(self, request, pk=None):
        queryset = self.queryset
        user = get_object_or_404(queryset, pk=pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    @api_view(['POST'])
    def create(self, request):
        pass


@api_view(['GET'])
def auth_view(request):
    if request.user.is_authenticated:
        content = {
            'user': str(request.user),
            'auth': str(request.auth)
        }
        return Response(content, status=200)
    else:
        return Response(reverse(login_view))


@api_view(['GET', 'POST'])
@authentication_classes([SessionAuthentication])
def login_view(request):
    if request.method == 'POST':
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
            return Response(reverse(auth_view))
        else:
            message = 'Incorrect passcode.'
            content = {
                'user': str(request.user),  # returns AnonymousUser instance if not authenticated
                'auth': str(request.auth),  # None
                'status': message
            }
            return Response(content, status=400)
    return Response(status=200)
            

@api_view(['GET'])
def logout_view(request):
    logout(request)
    return Response(reverse(login_view))
            

            



            

    



