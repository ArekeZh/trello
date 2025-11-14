from rest_framework import serializers
from .models import User, Board, List, Card

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email")

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ("id", "title", "description", "order", "created_at", "list")

class ListSerializer(serializers.ModelSerializer):
    cards = CardSerializer(many=True, read_only=True)
    class Meta:
        model = List
        fields = ("id", "title", "order", "board", "cards", "color")

class BoardSerializer(serializers.ModelSerializer):
    lists = ListSerializer(many=True, read_only=True)
    owner = UserSerializer(read_only=True)
    class Meta:
        model = Board
        fields = ("id", "title", "description", "order", "owner", "created_at", "lists")
