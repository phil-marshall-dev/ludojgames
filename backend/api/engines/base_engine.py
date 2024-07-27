from backend.api.redis_client import LudojRedis
from ..models import Game

game_redis = LudojRedis('game')

class GameEngine:
    def create_game(self, creator_id, challenger_id):
        # initializes game in db and redis
        game = Game.objects.create(game_type=self.game_type, creator=creator_id, player_x=creator_id, player_y=challenger_id)
        game_state = {
            'board': 'EEEEEEEEE',
            'move_number': 0,
            'turn': 'X'
        }
        game_redis.set(game.id,game_state)

    def handle_move(self, game, move):
        ...

    def handle_resign(self):
        ...

