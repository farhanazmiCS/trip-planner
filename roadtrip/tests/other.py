from django.forms import ValidationError
from django.test import TestCase
from django.contrib.auth.password_validation import validate_password

class PasswordTest(TestCase):
    def test_password_satisfies_all(self):
        """ Passes if validate_password returns None """
        mock_password = 'Iamacunt123!'
        self.assertEqual(validate_password(mock_password), None)

    def test_password_satisfies_almost_all(self):
        """ Passes if ValidationError raised """
        mock_password = 'Iamacunt123'
        with self.assertRaises(ValidationError):
            validate_password(mock_password)