from gettext import ngettext
from string import punctuation

from django.contrib.auth.password_validation import (
    CommonPasswordValidator, MinimumLengthValidator, NumericPasswordValidator,
    UserAttributeSimilarityValidator)
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _


class UserAttributeSimilarityValidator(UserAttributeSimilarityValidator):
    def get_help_text(self):
        return _(
            "1. Your password cannot be too similar to your username or email;"
        )

class MinimumLengthValidator(MinimumLengthValidator):
    def get_help_text(self):
        return ngettext(
            "2. Your password must contain at least %(min_length)d characters;",
            "2. Your password must contain at least %(min_length)d characters;",
            self.min_length,
        ) % {'min_length': self.min_length}

class CommonPasswordValidator(CommonPasswordValidator):
    def get_help_text(self):
        return _(
            "3. Your password cannot be a commonly used password;"
        )

class NumericPasswordValidator(NumericPasswordValidator):
    def get_help_text(self):
        return _(
            "4. Your password cannot be entirely numeric, and;"
        )

class MandatoryCharacterValidator:
    """ Validate whether the password contains at least one uppercase letter, one numeric character, and one special character. """
    symbols = punctuation

    def validate(self, password, user=None):
        # Bool variables to check if conditions are met
        isLower = False
        isCaps = False
        isNum = False
        isSym = False

        # Append bool status to a list
        status = []
        status.extend([isLower, isCaps, isNum, isSym])

        # Check if the characters meet any of the 4 conditions
        for char in password:
            if char.islower():
                status[0] = True
            elif char.isupper():
                status[1] = True
            elif char.isnumeric():
                status[2] = True
            elif char in self.symbols:
                status[3] = True
        
        if not (status[0] and status[1] and status[2] and status[3]):
            raise ValidationError(
                _("Must contain a lowercase letter, an uppercase letter, a number, and a symbol."),
                code='password_no_mandatory_characters',
            )

    def get_help_text(self):
        return _(
            '5. Your password must contain a lowercase letter, an uppercase letter, a number, and a symbol.'
        )
