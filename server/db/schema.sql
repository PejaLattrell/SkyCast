-- ================================================================
-- SkyCast — Supabase Schema
-- Run this in your Supabase project:
--   Dashboard → SQL Editor → New Query → paste → Run
-- ================================================================

-- ── cities ───────────────────────────────────────────────────
-- One row per tracked city.
CREATE TABLE IF NOT EXISTS cities (
    id         SERIAL PRIMARY KEY,
    name       TEXT    NOT NULL UNIQUE,
    country    TEXT,
    latitude   DOUBLE PRECISION,
    longitude  DOUBLE PRECISION,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── weather_snapshots ─────────────────────────────────────────
-- One row per ETL fetch per city.
-- weather_data is the full WeatherData object matching the frontend type.
CREATE TABLE IF NOT EXISTS weather_snapshots (
    id           SERIAL PRIMARY KEY,
    city_name    TEXT        NOT NULL,
    fetched_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    weather_data JSONB       NOT NULL,

    CONSTRAINT fk_city FOREIGN KEY (city_name)
        REFERENCES cities (name) ON DELETE CASCADE
);

-- Fast lookup: latest snapshot for a given city
CREATE INDEX IF NOT EXISTS idx_snapshots_city_fetched
    ON weather_snapshots (city_name, fetched_at DESC);

-- ── Row-Level Security ────────────────────────────────────────
-- Allow anonymous read access (your frontend + ETL server both read).
-- The ETL server uses the service-role key to bypass RLS for writes.
ALTER TABLE cities           ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_cities"
    ON cities FOR SELECT USING (true);

CREATE POLICY "public_read_snapshots"
    ON weather_snapshots FOR SELECT USING (true);
