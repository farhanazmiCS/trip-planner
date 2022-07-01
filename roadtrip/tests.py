from datetime import datetime

from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from roadtrip.models import Todo, Trip, User, Waypoint


class UserTestCase(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(
            email='user1@test.com',
            username='user1',
            password='Iamacunt123!'
        )

        self.user2 = User.objects.create_user(
            email='user2@test.com',
            username='user2',
            password='Iamacunt123!'
        )

    def test_list(self):
        """Test list function """
        request = self.client.get('/api/users/')
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
        response = self.client.post('/api/users/register/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_register_empty_fields(self):
        """ Test user registration when a field is empty """
        data = {
            'email': '',
            'username': '',
            'password': 'Iamacunt123!',
            'confirm': ''
        }
        response = self.client.post('/api/users/register/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['message'], 'Empty fields.')
        self.assertEqual(len(response.data['fields']), 3)

    def test_register_email_already_exists(self):
        """ Tests user registration for already existing email """
        data = {
            'email': 'user1@test.com',
            'username': 'test69',
            'password': 'Iamacunt123!',
            'confirm': 'Iamacunt123!' 
        }
        response = self.client.post('/api/users/register/', data, format='json')
        self.assertEqual(response.data['message'], 'Email already used.')
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

    def test_register_username_already_exists(self):
        """ Tests user registration for already existing username """
        data = {
            'email': 'test69@test.com',
            'username': 'user1',
            'password': 'Iamacunt123!',
            'confirm': 'Iamacunt123!' 
        }
        response = self.client.post('/api/users/register/', data, format='json')
        self.assertEqual(response.data['message'], 'Username already used.')
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

    def test_register_password_validation_fail(self):
        """ Tests password validation function when registering a user """
        data = {
            'email': 'test1@test.com',
            'username': 'test1',
            'password': 'Iamacunt123',
            'confirm': 'Iamacunt123' 
        }
        response = self.client.post('/api/users/register/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_password_not_same(self):
        """ Tests if the password and confirm fields are the same """
        data = {
            'email': 'test1@test.com',
            'username': 'test1',
            'password': 'Iamacunt123!',
            'confirm': 'Iamacunt123' 
        }
        response = self.client.post('/api/users/register/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_user_exists(self):
        """ Tests get_user() function """
        request = self.client.get(f'/api/users/{self.user1.id}/')
        self.assertEqual(request.status_code, status.HTTP_200_OK)

    def test_user_does_not_exist(self):
        """ Test get_user() function where user does not exist """
        request = self.client.get(f'/api/users/{3}/')
        self.assertEqual(request.status_code, status.HTTP_404_NOT_FOUND)

class TripTestCase(APITestCase):
    def setUp(self):
        """ Setup logged-in user's profile """
        self.user = User.objects.create_user(
            email='user1@test.com',
            username='user1',
            password='Iamacunt123!'
        )
        self.auth_user1()

        """ Setup user2, for testing add_friend_to_trip() function """
        self.user2 = User.objects.create_user(
            email='user2@test.com',
            username='user2',
            password='Iamacunt123!'
        )

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

    def auth_user1(self):
        """ Authenticate user1 """
        login_request = self.client.post('http://127.0.0.1:8000/api/login/', {
            'username': self.user.username,
            'password': 'Iamacunt123!'
        }, format='json')
        data = login_request.data
        self.client.credentials(HTTP_AUTHORIZATION=f'JWT {data["access"]}')

    def test_list(self):
        """ Test listing the logged on user's trips """
        request = self.client.get('/api/trips/')
        self.assertEqual(request.status_code, status.HTTP_200_OK)
        self.assertEqual(len(request.data), 1)

    def test_other_list(self):
        """ Test list_other_trip() function """
        self.client.force_authenticate(user=None)
        request_user_present = self.client.get(f'/api/trips/{self.user.id}/list_other_trip/')
        request_not_user_present = self.client.get(f'/api/trips/{len(User.objects.all()) + 1}/list_other_trip/')
        self.assertEqual(request_user_present.status_code, status.HTTP_200_OK)
        self.assertEqual(request_not_user_present.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_trip(self):
        """ Test get_trip() function """
        request_exists = self.client.get(f'/api/trips/{self.trip.id}/')
        request_not_exists = self.client.get(f'/api/trips/{2}/')
        self.assertEqual(request_exists.status_code, status.HTTP_200_OK)
        self.assertEqual(request_not_exists.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_save_trip(self):
        """ Tests the save_trip() function """
        payload = {
            'trip_name': 'My first trip',
            'waypoints': [{
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
        response = self.client.post('/api/trips/save_trip/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
    def test_save_changes(self):
        """ Tests the save_changes() function """
        # Payload to test for successful changes
        payload = {
            'trip_name': 'Test Trip',
            'waypoints': [{
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
        response = self.client.put(f'/api/trips/{self.trip.id}/save_changes/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Trip') # Test for trip_name change
        self.assertEqual(response.data['waypoints'][1]['dateFrom'], payload['waypoints'][1]['dateFrom']) # Test for dateFrom change and adding a waypoint
        self.assertEqual(response.data['waypoints'][0]['timeFrom'][:5], datetime.strftime(timezone.now(), '%H:%M')) # Test for timeFrom when key does not exist
        self.assertEqual(response.data['waypoints'][2]['todo'][0]['task'], payload['waypoints'][2]['todo'][0]) # Test for todo change

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
        request_ok = self.client.get(f'/api/waypoints/{waypoint.id}/get_waypoint/')
        request_not_found = self.client.get(f'/api/waypoints/{waypoint.id + 1}/get_waypoint/')
        self.assertEqual(request_ok.status_code, status.HTTP_200_OK)
        self.assertEqual(request_not_found.status_code, status.HTTP_404_NOT_FOUND)

class TodoTestCase(APITestCase):
    def test_get_todo(self):
        todo = Todo.objects.create(task='Hello')
        request_ok = self.client.get(f'/api/todos/{todo.id}/get_todo/')
        request_not_found = self.client.get(f'/api/todos/{todo.id + 1}/get_todo/')
        self.assertEqual(request_ok.status_code, status.HTTP_200_OK)
        self.assertEqual(request_not_found.status_code, status.HTTP_404_NOT_FOUND)
