from channels.db import database_sync_to_async
from ..types import GameState
from .ludoj_consumer import LudojConsumer
from ..redis_client import ChallengeRedis, GameRedis
from ..models import Game, GameType
from ..types import Challenge
from dataclasses import  asdict
challenge_redis = ChallengeRedis()
game_redis = GameRedis()

class LobbyConsumer(LudojConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        self.game_name = self.scope["url_route"]["kwargs"]["game_name"]
        self.group_name = f"{self.game_name}_lobby"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        challenges = challenge_redis.get_all_challenges()
        await self.send_message("existing", [asdict(challenge) for challenge in challenges])


    async def handle_create(self, payload):
        challenge = Challenge(self.user.id, self.user.username)
        challenge_redis.store_challenge(challenge)
        await self.broadcast("created", asdict(challenge))

    async def handle_delete(self, payload):
        id = payload.get("id")
        challenge = challenge_redis.get_challenge(id)
        if challenge and challenge.userId == self.user.id:
            challenge_redis.delete_challenge(id)
            await self.broadcast("deleted", {"id": id})
        else:
            await self.send_error("Invalid user for challenge deletion")

    async def handle_accept(self, payload):
        id = payload.get("id")
        challenge = challenge_redis.get_challenge(id)
        if challenge and challenge.userId != self.user.id:
            challenge_redis.delete_challenge(id)
            game = await self.create_game(challenge.userId, self.user.id)

            await self.broadcast(
                "accepted",
                {
                    "id": id,
                    "gameId": game.id,
                    "playerIds": [challenge.userId, self.user.id],
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
        initial_state = GameState(creator_id, acceptee_id)
        game_redis.store_game_state(initial_state, game.id)
        return game
