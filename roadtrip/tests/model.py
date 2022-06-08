from datetime import datetime
from django.shortcuts import get_object_or_404
from django.test import TestCase
from roadtrip.models import User, Waypoint, Trip
from django.db.models.query import QuerySet

class UserTestCase(TestCase):
    def setUp(self):
        """ Create test users """
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
    
    queryset = User.objects.all()

    def test_check_queryset(self):
        """ Check if returns a queryset of user objects """
        check_instance = isinstance(self.queryset, QuerySet)
        self.assertEqual(check_instance, True)

    def test_get_user(self):
        """ Check the get_object_or_404 method """
        user = self.user1
        user_shortcut = get_object_or_404(self.queryset, pk=1)
        self.assertEqual(user, user_shortcut)

    def test_add_friend(self):
        """ Check add_friend() function """
        user1 = self.user1
        user2 = self.user2
        user1.friends.add(user2)
        user2.friends.add(user1)
        self.assertEqual(user1.friends.count(), 1)
        self.assertEqual(user2.friends.count(), 1)

    def test_remove_friend(self):
        """ Check remove_friend() function """
        user1 = self.user1
        user2 = self.user2
        user1.friends.add(user2)
        user2.friends.add(user1)
        user1.friends.remove(user2)
        user2.friends.remove(user1)
        self.assertEqual(user1.friends.count(), 0)
        self.assertEqual(user2.friends.count(), 0)

class TripViewSet(TestCase):
    def setUp(self):
        """ Create new waypoint object(s) and a trip object """
        self.w1 = Waypoint(
            text='Singapore',
            place_name='Singapore',
            dateFrom=datetime.strptime('2022-06-08', '%Y-%m-%d'),
            timeFrom=datetime.strptime('19:48', '%H:%M'),
            dateTo=datetime.strptime('2022-06-08', '%Y-%m-%d'),
            timeTo=datetime.strptime('19:55', '%H:%M'),
        )
        self.w1.save()

        self.w2 = Waypoint(
            text='Malaysia',
            place_name='Malysia',
            dateFrom=datetime.strptime('2022-06-08', '%Y-%m-%d'),
            timeFrom=datetime.strptime('20:30', '%H:%M'),
            dateTo=datetime.strptime('2022-06-08', '%Y-%m-%d'),
            timeTo=datetime.strptime('21:00', '%H:%M'),
        )
        self.w2.save()

        self.t = Trip(
            name='Test trip'
        )
        self.t.save()
    
    waypoints = Waypoint.objects.all()
    trip = Trip.objects.all()

    def test_dates(self):
        """ Check date format """
        date = self.w1.dateFrom # Output: '2022-06-08 00:00:00'
        self.assertEqual(date, datetime(2022, 6, 8))

    def test_times(self):
        """ Check time format """
        time = self.w1.timeFrom # Output: '1900-01-01 19:48:00'
        self.assertEqual(time, datetime(1900, 1, 1, 19, 48))

    def test_get_trip(self):
        """ Retrieve a trip """
        trip = self.t
        trip_shortcut = get_object_or_404(self.trip, name='Test trip')
        self.assertEqual(trip, trip_shortcut)

    def test_add_waypoint(self):
        """ Add waypoint to a trip """
        w1 = self.w1
        w2 = self.w2
        trip = self.t
        trip.waypoints.set([w1, w2])
        self.assertEqual(trip.waypoints.count(), 2)
