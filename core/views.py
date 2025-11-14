from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from .models import User, Board, List, Card
from .serializers import UserSerializer, BoardSerializer, ListSerializer, CardSerializer

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")
        if not (username and email and password):
            return Response({"detail": "Все поля обязательны"}, status=400)
        if User.objects.filter(email=email).exists():
            return Response({"detail": "Пользователь с таким email уже существует"}, status=400)
        user = User.objects.create_user(username=username, email=email, password=password)
        token = Token.objects.create(user=user)
        return Response({"token": token.key, "user": UserSerializer(user).data})

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        try:
            user = User.objects.get(email=email)
            if user.check_password(password):
                token, _ = Token.objects.get_or_create(user=user)
                return Response({"token": token.key, "user": UserSerializer(user).data})
        except User.DoesNotExist:
            pass
        return Response({"detail": "Invalid credentials"}, status=400)

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)

class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        return Response(UserSerializer(request.user).data)

class BoardViewSet(viewsets.ModelViewSet):
    serializer_class = BoardSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return Board.objects.filter(owner=self.request.user)
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
    @action(detail=True, methods=["patch"])
    def reorder(self, request, pk=None):
        board = self.get_object()
        new_order = request.data.get("order")
        board.order = new_order
        board.save()
        return Response(BoardSerializer(board).data)

class ListViewSet(viewsets.ModelViewSet):
    serializer_class = ListSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return List.objects.filter(board__owner=self.request.user)
    @action(detail=True, methods=["patch"])
    def reorder(self, request, pk=None):
        item = self.get_object()
        item.order = request.data.get("order", item.order)
        item.save()
        return Response(ListSerializer(item).data)

class CardViewSet(viewsets.ModelViewSet):
    serializer_class = CardSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return Card.objects.filter(list__board__owner=self.request.user)
    @action(detail=True, methods=["patch"])
    def move(self, request, pk=None):
        card = self.get_object()
        list_id = request.data.get("list")
        order = request.data.get("order", card.order)
        if list_id:
            card.list_id = list_id
        card.order = order
        card.save()
        return Response(CardSerializer(card).data)
