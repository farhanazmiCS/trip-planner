import requests
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from roadtrip.models import Notification, Todo, Trip, User, Waypoint

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

    def auth_user1(self):
        """ Authenticate user1 """
        login_request = self.client.post('http://127.0.0.1:8000/api/login/', {
            'username': self.user1.username,
            'password': 'Iamacunt123!'
        }, format='json')
        data = login_request.data
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer ' + data["access"])

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
        response = self.client.post('/users/register/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_register_username_already_exists(self):
        """ Tests user registration for already existing username """
        data = {
            'email': 'user1@test.com',
            'username': 'user1',
            'password': 'Iamacunt123!',
            'confirm': 'Iamacunt123!' 
        }
        response = self.client.post('/users/register/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

    def test_register_password_validation_fail(self):
        """ Tests password validation function when registering a user """
        data = {
            'email': 'test1@test.com',
            'username': 'test1',
            'password': 'Iamacunt123',
            'confirm': 'Iamacunt123' 
        }
        response = self.client.post('/users/register/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_password_not_same(self):
        """ Tests if the password and confirm fields are the same """
        data = {
            'email': 'test1@test.com',
            'username': 'test1',
            'password': 'Iamacunt123!',
            'confirm': 'Iamacunt123' 
        }
        response = self.client.post('/users/register/', data, format='json')
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
        self.auth_user1()      
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
        self.api_authenticate_user(self.user)

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

    def api_authenticate_user(self, user):
        """ Authenticates the test user """
        login_request = self.client.post('http://127.0.0.1:8000/api/login/', {
            'username': user.username,
            'password': 'Iamacunt123!'
        }, format='json')
        data = login_request.data
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer ' + data["access"])

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
        self.api_authenticate_user(self.user2) # user2 will now be request.user
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
    def setUp(self):
        """ Setup user profile(s) """
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

        self.user3 = User.objects.create_user(
            email='user3@test.com',
            username='user3',
            password='Iamacunt123!'
        )

        """ Setup trip, waypoints and todo objects """
        self.trip = Trip.objects.create(name='Test trip')
        self.trip.users.add(self.user2)
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

        """ Setup friend request and trip invite notification """
        self.notification1 = Notification.objects.create(
            frm=self.user2,
            to=self.user1,
            add_friend=True,
            invite_to_trip=False
        )
        self.notification2 = Notification.objects.create(
            frm=self.user2,
            to=self.user1,
            add_friend=False,
            invite_to_trip=True,
            trip=self.trip
        )

    def api_authenticate_user(self, user):
        """ Authenticates the test user """
        login_request = self.client.post('http://127.0.0.1:8000/api/login/', {
            'username': user.username,
            'password': 'Iamacunt123!'
        }, format='json')
        data = login_request.data
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer ' + data["access"])

    def test_list(self):
        """ Test the list() function, list all notifications RECEIVED by user1 """
        self.api_authenticate_user(self.user1)
        request = self.client.get('/notifications/')
        self.assertEqual(request.status_code, status.HTTP_200_OK)
        self.assertEqual(self.user1.my_notifications.count(), 2)
    
    def test_my_requests_friends(self):
        """ Test the my_requests_friends() function """
        self.api_authenticate_user(self.user2)
        request = self.client.get('/notifications/my_requests_friends/')
        self.assertEqual(request.status_code, status.HTTP_200_OK)
        self.assertEqual(self.user2.my_requests.filter(add_friend=True).count(), 1)
       
        """ Test for unauthenticated users """
        self.client.force_authenticate(user=None)
        self.assertEqual(self.client.get('/notifications/my_requests_friends/').status_code, status.HTTP_302_FOUND)

    def test_my_requests_trips(self):
        """ Test the my_requests_trips() function """
        self.api_authenticate_user(self.user2)
        request = self.client.get('/notifications/my_requests_trips/')
        self.assertEqual(request.status_code, status.HTTP_200_OK)
        self.assertEqual(self.user2.my_requests.filter(invite_to_trip=True).count(), 1)

        """ Test for unauthenticated users """
        self.client.force_authenticate(user=None)
        self.assertEqual(self.client.get('/notifications/my_requests_trips/').status_code, status.HTTP_302_FOUND)

    def test_send_request(self):
        """ Test sending a friend request """
        payload_friend_request = {
            'username': self.user3.username,
            'toAddUsername': self.user1.username,
            'add_friend': 'True'
        }
        response = self.client.post('/notifications/send_request/', payload_friend_request, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        """ Test sending a trip invite """
        payload_trip_invite = {
            'username': self.user2.username,
            'toAddUsername': self.user3.username,
            'invite_to_trip': 'True',
            'trip': self.trip.id
        }
        response = self.client.post('/notifications/send_request/', payload_trip_invite, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        """ Test for no users payload """
        payload_no_users = {
            'abnormal': 'Not normal'
        }
        response = self.client.post('/notifications/send_request/', payload_no_users, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        """ Test if program raises key error if no trip id specified """
        payload_no_trip_specified = {
            'username': self.user2.username,
            'toAddUsername': self.user1.username,
            'invite_to_trip': 'True'
        }
        response = self.client.post('/notifications/send_request/', payload_no_trip_specified, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_notification(self):
        """ Notification exists """
        response = self.client.delete(f'/notifications/{self.notification1.id}/delete_notification/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        """ Notification does not exist """
        response = self.client.delete(f'/notifications/{self.notification2.id + 1}/delete_notification/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        