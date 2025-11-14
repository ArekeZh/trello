from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """
    Кастомный User. Email обязателен, username не уникален.
    """
    email = models.EmailField(unique=False)
    REQUIRED_FIELDS = ["email"]

class Board(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="boards")
    created_at = models.DateTimeField(auto_now_add=True)
    order = models.PositiveIntegerField(default=0)
    class Meta:
        ordering = ["order"]
    def __str__(self):
        return self.title

class List(models.Model):
    title = models.CharField(max_length=255)
    board = models.ForeignKey(Board, on_delete=models.CASCADE, related_name="lists")
    order = models.PositiveIntegerField(default=0)
    color = models.CharField(max_length=20, blank=True, default="")
    class Meta:
        ordering = ["order"]
    def __str__(self):
        return self.title

class Card(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    list = models.ForeignKey(List, on_delete=models.CASCADE, related_name="cards")
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ["order"]
    def __str__(self):
        return self.title
