# views.py
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from .models import Game, Profile


from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import Game, Move


@csrf_exempt
def game_detail_view(request, game_id):
    if request.method == "GET":
        game = get_object_or_404(
            Game.objects.select_related(
                "creator", "player_1", "player_2"
            ).select_related(  # Select related users
                "creator__profile", "player_1__profile", "player_2__profile"
            ),  # Select related profiles
            id=game_id,
        )
        # Fetch moves if the game is not in progress
        moves_data = []
        if not game.in_progress:
            moves = Move.objects.filter(game=game).order_by("number")
            moves_data = [
                {
                    "value": move.value,
                    "number": move.number,
                    "player": move.player,
                }
                for move in moves
            ]

        response_data = {
            "id": game.id,
            "creator": {"id": game.creator.id, "username": game.creator.username},
            "player_1": {
                "id": game.player_1.id,
                "username": game.player_1.username,
            },
            "player_2": {
                "id": game.player_2.id,
                "username": game.player_2.username,
            },
            "result": game.result,
            "inProgress": game.in_progress,
            "createdAt": game.created_at.isoformat(),
            "moves": (moves_data if not game.in_progress else None),
        }

        return JsonResponse(response_data, status=200)

    return JsonResponse({"error": "Invalid method"}, status=405)


def profile_detail_view(request, id):
    if request.method == "GET":

        profile = get_object_or_404(Profile, user_id=id)

        response_data = {
            "user": {
                "id": profile.user.id,
                "username": profile.user.username,
                "country": profile.country,
                "avatarUrl": profile.avatar_url,
                "createdAt": profile.created_at.isoformat(),
            },
        }

        return JsonResponse(response_data)
    return JsonResponse({"error": "Invalid method"}, status=405)
