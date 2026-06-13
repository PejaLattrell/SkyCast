"""
ETL Step 3 — Store
Upserts city metadata and inserts a new weather snapshot into Supabase.
Also prunes snapshots older than 24 hours to keep the table compact.
"""
import logging
from datetime import datetime, timedelta, timezone

from db.client import supabase

logger = logging.getLogger(__name__)


def upsert_city(name: str, country: str, latitude: float, longitude: float) -> None:
    """
    Insert a city row if it doesn't exist, or update coords/country if it does.
    Uses Supabase upsert on the unique `name` column.
    """
    supabase.table("cities").upsert(
        {
            "name":      name,
            "country":   country,
            "latitude":  latitude,
            "longitude": longitude,
        },
        on_conflict="name",
    ).execute()


def insert_snapshot(city_name: str, weather_data: dict) -> None:
    """
    Insert a new weather snapshot row for the given city.
    weather_data is the fully-transformed WeatherData dict.
    """
    supabase.table("weather_snapshots").insert(
        {
            "city_name":    city_name,
            "fetched_at":   datetime.now(timezone.utc).isoformat(),
            "weather_data": weather_data,
        }
    ).execute()
    logger.info("Snapshot stored for %s", city_name)


def prune_old_snapshots(city_name: str, keep_hours: int = 24) -> None:
    """
    Delete snapshots older than `keep_hours` hours for the given city.
    Keeps the table from growing indefinitely.
    """
    cutoff = (datetime.now(timezone.utc) - timedelta(hours=keep_hours)).isoformat()
    supabase.table("weather_snapshots").delete().eq(
        "city_name", city_name
    ).lt("fetched_at", cutoff).execute()
