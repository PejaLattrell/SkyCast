"""
ETL Step 4 — Pipeline
Orchestrates Fetch → Transform → Store for one city or all default cities.
"""
from __future__ import annotations

import asyncio
import logging

from config import DEFAULT_CITIES
from etl.fetch import geocode_city, fetch_forecast, fetch_air_quality
from etl.transform import transform
from etl.store import upsert_city, insert_snapshot, prune_old_snapshots

logger = logging.getLogger(__name__)


async def run_pipeline_for_city(city_name: str) -> dict | None:
    """
    Run the full ETL pipeline for a single city name.

    1. Geocode city name → lat/lon + country
    2. Fetch Open-Meteo forecast
    3. Transform raw data → WeatherData shape
    4. Upsert city + insert snapshot in Supabase
    5. Prune snapshots older than 24 h

    Returns the transformed WeatherData dict, or None on failure.
    """
    logger.info("ETL start: %s", city_name)

    # Step 1 — Geocode
    geo = await geocode_city(city_name)
    if not geo:
        logger.warning("Geocoding failed for city: %s", city_name)
        return None

    # Step 2 — Fetch forecast + air quality concurrently
    try:
        raw, aq_raw = await asyncio.gather(
            fetch_forecast(geo["latitude"], geo["longitude"]),
            fetch_air_quality(geo["latitude"], geo["longitude"]),
        )
    except Exception as exc:
        logger.error("Forecast fetch failed for %s: %s", city_name, exc)
        return None

    # Step 3 — Transform
    try:
        weather_data = transform(raw, geo["name"], geo["country"], aq_raw)
    except Exception as exc:
        logger.error("Transform failed for %s: %s", city_name, exc)
        return None

    # Step 4 — Store
    try:
        upsert_city(geo["name"], geo["country"], geo["latitude"], geo["longitude"])
        insert_snapshot(geo["name"], weather_data)
    except Exception as exc:
        logger.error("DB write failed for %s: %s", city_name, exc)
        # Still return data even if DB write fails (degraded mode)
        return weather_data

    # Step 5 — Prune
    try:
        prune_old_snapshots(geo["name"])
    except Exception as exc:
        logger.warning("Prune failed for %s: %s", city_name, exc)

    logger.info("ETL complete: %s → %s°C, %s", city_name, weather_data["current"]["temp"], weather_data["current"]["conditionText"])
    return weather_data


async def run_pipeline_for_all_cities() -> None:
    """
    Run the ETL pipeline for all DEFAULT_CITIES concurrently.
    Called on server startup and every REFRESH_INTERVAL_MINUTES thereafter.
    """
    logger.info("Running ETL for %d cities: %s", len(DEFAULT_CITIES), DEFAULT_CITIES)
    tasks = [run_pipeline_for_city(city) for city in DEFAULT_CITIES]
    results = await asyncio.gather(*tasks, return_exceptions=True)

    success = sum(1 for r in results if isinstance(r, dict))
    logger.info("ETL batch complete: %d/%d cities succeeded", success, len(DEFAULT_CITIES))
