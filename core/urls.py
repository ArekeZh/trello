from django.urls import path, include
from rest_framework import routers
from .views import (
    RegisterView, LoginView, LogoutView, MeView,
    BoardViewSet, ListViewSet, CardViewSet,
)
router = routers.DefaultRouter()
router.register(r"boards", BoardViewSet, basename="board")
router.register(r"lists", ListViewSet, basename="list")
router.register(r"cards", CardViewSet, basename="card")
urlpatterns = [
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/logout/", LogoutView.as_view(), name="logout"),
    path("auth/me/", MeView.as_view(), name="current-user"),
    path("", include(router.urls)),
]
