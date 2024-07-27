from typing import List, Optional
import redis
import json

from .types import Challenge, GameState

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

    def store_game_state(self, game_state: GameState, game_id: int):
        value = json.dumps(game_state.__dict__)

        self.redis_client.set(f"game:{game_id}_{game_state.turnNumber}", value)
        self.redis_client.set(f"game:{game_id}_latest", value)

    def get_latest_game_state(self, game_id: int) -> Optional[GameState]:
        latest_key = f"game:{game_id}_latest"
        value = self.redis_client.get(latest_key)
        if value:
            return GameState(**json.loads(value))
        return None
    
    def get_game_states(self, game_id: int) -> Optional[GameState]:
        keys = self.redis_client.scan_iter(match=f"game:{game_id}_*")
        filtered_keys = [key for key in keys if key != f"game:{game_id}_latest"]
        values = self.redis_client.mget(filtered_keys)
        game_states = []
        for value in values:
            if value:
                game_state_data = json.loads(value)
                game_state = GameState(**game_state_data)
                game_states.append(game_state)

        return game_states

    def expire_game_keys(self, game_id: int):
        keys = self.redis_client.scan_iter(match=f"game:{game_id}_*")
        self.redis_client.expire(keys, 60)