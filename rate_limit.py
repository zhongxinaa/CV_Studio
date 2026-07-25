import time

_buckets: dict[str, dict] = {}


def check_rate_limit(key: str, limit: int, window_seconds: float) -> dict:
    """In-memory sliding-window rate limiter. Fine for a single dev/small
    deployment; does not share state across multiple processes."""
    now = time.time()
    bucket = _buckets.get(key)

    if not bucket or bucket["reset_at"] <= now:
        reset_at = now + window_seconds
        _buckets[key] = {"count": 1, "reset_at": reset_at}
        return {"allowed": True, "remaining": limit - 1, "reset_at": reset_at}

    if bucket["count"] >= limit:
        return {"allowed": False, "remaining": 0, "reset_at": bucket["reset_at"]}

    bucket["count"] += 1
    return {"allowed": True, "remaining": limit - bucket["count"], "reset_at": bucket["reset_at"]}
