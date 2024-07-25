# urls.py
from django.urls import path
from .views import game_detail_view, profile_detail_view

urlpatterns = [
    path('games/<int:game_id>', game_detail_view, name='challenge-detail'),
    path('profiles/<int:id>/', profile_detail_view, name='profile-detail'),
]