from django.urls import include, path
from rest_framework import routers, urlpatterns
from . import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet, basename="users")

users = views.UserViewSet.as_view({'get': 'list'})
user = views.UserViewSet.as_view({'get': 'retrieve'})

urlpatterns = [
    path('api/users/', users),
    path('api/user/<int:pk>', user),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]