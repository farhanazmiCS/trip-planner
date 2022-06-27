""" Django project URL patterns """

from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import (TokenObtainPairView,
                                            TokenRefreshView)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('roadtrip.urls')),
    # Endpoint to obtain JWT token
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # Endpoint to refresh a JWT, to obtain a new JWT
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
