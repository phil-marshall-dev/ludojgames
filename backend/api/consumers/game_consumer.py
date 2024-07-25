from datetime import datetime
from ..ludoj_redis import LudojRedis
from .ludoj_consumer import LudojConsumer
from ..tasks import save_move_to_db, finalize_game
from django.utils import timezone

game_redis = LudojRedis("game")


class GameConsumer(LudojConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        self.game_name = self.scope["url_route"]["kwargs"]["game_name"]
        self.game_id = self.scope["url_route"]["kwargs"]["game_id"]
        self.group_name = f"{self.game_name}_{self.game_id}"

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        await self.send_existing_moves()

    async def handle_move(self, payload):
        current_time = timezone.now()

        status = latest_state["status"]
        if status not in ["1", "2"]:
            return

        latest_state = game_redis.get(f"{self.game_id}_latest")
        current_player_user_id = latest_state["players"][status]
        if self.user.id != current_player_user_id:
            return

        # Calculate time elapsed since the last move
        last_move_time = datetime.fromisoformat(latest_state["last_move_time"])
        elapsed_time = (current_time - last_move_time).total_seconds()

        # Update the clock for the current player
        clocks = latest_state["clocks"]
        clocks[status] -= elapsed_time

        # Check if the clock has run out
        if clocks[status] <= 0:
            await self.end_game("time")
            return

        new_turn = latest_state["turn"] + 1
        success, new_board, new_status = update_board(
            latest_state["board"], payload, status
        )
        if not success:
            return


        new_state = {
            "board": new_board,
            "move": payload,
            "turn": new_turn,
            "players": latest_state["players"],
            "status": new_status,
        }

        game_redis.set(f"{self.game_id}_latest", new_state)
        game_redis.set(f"{self.game_id}_{new_turn}", new_state)
        await self.broadcast("newState", new_state)

        save_move_to_db.delay(self.game_id, payload, new_turn, status)

        if new_status not in ["1", "2"]:
            finalize_game.delay(self.game_id, new_status)

    async def send_existing_moves(self):
        keys = game_redis.scan(f"{self.game_id}_*")
        filtered_keys = [key for key in keys if key != f"game:{self.game_id}_latest"]
        values = game_redis.mget(filtered_keys)
        await self.send_message("existing", values)


def update_board(board, move, status):
    move_to_index = {
        "A1": 0,
        "A2": 1,
        "A3": 2,
        "B1": 3,
        "B2": 4,
        "B3": 5,
        "C1": 6,
        "C2": 7,
        "C3": 8,
    }

    player_to_symbol = {"1": "X", "2": "O"}

    # Get the index from the move
    index = move_to_index.get(move)

    if index is not None:
        # Update the board with the player's marker
        if board[index] != "":
            return False, None, None # Illegal move
        symbol = player_to_symbol.get(status)
        board[index] = symbol

    # Check for the game status
    status = get_game_status(board, status)

    return True, board, status


def get_game_status(board, status):
    # Helper function to check win conditions
    def check_win(symbol):
        # Winning combinations for a 3x3 board
        winning_combinations = [
            [0, 1, 2],  # Top row
            [3, 4, 5],  # Middle row
            [6, 7, 8],  # Bottom row
            [0, 3, 6],  # Left column
            [1, 4, 7],  # Middle column
            [2, 5, 8],  # Right column
            [0, 4, 8],  # Diagonal \
            [2, 4, 6],  # Diagonal /
        ]
        return any(
            all(board[i] == symbol for i in combo) for combo in winning_combinations
        )

    # Check if the game has been won by either player
    if check_win("X"):
        return "1+"
    elif check_win("O"):
        return "2+"
    # Check for draw (no empty cells and no winner)
    elif all(cell is not None for cell in board):
        return "D"
    # Game is still in progress
    elif status == "1":
        return "2"
    else:
        return "1"
