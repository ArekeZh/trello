from django.contrib import admin
from .models import User, Board, List, Card

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "username", "email", "is_staff", "is_active")
    search_fields = ("username", "email")


@admin.register(Board)
class BoardAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "owner", "order", "created_at")
    list_filter = ("owner",)
    search_fields = ("title",)


@admin.register(List)
class ListAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "board", "order")
    list_filter = ("board",)
    search_fields = ("title",)


@admin.register(Card)
class CardAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "list", "order", "created_at")
    list_filter = ("list",)
    search_fields = ("title", "description")
