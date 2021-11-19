from django.urls import include, path
from rest_framework import routers, urlpatterns
from . import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet, basename="users")
router.register(r'trips', views.TripViewSet, basename="trips" )

list_users = views.UserViewSet.as_view({'get': 'list'})
retrieve_user = views.UserViewSet.as_view({'get': 'retrieve'})

list_trips = views.TripViewSet.as_view({'get': 'list'})
create_trip = views.TripViewSet.as_view({'post': 'create'})

urlpatterns = [
    path('api/users/', list_users),
    path('api/user/<int:pk>', retrieve_user),
    path('api/trips', list_trips),
    path('api/savetrip', create_trip),
    path('api/login', views.LoginView.as_view(), name="login"),
    path('api/logout', views.LogoutView.as_view(), name="logout"),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]