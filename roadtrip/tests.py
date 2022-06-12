import json

from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from roadtrip.models import User
from roadtrip.serializers import UserSerializer

class UserTestCase(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(
            email='user1@test.com',
            username='user1',
            password='Iamacunt123!'
        )
        self.token1 = Token.objects.create(user=self.user1)

        self.user2 = User.objects.create_user(
            email='user2@test.com',
            username='user2',
            password='Iamacunt123!'
        )
        self.token2 = Token.objects.create(user=self.user2)

        self.api_authenticate_user1()

    def api_authenticate_user1(self):
        """ Authenticates test account, user1 for testing """
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token1.key}")

    def test_list(self):
        """Test list function """
        request = self.client.get('/users/')
        self.assertEqual(request.status_code, status.HTTP_200_OK)

    def test_register(self):
        """ Tests user registration function """
        data = {
            'email': 'test1@test.com',
            'username': 'test1',
            'password': 'Iamacunt123!',
            'confirm': 'Iamacunt123!' 
        }
        response = self.client.post('/users/register/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_register_username_already_exists(self):
        """ Tests user registration for already existing username """
        data = {
            'email': 'user1@test.com',
            'username': 'user1',
            'password': 'Iamacunt123!',
            'confirm': 'Iamacunt123!' 
        }
        response = self.client.post('/users/register/', data)
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

    def test_register_password_validation_fail(self):
        """ Tests password validation function when registering a user """
        data = {
            'email': 'test1@test.com',
            'username': 'test1',
            'password': 'Iamacunt123',
            'confirm': 'Iamacunt123' 
        }
        response = self.client.post('/users/register/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_user_exists(self):
        """ Tests get_user() function """
        request = self.client.get(f'/users/{self.user1.id}/')
        self.assertEqual(request.status_code, status.HTTP_200_OK)

    def test_user_does_not_exist(self):
        """ Test get_user() function where user does not exist """
        request = self.client.get(f'/users/{3}/')
        self.assertEqual(request.status_code, status.HTTP_404_NOT_FOUND)

    def add_friend(self):
        """ Call add_friend() function """
        data = {
            'friend': {
                'id': 2,
                'username': 'user2'
            }
        }
        return self.client.put(f'/users/{self.user1.id}/add_friend/', data, format='json')
        
    def test_add_friend(self):
        """ Test add_friend() function """
        self.assertEqual(self.add_friend().status_code, status.HTTP_200_OK)

    def test_remove_friend(self):
        """ Test remove_friend() function """
        self.add_friend()
        response = self.client.delete(f'/users/{2}/remove_friend/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


        

    