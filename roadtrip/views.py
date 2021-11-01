from django.db.models import query
from django.shortcuts import get_object_or_404, render
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import User
from .serializers import UserSerializer
from rest_framework.decorators import api_view

from roadtrip import serializers

# Create your views here.
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

    @api_view(['POST'])
    def create(self, request):
        pass
        # if request.method == 'POST':
            # jsonData = json.loads(request.body)
            # username = jsonData.get('username')
            # email = jsonData.get('email')
            # password = jsonData.get('password')
            # confirm = jsonData.get('confirm')

            # if password != confirm:
                # error_response
            
            # Password validation
            # try:
                # validate_password(password=password)
            # except ValidationError:
                # error_response
            
            # Create User Object



