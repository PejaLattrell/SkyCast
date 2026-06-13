"""
FastAPI route definitions for the SkyCast weather API.

Endpoints:
  GET  /api/weather?city=Manila       — latest snapshot for a city
  GET  /api/weather/featured          — latest snapshots for all default cities
  GET  /api/weather/cities            — list of all cached city names
  POST /api/refresh?city=Manila       — manually trigger ETL for a city
  GET  /api/health                    — health check
"""
import asyncio
import logging

from fastapi import APIRouter, BackgroundTasks, HTTPException, Query

from config import DEFAULT_CITIES
from db.client import get_all_cached_city_names, get_featured_snapshots, get_latest_snapshot
from etl.pipeline import run_pipeline_for_city

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api")


@router.get("/health")
async def health():
    """Simple liveness check."""
    return {"status": "ok", "service": "skycast-weather-api"}


@router.get("/weather")
async def get_weather(city: str = Query(..., description="City name, e.g. 'Manila'")):
    """
    Return the latest cached weather snapshot for a city.
    If no snapshot exists yet, runs the ETL pipeline on-demand (first-time city search).
    Raises 404 if geocoding fails (city not found).
    """
    # Try DB first (fast path)
    data = get_latest_snapshot(city)
    if data:
        return data

    # On-demand ETL for a new city not in DEFAULT_CITIES
    logger.info("On-demand ETL triggered for: %s", city)
    data = await run_pipeline_for_city(city)
    if not data:
        raise HTTPException(
            status_code=404,
            detail=f"City '{city}' not found. Check the spelling and try again.",
        )
    return data


@router.get("/weather/featured")
async def get_featured():
    """
    Return latest snapshots for all default cities (the featured cities strip).
    Cities not yet cached are skipped; the scheduler will populate them shortly after startup.
    """
    snapshots = get_featured_snapshots(DEFAULT_CITIES)
    return snapshots


@router.get("/weather/cities")
async def get_cities():
    """Return names of all cities that have at least one cached snapshot."""
    return get_all_cached_city_names()


@router.post("/api/refresh")
async def refresh_city(
    city: str = Query(..., description="City name to re-fetch"),
    background_tasks: BackgroundTasks = None,
):
    """
    Manually trigger an ETL refresh for a specific city.
    The refresh runs in the background; returns immediately.
    """
    background_tasks.add_task(run_pipeline_for_city, city)
    return {"status": "refresh triggered", "city": city}
