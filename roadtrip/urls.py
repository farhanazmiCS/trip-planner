from django.urls import include, path
from rest_framework import routers, urlpatterns
from . import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet, basename="users")
router.register(r'trips', views.TripViewSet, basename="trips" )
router.register(r'waypoints', views.WaypointViewSet, basename="waypoints")
router.register(r'todos', views.TodoViewSet, basename="todos")
router.register(r'notifications', views.NotificationViewSet, basename="notifications")

urlpatterns = [
    path('api/login', views.LoginView.as_view(), name="login"),
    path('api/logout', views.LogoutView.as_view(), name="logout"),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]

urlpatterns += router.urls