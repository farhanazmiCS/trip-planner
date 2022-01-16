from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _

class MandatoryCharacterValidator:
    """
    Validate whether the password contains at least one uppercase letter, one numeric character, and one special character.
    """
    symbols = set((
        '`', '~', '!', '@', '#', 
        '$', '%', '^', '^', '&', 
        '*', '(', ')', '-', '_', 
        '+', '=', '[', ']', '{', 
        '}', '"\"', '|', ';', ':', 
        "'", '"', '/', '?', '.', 
        '>', ',', '<'
    ))

    def validate(self, password, user=None):
        # Bool variables to check if conditions are met
        isSmol = False
        isCaps = False
        isNum = False
        isSym = False

        # Append bool status to a list
        status = []
        status.extend([isSmol, isCaps, isNum, isSym])

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
                _("Your password must contain a lowercase letter (e.g a - z), capital letter (e.g A - Z), a numeric character (e.g 0 - 9), and a symbol (e.g $, @, !)."),
                code='password_no_mandatory_characters',
            )

    def get_help_text(self):
        return _(
            'Your password must contain a lowercase letter (e.g a - z), capital letter (e.g A - Z), a numeric character (e.g 0 - 9), and a symbol (e.g $, @, !).'
        )
