from typing import List, Optional, Tuple
import redis
import json

from .types import Challenge, GameInfoRedis, GameStateRedis

redis_client = redis.Redis(host="localhost", port=6379, db=0)


class ChallengeRedis:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.redis_client = redis_client
        return cls._instance

    def store_challenge(self, challenge):
        """Stores a Challenge instance in Redis."""
        key = f"challenge:{challenge.id}"
        value = json.dumps(challenge.__dict__)
        self.redis_client.set(key, value)

    def get_challenge(self, id):
        """Retrieves a Challenge instance from Redis by ID."""
        key = f"challenge:{id}"
        value = self.redis_client.get(key)
        if value:
            return Challenge(**json.loads(value))
        return None

    def delete_challenge(self, id):
        """Deletes a Challenge instance from Redis by ID."""
        key = f"challenge:{id}"
        self.redis_client.delete(key)

    def get_all_challenges(self) -> List[Challenge]:
        keys = self.redis_client.scan_iter(match="challenge:*")
        values = self.redis_client.mget(keys)
        challenges = []
        for value in values:
            if value:
                challenge_data = json.loads(value)
                challenge = Challenge(**challenge_data)
                challenges.append(challenge)

        return challenges


class GameRedis:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.redis_client = redis_client
        return cls._instance

    def store_game_state(self, game_state: GameStateRedis, game_id: int):
        value = json.dumps(game_state.__dict__)

        self.redis_client.set(f"game:{game_id}_{game_state.turnNumber}", value)
        self.redis_client.set(f"game:{game_id}_latest", value)

    def store_game_info(self, game_info: GameInfoRedis, game_id: int):
        value = json.dumps(game_info.__dict__)
        self.redis_client.set(f"game:{game_id}_info", value)

    def get_latest_game_state_and_info(
        self, game_id: int
    ) -> Tuple[Optional[GameStateRedis], Optional[GameInfoRedis]]:
        latest_key = f"game:{game_id}_latest"
        info_key = f"game:{game_id}_info"
        values = self.redis_client.mget([latest_key, info_key])

        if values[0] is None or values[1] is None:
            return None, None

        return GameStateRedis(**json.loads(values[0])), GameInfoRedis(
            **json.loads(values[1])
        )

    def get_game_states_and_info(
        self, game_id: int
    ) -> Tuple[Optional[List[GameStateRedis]], Optional[GameInfoRedis]]:
        info_key = f"game:{game_id}_info"
        game_state_keys = list(self.redis_client.scan_iter(match=f"game:{game_id}_*"))
        game_state_keys = [
            key
            for key in game_state_keys
            if (key != f"game:{game_id}_latest".encode('utf-8') and key != f"game:{game_id}_info".encode('utf-8'))
        ]
        keys = [info_key] + game_state_keys
        values = self.redis_client.mget(keys)
        game_info_value = values[0]
        game_info = None
        if game_info_value:
            game_info_data = json.loads(game_info_value)
            game_info = GameInfoRedis(**game_info_data)
        else:
            return None, None

        game_states = []
        for value in values[1:]:
            if value:
                game_state_data = json.loads(value)
                game_state = GameStateRedis(**game_state_data)
                game_states.append(game_state)

        return game_states, game_info

    def expire_game_keys(self, game_id: int):
        keys = self.redis_client.scan_iter(match=f"game:{game_id}_*")
        self.redis_client.expire(keys, 60)
