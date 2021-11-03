import json
from os import error
from django.db.models import query
from django.shortcuts import get_object_or_404, render
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, authentication_classes

from django.contrib.auth import authenticate, login



from .models import User
from .serializers import UserSerializer
from roadtrip import serializers

# UserViewSet class to list all users, retrieve a user, and to create a user
class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
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

@api_view(['POST'])
@authentication_classes([SessionAuthentication])
def login_view(request):
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
        return Response({
            'success': 'Log in success!',
        }, 
        status=200)
    else:
        return Response({
            'error': 'Incorrect password.'
        },
        status=400)

@api_view(['GET'])
def authenticated_view(request):
    pass

            

            



            

    



