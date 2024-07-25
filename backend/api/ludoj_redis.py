import redis
import json
from threading import Lock


class BaseRedisClient:
    _instance = None
    _lock = Lock()

    def __new__(cls, host="localhost", port=6379, db=0):
        if not cls._instance:
            with cls._lock:
                if not cls._instance:
                    cls._instance = super(BaseRedisClient, cls).__new__(cls)
                    cls._instance._init_redis_client(host, port, db)
        return cls._instance

    def _init_redis_client(self, host, port, db):
        self.redis_client = redis.Redis(host=host, port=port, db=db)

    def get(self, prefix, key):
        full_key = self._apply_prefix(prefix, key)
        value = self.redis_client.get(full_key)
        if value:
            return json.loads(value)
        return None

    def set(self, prefix, key, value):
        full_key = self._apply_prefix(prefix, key)
        self.redis_client.set(full_key, json.dumps(value))

    def delete(self, prefix, key):
        full_key = self._apply_prefix(prefix, key)
        self.redis_client.delete(full_key)

    def _apply_prefix(self, prefix, key):
        return f"{prefix}:{key}" if prefix else key

    def get_all(self, prefix):
        pattern = f"{prefix}:*" if prefix else "*"
        keys = self.redis_client.keys(pattern)
        values = [json.loads(self.redis_client.get(key)) for key in keys]
        return values

    def mget(self, keys):
        values = self.redis_client.mget(keys)
        return [json.loads(value) if value else None for value in values]

    def scan(self, prefix, match_pattern="*", count=1000):
        """
        Retrieve keys matching a pattern using SCAN.

        :param prefix: The prefix to apply to keys.
        :param match_pattern: Pattern to match keys (e.g., 'foo_*').
        :param count: Number of keys to return per SCAN iteration.
        :return: A list of keys matching the pattern.
        """
        cursor = 0
        all_keys = []
        pattern = self._apply_prefix(prefix, match_pattern)

        while True:
            cursor, keys = self.redis_client.scan(
                cursor=cursor, match=pattern, count=count
            )
            all_keys.extend([key.decode("utf-8") for key in keys])

            if cursor == 0:
                break

        return all_keys

    def expire(self, keys, ttl):
        for key in keys:
            self.redis_client.expire(key, ttl)


class LudojRedis:
    def __init__(self, prefix=None):
        self.prefix = prefix
        self.redis_client = (
            BaseRedisClient()
        )  # Get the singleton instance of BaseRedisClient

    def get(self, key):
        return self.redis_client.get(self.prefix, key)

    def set(self, key, value):
        self.redis_client.set(self.prefix, key, value)

    def delete(self, key):
        self.redis_client.delete(self.prefix, key)

    def get_all(self):
        return self.redis_client.get_all(self.prefix)

    def get_keys_with_prefix(self, specific_prefix):
        """
        Retrieve all keys starting with a specific prefix.
        """
        # Update the pattern to match the specific prefix and wildcard
        pattern = f"{self.prefix}:{specific_prefix}*"
        return self.redis_client.get_all(pattern)

    def scan(self, match_pattern="*", count=1000):
        """
        Retrieve keys matching a pattern using SCAN.

        :param match_pattern: Pattern to match keys (e.g., 'foo_*').
        :param count: Number of keys to return per SCAN iteration.
        :return: A list of keys matching the pattern.
        """
        return self.redis_client.scan(self.prefix, match_pattern, count)

    def mget(self, keys):
        return self.redis_client.mget(keys)

    def expire(self, keys, ttl):
        return self.redis_client.expire(keys, ttl)
