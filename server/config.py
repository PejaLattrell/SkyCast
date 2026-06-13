"""
Central configuration — loads .env file and exposes typed settings.
"""
from __future__ import annotations

import os
from dotenv import load_dotenv

load_dotenv()

# ── Supabase ──────────────────────────────────────────────────
_raw_url = os.getenv("SUPABASE_URL", "").rstrip("/")
# Strip /rest/v1 suffix if the user accidentally included it in .env
# (handles both "/rest/v1" and "/rest/v1/" since we already rstrip'd slashes)
if _raw_url.endswith("/rest/v1"):
    _raw_url = _raw_url[: -len("/rest/v1")]
SUPABASE_URL: str = _raw_url
SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")


if not SUPABASE_URL or not SUPABASE_KEY:
    raise EnvironmentError(
        "SUPABASE_URL and SUPABASE_KEY must be set in server/.env\n"
        "Copy server/.env.example → server/.env and fill in your Supabase credentials."
    )

# ── ETL Settings ──────────────────────────────────────────────
REFRESH_INTERVAL_MINUTES: int = int(os.getenv("REFRESH_INTERVAL_MINUTES", "10"))

DEFAULT_CITIES: list[str] = [
    c.strip()
    for c in os.getenv(
        "DEFAULT_CITIES",
        "Tokyo,Paris,New York,Sydney,Dubai,London,Manila",
    ).split(",")
    if c.strip()
]

# ── Open-Meteo API ────────────────────────────────────────────
OPEN_METEO_GEOCODING_URL  = "https://geocoding-api.open-meteo.com/v1/search"
OPEN_METEO_FORECAST_URL   = "https://api.open-meteo.com/v1/forecast"
OPEN_METEO_AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1/air-quality"

# Fields to request from Open-Meteo
OPEN_METEO_CURRENT_FIELDS = ",".join([
    "temperature_2m",
    "apparent_temperature",
    "weathercode",
    "windspeed_10m",
    "winddirection_10m",
    "relative_humidity_2m",
    "dewpoint_2m",
    "precipitation",
    "uv_index",
    "visibility",
    "surface_pressure",
])

OPEN_METEO_HOURLY_FIELDS = ",".join([
    "temperature_2m",
    "weathercode",
    "precipitation_probability",
])

OPEN_METEO_DAILY_FIELDS = ",".join([
    "weathercode",
    "temperature_2m_max",
    "temperature_2m_min",
    "precipitation_sum",
    "sunrise",
    "sunset",
    "uv_index_max",
    "windspeed_10m_max",
])
