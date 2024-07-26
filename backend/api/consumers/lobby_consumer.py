from django.utils import timezone
import uuid
from channels.db import database_sync_to_async

from .ludoj_consumer import LudojConsumer
from ..ludoj_redis import LudojRedis
from ..models import Game, GameType

challenge_redis = LudojRedis("challenge")
game_redis = LudojRedis("game")


class LobbyConsumer(LudojConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        self.game_name = self.scope["url_route"]["kwargs"]["game_name"]
        self.group_name = f"{self.game_name}_lobby"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        keys = challenge_redis.scan("*")
        values = challenge_redis.mget(keys)
        await self.send_message("existing", values)

    async def handle_create(self, payload):
        id = str(uuid.uuid4())
        timestamp = timezone.now().isoformat()
        challenge = {
            "id": id,
            "userId": self.user.id,
            "username": self.user.username,
            "createdAt": timestamp,
        }
        challenge_redis.set(id, challenge)
        await self.broadcast("created", challenge)

    async def handle_delete(self, payload):
        id = payload.get("id")
        challenge = challenge_redis.get(id)
        if challenge and challenge["userId"] == self.user.id:
            challenge_redis.delete(id)
            await self.broadcast("deleted", {"id": id})
        else:
            await self.send_error("Invalid user for challenge deletion")

    async def handle_accept(self, payload):
        id = payload.get("id")
        challenge = challenge_redis.get(id)
        if challenge and challenge["userId"] != self.user.id:
            challenge_redis.delete(id)
            game = await self.create_game(challenge["userId"], self.user.id)

            await self.broadcast(
                "accepted",
                {
                    "id": id,
                    "gameId": game.id,
                    "playerIds": [challenge["userId"], self.user.id],
                },
            )
        else:
            await self.send_error("challenge not found/cannot accept own challenge")

    @database_sync_to_async
    def create_game(self, creator_id, acceptee_id):
        game = Game.objects.create(
            creator_id=creator_id,
            player_1_id=creator_id,
            player_2_id=acceptee_id,
            game_type=GameType.get_value(self.game_name),
        )
        initial_state = {
            "board": [None] * 9,
            "move": None,
            "turn": 0,
            "players": {
                '1': creator_id,
                '2': acceptee_id
            },
            "status": "1",
            "clocks": {
                '1': 300,
                '2': 300,
            },
            "last_move_time": timezone.now().isoformat(),
        }

        game_redis.set(f"{game.id}_0", initial_state)
        game_redis.set(f"{game.id}_latest", initial_state)

        return game
