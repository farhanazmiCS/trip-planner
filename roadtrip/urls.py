from django.db.models import base
from django.urls import include, path
from rest_framework import routers, urlpatterns, viewsets
from . import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet, basename="users")
router.register(r'trips', views.TripViewSet, basename="trips" )
router.register(r'waypoints', views.WaypointViewSet, basename="waypoints")
router.register(r'todos', views.TodoViewSet, basename="todos")

# Users
list_users = views.UserViewSet.as_view({'get': 'list'})
retrieve_user = views.UserViewSet.as_view({'get': 'retrieve'})
create_user = views.UserViewSet.as_view({'post': 'create'})

# Trips
list_trips = views.TripViewSet.as_view({'get': 'list'})
retrieve_trip = views.TripViewSet.as_view({'get': 'retrieve'})
create_trip = views.TripViewSet.as_view({'post': 'create'})

# Waypoints
retrieve_waypoint = views.WaypointViewSet.as_view({'get': 'retrieve'})

# Todos
retrieve_todo = views.TodoViewSet.as_view({'get': 'retrieve'})

urlpatterns = [
    path('api/users/', list_users),
    path('api/user/<int:pk>', retrieve_user),
    path('api/register', create_user),
    path('api/trips', list_trips),
    path('api/trip/<int:pk>', retrieve_trip),
    path('api/savetrip', create_trip),
    path('api/waypoint/<int:pk>', retrieve_waypoint),
    path('api/todo/<int:pk>', retrieve_todo),
    path('api/login', views.LoginView.as_view(), name="login"),
    path('api/logout', views.LogoutView.as_view(), name="logout"),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]