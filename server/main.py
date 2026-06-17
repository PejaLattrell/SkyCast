"""
SkyCast — FastAPI application entry point.

Startup sequence:
  1. Run ETL for all DEFAULT_CITIES (fills Supabase on first boot)
  2. Start APScheduler to refresh every REFRESH_INTERVAL_MINUTES
  3. Serve API with CORS allowed for the Vite dev server
"""
import asyncio
import logging
import os
from contextlib import asynccontextmanager

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import router
from config import REFRESH_INTERVAL_MINUTES
from etl.pipeline import run_pipeline_for_all_cities

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

# ── Scheduler (instantiated here so lifespan can reference it) ─────────────
scheduler = AsyncIOScheduler(timezone="UTC")


# ── Lifespan (startup + shutdown) ───────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Run startup logic, yield for requests, then run shutdown logic."""
    logger.info("SkyCast API starting up…")

    # Run ETL for default cities in the background
    # (don't block startup — API is immediately available)
    asyncio.create_task(run_pipeline_for_all_cities())

    # Schedule recurring refresh
    scheduler.add_job(
        run_pipeline_for_all_cities,
        trigger="interval",
        minutes=REFRESH_INTERVAL_MINUTES,
        id="weather_refresh",
        replace_existing=True,
    )
    scheduler.start()
    logger.info(
        "Scheduler started — refreshing every %d minute(s)", REFRESH_INTERVAL_MINUTES
    )

    yield  # application runs here

    # Shutdown
    scheduler.shutdown(wait=False)
    logger.info("Scheduler stopped.")


app = FastAPI(
    title="SkyCast Weather API",
    description="ETL pipeline powered by Open-Meteo + Supabase",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────
# Read allowed origins from CORS_ORIGINS env var (comma-separated).
# Falls back to localhost ports for local development.
_default_origins = "http://localhost:5173,http://localhost:4173,http://127.0.0.1:5173"
_cors_env = os.getenv("CORS_ORIGINS", _default_origins)
_allowed_origins = [o.strip() for o in _cors_env.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ────────────────────────────────────────────────────
app.include_router(router)
