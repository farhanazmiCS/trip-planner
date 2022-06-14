import json

from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from roadtrip.models import User, Trip, Waypoint, Todo
from roadtrip.serializers import UserSerializer

from rest_framework.test import force_authenticate

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
        self.assertEqual(len(request.data), 2)

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

    def test_register_password_not_same(self):
        """ Tests if the password and confirm fields are the same """
        data = {
            'email': 'test1@test.com',
            'username': 'test1',
            'password': 'Iamacunt123!',
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

class TripTestCase(APITestCase):
    def setUp(self):
        """ Setup logged-in user's profile """
        self.user = User.objects.create_user(
            email='user1@test.com',
            username='user1',
            password='Iamacunt123!'
        )
        self.token = Token.objects.create(user=self.user)
        self.api_authenticate_user(self.token)

        """ Setup user2, for testing add_friend_to_trip() function """
        self.user2 = User.objects.create_user(
            email='user2@test.com',
            username='user2',
            password='Iamacunt123!'
        )
        self.token2 = Token.objects.create(user=self.user2)

        """ Setup trip, waypoints and todo objects """
        self.trip = Trip.objects.create(name='Test trip')
        self.trip.users.add(self.user)
        self.w1 = Waypoint.objects.create(
            text='Singapore',
            place_name='Singapore',
            dateFrom='2022-06-13',
            timeFrom='09:00',
            dateTo='2022-06-13',
            timeTo='09:30',
        )
        self.w2 = Waypoint.objects.create(
            text='Switzerland',
            place_name='Zurich',
            dateFrom='2022-06-14',
            timeFrom='09:00',
            dateTo='2022-06-14',
            timeTo='09:30'
        )
        self.todo1 = Todo.objects.create(task='task 1')
        self.todo2 = Todo.objects.create(task='task 2')
        self.w1.todo.add(self.todo1)
        self.w2.todo.add(self.todo2)

    def api_authenticate_user(self, token):
        """ Authenticates the test user """
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")

    def test_list(self):
        """ Test listing the logged on user's trips """
        request = self.client.get('/trips/')
        self.assertEqual(request.status_code, status.HTTP_200_OK)
        self.assertEqual(len(request.data), 1)

    def test_other_list(self):
        """ Test list_other_trip() function """
        self.client.force_authenticate(user=None)
        request_user_present = self.client.get(f'/trips/{self.user.id}/list_other_trip/')
        request_not_user_present = self.client.get(f'/trips/{len(User.objects.all()) + 1}/list_other_trip/')
        self.assertEqual(request_user_present.status_code, status.HTTP_200_OK)
        self.assertEqual(request_not_user_present.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_trip(self):
        """ Test get_trip() function """
        request_exists = self.client.get(f'/trips/{self.trip.id}/')
        request_not_exists = self.client.get(f'/trips/{2}/')
        self.assertEqual(request_exists.status_code, status.HTTP_200_OK)
        self.assertEqual(request_not_exists.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_save_trip(self):
        """ Tests the save_trip() function """
        payload = {
            'trip_name': 'My first trip',
            'waypoints': [{
                'dateFrom': '2022-06-08',
                'timeFrom': '09:00',
                'dateTo': '2022-06-08',
                'timeTo': '09:30',
                'text': 'Singapore',
                'place_name': 'Singapore',
                'todo': [
                    'Hello',
                    'World'
                ]
            }, {
                'dateFrom': '2022-06-09',
                'timeFrom': '09:00',
                'dateTo': '2022-06-09',
                'timeTo': '09:30',
                'text': 'Singapore',
                'place_name': 'Singapore',
                'todo': [
                    'Hi',
                    'World 2'
                ]
            }, {
                'dateFrom': '2022-06-10',
                'timeFrom': '09:00',
                'dateTo': '2022-06-10',
                'timeTo': '09:30',
                'text': 'Singapore',
                'place_name': 'Singapore',
                'todo': [
                    'Cab',
                    'bage'
                ]
            }]
        }
        response = self.client.post('/trips/save_trip/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
    def test_save_changes(self):
        """ Tests the save_changes() function """
        # Payload to test for successful changes
        payload = {
            'trip_name': 'Test Trip',
            'waypoints': [{
                'dateFrom': '2022-06-08',
                'timeFrom': '10:00',
                'dateTo': '2022-06-08',
                'timeTo': '10:30',
                'text': 'Singapore',
                'place_name': 'Singapore',
                'todo': [
                    'Hello',
                    'World',
                    'Changed'
                ]
            }, {
                'dateFrom': '2022-06-09',
                'timeFrom': '11:00',
                'dateTo': '2022-06-09',
                'timeTo': '12:30',
                'text': 'Singapore',
                'place_name': 'Singapore',
                'todo': [
                    'Hi',
                    'World 2',
                    'Change'
                ]
            }, {
                'dateFrom': '2022-06-10',
                'timeFrom': '14:00',
                'dateTo': '2022-06-10',
                'timeTo': '14:45',
                'text': 'Singapore',
                'place_name': 'Singapore',
                'todo': [
                    'Cab',
                    'bage',
                    'Kay'
                ]
            }]
        }
        response = self.client.put(f'/trips/{self.trip.id}/save_changes/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Trip') # Test for trip_name change
        self.assertEqual(response.data['waypoints'][1]['dateFrom'], payload['waypoints'][1]['dateFrom']) # Test for dateFrom change and adding a waypoint
        self.assertEqual(response.data['waypoints'][0]['timeFrom'][:5], payload['waypoints'][0]['timeFrom']) # Test for timeFrom change
        self.assertEqual(response.data['waypoints'][2]['todo'][0]['task'], payload['waypoints'][2]['todo'][0]) # Test for todo change

    def test_add_friend_to_trip(self):
        """ Test add_friend_to_trip() function """
        self.api_authenticate_user(self.token2) # user2 will now be request.user
        response = self.client.put(f'/trips/{self.trip.id}/add_friend_to_trip/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.trip.users.count(), 2)

class WaypointTestCase(APITestCase):
    def test_get_waypoint(self):
        waypoint = Waypoint.objects.create(
            text='Switzerland',
            place_name='Zurich',
            dateFrom='2022-06-14',
            timeFrom='09:00',
            dateTo='2022-06-14',
            timeTo='09:30'
        )
        request_ok = self.client.get(f'/waypoints/{waypoint.id}/get_waypoint/')
        request_not_found = self.client.get(f'/waypoints/{waypoint.id + 1}/get_waypoint/')
        self.assertEqual(request_ok.status_code, status.HTTP_200_OK)
        self.assertEqual(request_not_found.status_code, status.HTTP_404_NOT_FOUND)

class TodoTestCase(APITestCase):
    def test_get_todo(self):
        todo = Todo.objects.create(task='Hello')
        request_ok = self.client.get(f'/todos/{todo.id}/get_todo/')
        request_not_found = self.client.get(f'/todos/{todo.id + 1}/get_todo/')
        self.assertEqual(request_ok.status_code, status.HTTP_200_OK)
        self.assertEqual(request_not_found.status_code, status.HTTP_404_NOT_FOUND)

class NotificationTestCase(APITestCase):
    pass