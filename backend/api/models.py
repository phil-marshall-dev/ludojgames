from django.db import models
from django.contrib.auth.models import User


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True


class Game(TimeStampedModel):
    PLAYER_X = "X"
    PLAYER_O = "O"
    EMPTY = "E"
    PLAYER_CHOICES = [(PLAYER_X, "Player X"), (PLAYER_O, "Player O")]

    STATUS_IN_PROGRESS = "I"
    STATUS_X_WON = "X"
    STATUS_O_WON = "O"
    STATUS_DRAW = "D"
    STATUS_CHOICES = [
        (STATUS_IN_PROGRESS, "Ongoing"),
        (STATUS_X_WON, "X Won"),
        (STATUS_O_WON, "O Won"),
        (STATUS_DRAW, "Draw"),
    ]

    board = models.CharField(max_length=9, default=EMPTY * 9)
    current_player = models.CharField(
        max_length=1, choices=PLAYER_CHOICES, default=PLAYER_X
    )
    status = models.CharField(
        max_length=1, choices=STATUS_CHOICES, default=STATUS_IN_PROGRESS
    )
    updated_at = models.DateTimeField(auto_now=True)

    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_games')
    player_x = models.ForeignKey(User, on_delete=models.CASCADE, related_name='games_as_player_x')
    player_o = models.ForeignKey(User, on_delete=models.CASCADE, related_name='games_as_player_o')

    def __str__(self):
        return f"Game {self.id}"

    def make_move(self, position):
        if self.status != self.STATUS_ONGOING:
            raise ValueError("Game has already ended.")
        if self.board[position] != self.EMPTY:
            raise ValueError("Position already taken.")

        board_list = list(self.board)
        board_list[position] = self.current_player
        self.board = "".join(board_list)

        # Record the move
        Move.objects.create(game=self, player=self.current_player, position=position)

        if self.check_winner(self.current_player):
            self.status = (
                self.STATUS_X_WON
                if self.current_player == self.PLAYER_X
                else self.STATUS_O_WON
            )
        elif self.EMPTY not in self.board:
            self.status = self.STATUS_DRAW
        else:
            self.current_player = (
                self.PLAYER_O if self.current_player == self.PLAYER_X else self.PLAYER_X
            )

        self.save()

    def check_winner(self, player):
        winning_positions = [
            (0, 1, 2),
            (3, 4, 5),
            (6, 7, 8),  # Rows
            (0, 3, 6),
            (1, 4, 7),
            (2, 5, 8),  # Columns
            (0, 4, 8),
            (2, 4, 6),  # Diagonals
        ]
        for positions in winning_positions:
            if all(self.board[i] == player for i in positions):
                return True
        return False


class Move(TimeStampedModel):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    player = models.CharField(max_length=1, choices=Game.PLAYER_CHOICES)
    position = models.IntegerField()

    class Meta:
        unique_together = ["game", "position"]
        ordering = ["created_at"]

    def __str__(self):
        return f"Move {self.position} by {self.player} in Game {self.game.id}"


class Profile(TimeStampedModel):
    COUNTRIES = [
        ("US", "United States"),
        ("CA", "Canada"),
        ("MX", "Mexico"),
        ("EO", "Esperantujo"),
    ]
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        primary_key=True,
    )
    country = models.CharField(max_length=2, choices=COUNTRIES, blank=True, default="")
    avatar_url = models.URLField(blank=True, default="")

class Challenge(TimeStampedModel):
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_challenges')