from django.db import models
from django.contrib.auth.models import User


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True


PLAYER_X = "X"
PLAYER_O = "O"
EMPTY = "E"
PLAYER_CHOICES = [(PLAYER_X, "Player X"), (PLAYER_O, "Player O")]

class GameType(models.TextChoices):
    TIC_TAC_TOE = 't', "tic-tac-toe"
    BIZINGO = 'b', "bizingo"

    @classmethod
    def get_value(cls, label):
        for key, value in cls.choices:
            if value == label:
                return key
        return None

class Game(TimeStampedModel):
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_games')
    player_1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='games_as_player_1')
    player_2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='games_as_player_2')
    game_type = models.CharField(max_length=1,choices=GameType.choices)
    in_progress = models.BooleanField(default=True)
    result = models.CharField(max_length=3, default='')

    def __str__(self):
        return f"Game #{self.id}"

class Move(TimeStampedModel):
    value = models.CharField(max_length=10)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    number = models.IntegerField()
    player = models.CharField(max_length=20)


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
    elo = models.IntegerField(default=1200)

class Chat(TimeStampedModel):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    text = models.CharField(max_length=200)