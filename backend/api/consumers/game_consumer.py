from ..types import GameState
from ..redis_client import GameRedis
from .ludoj_consumer import LudojConsumer
from ..tasks import save_move_to_db, finalize_game
from dataclasses import  asdict

game_redis = GameRedis()

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
        latest_state = game_redis.get_latest_game_state(self.game_id)
        # check if game is in progress
        if latest_state.result:
            return
        
        # check if it is player's turn
        if self.user.id != latest_state.current_player_id():
            return

        # calculate next state
        success, new_board, new_result, new_whoseTurn = update_board(
            latest_state.board, payload, latest_state.whoseTurn
        )

        # check if move was illegal
        if not success:
            return

        # update redis with new state and broadcast
        new_turn = latest_state.turnNumber + 1
        new_state = GameState(
            latest_state.player_1_id,
            latest_state.player_2_id,
            board=new_board,
            move=payload,
            turnNumber=new_turn,
            whoseTurn=new_whoseTurn,
            result=new_result
        )
        game_redis.store_game_state(new_state, self.game_id)
        await self.broadcast("newState", asdict(new_state))

        # celery saves move to database
        save_move_to_db.delay(self.game_id, payload, new_turn, new_whoseTurn)

        # finalize game if over
        if new_result:
            finalize_game.delay(self.game_id, new_result)

    async def send_existing_moves(self):
        game_states = game_redis.get_game_states(self.game_id)
        await self.send_message("existing", [asdict(game_state) for game_state in game_states])


def update_board(board, move, whoseTurn):
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
        if board[index] != None:
            return False, None, None, None # Illegal move
        symbol = player_to_symbol.get(whoseTurn)
        board[index] = symbol

    # Check for the game status
    new_result = get_game_result(board)
    new_whoseTurn = None
    if not new_result:
        new_whoseTurn = '1' if whoseTurn == '2' else '2'

    return True, board, new_result, new_whoseTurn


def get_game_result(board):
    def check_win(symbol):
        winning_combinations = [
            [0, 1, 2],  # Top row
            [3, 4, 5],  # Middle row
            [6, 7, 8],  # Bottom row
            [0, 3, 6],  # Left column
            [1, 4, 7],  # Middle column
            [2, 5, 8],  # Right column
            [0, 4, 8],  # Diagonal
            [2, 4, 6],  # Diagonal
        ]
        return any(
            all(board[i] == symbol for i in combo) for combo in winning_combinations
        )

    # Check if the game has been won by either player
    if check_win("X"):
        return "1+"
    elif check_win("O"):
        return "2+"
    # Check for draw
    elif all(cell is not None for cell in board):
        return "D"
    # Game is still in progress
    else:
        return None




    # async def handle_resign(self, payload):
    #     latest_state = game_redis.get(f"{self.game_id}_latest")
    #     # check if game is in progress
    #     status = latest_state.get("status")
    #     if status not in ["1", "2"]:
    #         return
        
    #     # check if player belongs to this game
    #     players = latest_state.get("players")
    #     if self.user.id not in players.values():
    #         return
        
    #     # get whether player is '1' or '2'
    #     for player_key, player_id in players.items():
    #         if player_id == self.user.id:
    #             user_player_key = player_key
    #             break

    #     new_status = f'{user_player_key}R'
        
    #     # update redis with new state and broadcast
    #     new_turn = latest_state["turn"] + 1
    #     new_state = {
    #         "board": latest_state['board'],
    #         "move": None,
    #         "turn": new_turn,
    #         "players": latest_state["players"],
    #         "status": new_status,
    #     }

    #     game_redis.set(f"{self.game_id}_latest", new_state)
    #     game_redis.set(f"{self.game_id}_{new_turn}", new_state)
    #     await self.broadcast("resignation", new_state)

    #     # finalize game
    #     finalize_game.delay(self.game_id, new_status)