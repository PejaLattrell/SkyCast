/**
 * weather-api.ts
 * ─────────────────────────────────────────────────────────────
 * All communication with the SkyCast Python backend.
 * In dev: Vite's proxy (vite.config.ts) rewrites "/api" → "http://localhost:8000/api".
 * In production: VITE_API_BASE_URL (set in .env.production) is prepended to all paths.
 */

import type { WeatherData } from '@/types/weather';

// In dev this is "" (empty), so relative /api paths work via Vite proxy.
// In production this is "https://skycast-api.onrender.com" (or wherever you deploy).
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

// ── Featured city shape returned by /api/weather/featured ────
export interface FeaturedCityWeather {
  location: string;
  country: string;
  current: {
    temp: number;
    condition: WeatherData['current']['condition'];
    conditionText: string;
  };
}

// ── Helpers ───────────────────────────────────────────────────

async function apiFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`);
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail ?? `API error ${response.status}`);
  }
  return response.json() as Promise<T>;
}

// ── Public API ────────────────────────────────────────────────

/**
 * Fetch full WeatherData for a city by name.
 * If the city has no cached snapshot, the backend triggers an on-demand ETL fetch.
 * Throws if the city is not found.
 */
export async function fetchWeather(city: string): Promise<WeatherData> {
  return apiFetch<WeatherData>(`/api/weather?city=${encodeURIComponent(city)}`);
}

/**
 * Fetch the latest snapshot for all featured/default cities.
 * Used to populate the FeaturedCitiesStrip on the Explore page.
 */
export async function fetchFeaturedCities(): Promise<FeaturedCityWeather[]> {
  const snapshots = await apiFetch<WeatherData[]>('/api/weather/featured');
  // Map full WeatherData to the lighter shape the strip needs
  return snapshots.map((s) => ({
    location: s.location,
    country: s.country,
    current: {
      temp: s.current.temp,
      condition: s.current.condition,
      conditionText: s.current.conditionText,
    },
  }));
}

/**
 * Manually trigger a refresh for a city (e.g. a "Refresh" button).
 * Returns immediately; the refresh runs in the background on the server.
 */
export async function refreshCity(city: string): Promise<void> {
  await fetch(`/api/refresh?city=${encodeURIComponent(city)}`, { method: 'POST' });
}
