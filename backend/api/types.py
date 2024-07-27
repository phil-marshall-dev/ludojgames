
from dataclasses import dataclass, field
from typing import List, Optional, Literal
from typing import TypedDict, Literal, Optional, List
import uuid
from django.utils import timezone

@dataclass
class GameState:
    player_1_id: int
    player_2_id: int
    board: List[Optional[int]] = field(default_factory=lambda: [None] * 9)
    move: Optional[Literal['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3']] = None
    turnNumber: int = 0
    whoseTurn: Optional[Literal['1', '2']] = "1"
    result: Optional[Literal['1+', '2+', '1R', '2R', 'D']] = None

    def current_player_id(self) -> int:
        """Returns the user ID of the current player based on whoseTurn."""
        if self.whoseTurn == '1':
            return self.player_1_id
        elif self.whoseTurn == '2':
            return self.player_2_id
        else:
            raise ValueError("Invalid value for whoseTurn: must be '1' or '2'")

@dataclass
class Challenge:
    userId: int
    username: str
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    createdAt: str = field(default_factory=lambda: timezone.now().isoformat())
