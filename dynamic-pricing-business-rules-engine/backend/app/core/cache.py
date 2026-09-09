import json

import redis

from app.config import settings


class RedisCache:

    def __init__(self):
        self.client = redis.Redis(
            host=settings.REDIS_HOST,
            port=settings.REDIS_PORT,
            db=settings.REDIS_DB,
            decode_responses=True,
        )

    def get(self, key: str):
        value = self.client.get(key)

        if value is None:
            return None

        return json.loads(value)

    def set(
        self,
        key: str,
        value,
        expire: int = 300,
    ):
        self.client.setex(
            key,
            expire,
            json.dumps(value),
        )

    def delete(self, key: str):
        self.client.delete(key)

    def clear(self):
        self.client.flushdb()


cache = RedisCache()
