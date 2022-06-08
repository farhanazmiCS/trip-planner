from django.test import TestCase
from roadtrip.models import User
from django.db.models.query import QuerySet

class TestUserModel(TestCase):
    def setup(self):
        """ Create test users """
        User.objects.create_user(
            email='user1@test.com',
            username='user1',
            password='Iamacunt123!'
        )
        User.objects.create_user(
            email='user2@test.com',
            username='user2',
            password='Iamacunt123!'
        )
    queryset = User.objects.all()

    def test_check_queryset(self):
        """ Check if returns a queryset of user objects """
        check_instance = isinstance(self.queryset, QuerySet)
        self.assertEqual(check_instance, True)