
from dataclasses import dataclass, field
from typing import List, Optional, Literal
from typing import Literal, Optional, List
import uuid
from django.utils import timezone



@dataclass
class GameInfoRedis:
    player_1_id: int
    player_2_id: int
    result: Optional[Literal['1+', '2+', '1R', '2R', 'D']] = None

@dataclass
class GameStateRedis:
    board: List[Optional[int]] = field(default_factory=lambda: [None] * 9)
    move: Optional[Literal['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3']] = None
    turnNumber: int = 0
    whoseTurn: Optional[Literal['1', '2']] = "1"

    def current_player_id(self, game_info: GameInfoRedis) -> int:
        if self.whoseTurn == '1':
            return game_info.player_1_id
        elif self.whoseTurn == '2':
            return game_info.player_2_id
        else:
            raise ValueError("Invalid value for whoseTurn")

@dataclass
class Challenge:
    userId: int
    username: str
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    createdAt: str = field(default_factory=lambda: timezone.now().isoformat())
