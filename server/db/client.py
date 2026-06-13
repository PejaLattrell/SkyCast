"""
Supabase client singleton.
All DB reads/writes go through the `supabase` instance exported here.
"""
from supabase import create_client, Client
from config import SUPABASE_URL, SUPABASE_KEY

# Single client instance reused across the app lifetime
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


# ── Read helpers ──────────────────────────────────────────────

def get_latest_snapshot(city_name: str) -> dict | None:
    """
    Return the most-recent weather_data JSON for the given city,
    or None if no snapshot exists yet.
    """
    result = (
        supabase.table("weather_snapshots")
        .select("weather_data, fetched_at")
        .eq("city_name", city_name)
        .order("fetched_at", desc=True)
        .limit(1)
        .execute()
    )
    if result.data:
        return result.data[0]["weather_data"]
    return None


def get_featured_snapshots(city_names: list[str]) -> list[dict]:
    """
    Return the latest snapshot for each of the given city names.
    Cities with no snapshot are silently skipped.
    """
    results = []
    for city in city_names:
        snapshot = get_latest_snapshot(city)
        if snapshot:
            results.append(snapshot)
    return results


def get_all_cached_city_names() -> list[str]:
    """Return names of all cities that have at least one snapshot."""
    result = (
        supabase.table("cities")
        .select("name")
        .order("name")
        .execute()
    )
    return [row["name"] for row in result.data]
