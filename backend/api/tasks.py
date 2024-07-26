# your_app/tasks.py
from celery import shared_task
from .models import Game, Move
from .ludoj_redis import LudojRedis
game_redis = LudojRedis("game")

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
def finalize_game(game_id, status):
    try:
        game = Game.objects.get(id=game_id)
        game.in_progress = False
        game.result = status
        game.save()

        keys = game_redis.scan(f"{game_id}_*")
        game_redis.expire(keys, 60)
        
        return f"Game #{game_id} finalized successfully."
    except Game.DoesNotExist:
        return f"Game #{game_id} does not exist."
    except Exception as e:
        return f"Error finalizing game: {str(e)}"