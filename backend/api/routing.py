from django.urls import re_path

from .consumers import LobbyConsumer, ChatConsumer, GameConsumer

websocket_urlpatterns = [
    re_path(r'ws/(?P<game_name>[\w-]+)/lobby/$', LobbyConsumer.as_asgi()),
    re_path(r'ws/(?P<game_name>[\w-]+)/games/(?P<game_id>\d+)/chat/$', ChatConsumer.as_asgi()),
    re_path(r'ws/(?P<game_name>[\w-]+)/games/(?P<game_id>\d+)/$', GameConsumer.as_asgi()),
]