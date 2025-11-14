from django.contrib import admin
from django.urls import path, include
from django.shortcuts import render

def home(request):
    return render(request, "home.html")

def board_detail(request, board_id):
    return render(request, "board_detail.html")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("core.urls")),
    path("", home, name="home"),
    path("board/<int:board_id>/", board_detail, name="board-detail"),  # это и есть страница одной доски
]
