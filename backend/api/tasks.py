from celery import shared_task
from .models import Game, Move
from .redis_client import GameRedis

game_redis = GameRedis()

@shared_task
def save_move_to_db(game_id, move_value, move_number, player):
    try:
        move = Move.objects.create(
            value=move_value,
            game_id=game_id,
            number=move_number,
            player=player
        )
    except Exception as e:
        return f"Error saving move: {str(e)}"

@shared_task
def finalize_game(game_id, result):
    try:
        game = Game.objects.get(id=game_id)
        game.in_progress = False
        game.result = result
        game.save()

        game_redis.expire_game_keys(game_id)
        
        return f"Game #{game_id} finalized successfully."
    except Game.DoesNotExist:
        return f"Game #{game_id} does not exist."
    except Exception as e:
        return f"Error finalizing game: {str(e)}"