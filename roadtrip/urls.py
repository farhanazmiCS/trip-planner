from django.urls import include, path
from rest_framework import routers, urlpatterns
from . import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'trips', views.TripViewSet)
router.register(r'waypoints', views.WaypointViewSet)
router.register(r'todos', views.TodoViewSet)
router.register(r'notifications', views.NotificationViewSet)

urlpatterns = [
    path('api/login', views.LoginView.as_view(), name="login"),
    path('api/logout', views.LogoutView.as_view(), name="logout"),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]

urlpatterns += router.urls