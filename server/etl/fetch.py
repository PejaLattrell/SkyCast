"""
ETL Step 1 — Fetch
Calls Open-Meteo Geocoding API, Forecast API, and Air Quality API using async httpx.
"""
from __future__ import annotations

import httpx
from config import (
    OPEN_METEO_GEOCODING_URL,
    OPEN_METEO_FORECAST_URL,
    OPEN_METEO_AIR_QUALITY_URL,
    OPEN_METEO_CURRENT_FIELDS,
    OPEN_METEO_HOURLY_FIELDS,
    OPEN_METEO_DAILY_FIELDS,
)


async def geocode_city(city_name: str) -> dict | None:
    """
    Resolve a city name to { name, country, latitude, longitude }
    using the Open-Meteo Geocoding API (free, no key required).

    Returns None if the city is not found.
    """
    params = {"name": city_name, "count": 1, "language": "en", "format": "json"}

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(OPEN_METEO_GEOCODING_URL, params=params)
        response.raise_for_status()
        data = response.json()

    results = data.get("results")
    if not results:
        return None

    top = results[0]
    return {
        "name": top.get("name", city_name),
        "country": top.get("country", ""),
        "latitude": top["latitude"],
        "longitude": top["longitude"],
    }


async def fetch_forecast(latitude: float, longitude: float) -> dict:
    """
    Fetch current + hourly + daily forecast from Open-Meteo.
    Returns raw API JSON (no transformation yet).
    """
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": OPEN_METEO_CURRENT_FIELDS,
        "hourly": OPEN_METEO_HOURLY_FIELDS,
        "daily": OPEN_METEO_DAILY_FIELDS,
        "timezone": "auto",
        "forecast_days": 7,
    }

    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(OPEN_METEO_FORECAST_URL, params=params)
        response.raise_for_status()
        return response.json()


async def fetch_air_quality(latitude: float, longitude: float) -> dict:
    """
    Fetch current European AQI and PM2.5 from the Open-Meteo Air Quality API.
    Returns a dict with 'european_aqi' and 'pm2_5' keys, or empty dict on failure.
    The Air Quality API is free and requires no API key.
    """
    params = {
        "latitude":  latitude,
        "longitude": longitude,
        "current":   "european_aqi,pm2_5",
        "timezone":  "auto",
    }
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(OPEN_METEO_AIR_QUALITY_URL, params=params)
            response.raise_for_status()
            return response.json()
    except Exception:
        # Air quality is non-critical — return empty on any failure
        return {}
