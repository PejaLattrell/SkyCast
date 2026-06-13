"""
ETL Step 2 — Transform
Maps raw Open-Meteo JSON to the WeatherData shape used by the React frontend.

WeatherData shape mirrors src/types/weather.ts exactly so the FastAPI
response can be consumed directly without any frontend mapping.
"""
from __future__ import annotations

import math
from datetime import datetime, timezone


# ── WMO Weather Code → (condition, conditionText) ─────────────
# Full mapping of WMO 4677 codes to app WeatherCondition strings
WMO_CODE_MAP: dict[int, tuple[str, str]] = {
    0:  ("sunny",        "Clear Sky"),
    1:  ("sunny",        "Mainly Clear"),
    2:  ("partly-cloudy","Partly Cloudy"),
    3:  ("cloudy",       "Overcast"),
    45: ("foggy",        "Foggy"),
    48: ("foggy",        "Icy Fog"),
    51: ("rainy",        "Light Drizzle"),
    53: ("rainy",        "Drizzle"),
    55: ("rainy",        "Heavy Drizzle"),
    56: ("rainy",        "Light Freezing Drizzle"),
    57: ("rainy",        "Freezing Drizzle"),
    61: ("rainy",        "Light Rain"),
    63: ("rainy",        "Rain"),
    65: ("heavy-rain",   "Heavy Rain"),
    66: ("rainy",        "Light Freezing Rain"),
    67: ("heavy-rain",   "Freezing Rain"),
    71: ("snowy",        "Light Snow"),
    73: ("snowy",        "Snow"),
    75: ("snowy",        "Heavy Snow"),
    77: ("snowy",        "Snow Grains"),
    80: ("rainy",        "Light Rain Showers"),
    81: ("rainy",        "Rain Showers"),
    82: ("heavy-rain",   "Heavy Rain Showers"),
    85: ("snowy",        "Snow Showers"),
    86: ("snowy",        "Heavy Snow Showers"),
    95: ("thunderstorm", "Thunderstorm"),
    96: ("thunderstorm", "Thunderstorm with Hail"),
    99: ("thunderstorm", "Heavy Thunderstorm with Hail"),
}

# Day-of-week labels
_DAY_NAMES  = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
_SHORT_DAYS = ["Mon",    "Tue",     "Wed",       "Thu",      "Fri",    "Sat",      "Sun"]


# ── Helpers ───────────────────────────────────────────────────

def _map_wmo(code: int | None, is_night: bool = False) -> tuple[str, str]:
    """Map a WMO code to (condition, conditionText). Adjusts for night."""
    code = code or 0
    condition, text = WMO_CODE_MAP.get(code, ("cloudy", "Cloudy"))
    if is_night:
        if condition == "sunny":
            condition = "clear-night"
        elif condition == "partly-cloudy":
            condition = "partly-cloudy-night"
    return condition, text


def _deg_to_dir(degrees: float | None) -> str:
    """Convert compass degrees to 16-point direction string."""
    if degrees is None:
        return "N"
    dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE",
            "S","SSW","SW","WSW","W","WNW","NW","NNW"]
    return dirs[round((degrees % 360) / 22.5) % 16]


def _fmt_time(iso_str: str | None) -> str:
    """
    Convert ISO datetime string '2026-06-12T05:43' → '5:43 AM'.
    Cross-platform (no %-I Linux-only format).
    """
    if not iso_str:
        return "N/A"
    try:
        dt = datetime.fromisoformat(iso_str)
        hour = dt.hour % 12 or 12
        return f"{hour}:{dt.strftime('%M')} {'AM' if dt.hour < 12 else 'PM'}"
    except Exception:
        return "N/A"


def _is_night(now: datetime, sunrise_iso: str | None, sunset_iso: str | None) -> bool:
    """Return True if current local time is outside sunrise–sunset window."""
    try:
        if not sunrise_iso or not sunset_iso:
            return False
        sunrise = datetime.fromisoformat(sunrise_iso)
        sunset  = datetime.fromisoformat(sunset_iso)
        local_now = now.replace(tzinfo=None)
        return local_now < sunrise.replace(tzinfo=None) or local_now > sunset.replace(tzinfo=None)
    except Exception:
        return False


def _moon_phase(date: datetime) -> tuple[str, int]:
    """
    Approximate moon phase and illumination percentage for a given date.
    Reference new moon: 2000-01-06 (well-known astronomical anchor).
    """
    reference = datetime(2000, 1, 6, tzinfo=timezone.utc)
    cycle = 29.53058867  # mean synodic month in days
    days_since = (date.replace(tzinfo=timezone.utc) - reference).total_seconds() / 86400
    phase_day = days_since % cycle

    illumination = round(50 * (1 - math.cos(2 * math.pi * phase_day / cycle)))

    phases = [
        (0.0,  "New Moon"),
        (1.85, "Waxing Crescent"),
        (7.38, "First Quarter"),
        (11.07,"Waxing Gibbous"),
        (14.77,"Full Moon"),
        (18.46,"Waning Gibbous"),
        (22.15,"Last Quarter"),
        (25.84,"Waning Crescent"),
    ]
    phase_name = "New Moon"
    for threshold, name in phases:
        if phase_day >= threshold:
            phase_name = name

    return phase_name, illumination


def _safe(value, fallback=0):
    """Return value if not None, else fallback."""
    return value if value is not None else fallback


def _aqi_label(aqi: int) -> tuple[str, str]:
    """
    Map European AQI (0–500) to (label, colour_class).
    Thresholds per European Environment Agency (EEA) standard.
    """
    if aqi <= 20:   return "Good",            "#7A9A6E"   # sage green
    if aqi <= 40:   return "Fair",            "#A8C47A"
    if aqi <= 60:   return "Moderate",        "#D4A03A"   # amber
    if aqi <= 80:   return "Poor",            "#C4957A"   # terracotta
    if aqi <= 100:  return "Very Poor",       "#B07070"
    return           "Extremely Poor",        "#8B4444"


# ── Main transform ────────────────────────────────────────────

def transform(raw: dict, city_name: str, country: str, aq_raw: dict | None = None) -> dict:
    """
    Transform raw Open-Meteo API response into the WeatherData object
    that matches src/types/weather.ts on the frontend.
    """
    now = datetime.now()

    current_raw = raw.get("current", {})
    hourly_raw  = raw.get("hourly",  {})
    daily_raw   = raw.get("daily",   {})

    # Grab today's sunrise/sunset for night detection
    daily_sunrises = daily_raw.get("sunrise", [])
    daily_sunsets  = daily_raw.get("sunset",  [])
    today_sunrise  = daily_sunrises[0] if daily_sunrises else None
    today_sunset   = daily_sunsets[0]  if daily_sunsets  else None

    night = _is_night(now, today_sunrise, today_sunset)

    # ── Air quality (European AQI from Open-Meteo Air Quality API) ─
    aq_current = (aq_raw or {}).get("current", {})
    aqi_value  = aq_current.get("european_aqi") or 0
    aqi_value  = int(aqi_value)
    pm25       = round(float(aq_current.get("pm2_5") or 0), 1)
    aqi_label, _ = _aqi_label(aqi_value)

    # ── Current conditions ──────────────────────────────────
    wmo_code = _safe(current_raw.get("weathercode"), 0)
    condition, condition_text = _map_wmo(wmo_code, night)
    wind_deg = _safe(current_raw.get("winddirection_10m"), 0)

    # precipitation24h: use today's daily sum (more meaningful than instantaneous)
    daily_precip_list = daily_raw.get("precipitation_sum", [])
    precipitation24h = round(float(daily_precip_list[0]) if daily_precip_list else 0.0, 1)

    current = {
        "temp":             round(_safe(current_raw.get("temperature_2m"))),
        "feelsLike":        round(_safe(current_raw.get("apparent_temperature"))),
        "condition":        condition,
        "conditionText":    condition_text,
        "humidity":         round(_safe(current_raw.get("relative_humidity_2m"))),
        "windSpeed":        round(_safe(current_raw.get("windspeed_10m"))),
        "windDirection":    _deg_to_dir(wind_deg),
        "windDeg":          round(wind_deg),
        "uvIndex":          round(_safe(current_raw.get("uv_index"))),
        # Open-Meteo returns visibility in metres → convert to km
        "visibility":       round(_safe(current_raw.get("visibility")) / 1000),
        # surface_pressure is in hPa; keep as hPa (common worldwide standard)
        "pressure":         round(_safe(current_raw.get("surface_pressure")), 1),
        "dewPoint":         round(_safe(current_raw.get("dewpoint_2m"))),
        "sunrise":          _fmt_time(today_sunrise),
        "sunset":           _fmt_time(today_sunset),
        # Real AQI from Open-Meteo Air Quality API (European AQI scale)
        "aqi":              aqi_value,
        "aqiLabel":         aqi_label,
        "pm25":             pm25,
        "precipitation24h": precipitation24h,
        "alert":            None,
    }

    # ── Hourly (next 24 hours from current hour) ────────────
    h_times  = hourly_raw.get("time", [])
    h_temps  = hourly_raw.get("temperature_2m", [])
    h_codes  = hourly_raw.get("weathercode", [])
    h_precip = hourly_raw.get("precipitation_probability", [])

    # Find the index of the current hour in the hourly array
    current_hour_prefix = now.strftime("%Y-%m-%dT%H:00")
    start_idx = 0
    for i, t in enumerate(h_times):
        if t >= current_hour_prefix:
            start_idx = i
            break

    hourly: list[dict] = []
    for offset, i in enumerate(range(start_idx, min(start_idx + 24, len(h_times)))):
        t_dt = datetime.fromisoformat(h_times[i])
        # Determine if this hour is night using today's sunrise/sunset
        h_night = _is_night(t_dt, today_sunrise, today_sunset)
        h_condition, _ = _map_wmo(_safe(h_codes[i] if i < len(h_codes) else 0), h_night)

        # Label: "Now" for first, then "5 PM", "6 PM" etc.
        if offset == 0:
            label = "Now"
        else:
            h = t_dt.hour % 12 or 12
            label = f"{h} {'AM' if t_dt.hour < 12 else 'PM'}"

        hourly.append({
            "time":          label,
            "temp":          round(_safe(h_temps[i] if i < len(h_temps) else 0)),
            "condition":     h_condition,
            "precipitation": round(_safe(h_precip[i] if i < len(h_precip) else 0)),
        })

    # ── Daily 7-day forecast ─────────────────────────────────
    d_times  = daily_raw.get("time", [])
    d_codes  = daily_raw.get("weathercode", [])
    d_max    = daily_raw.get("temperature_2m_max", [])
    d_min    = daily_raw.get("temperature_2m_min", [])
    d_precip = daily_raw.get("precipitation_sum", [])

    today_date = now.date()
    daily: list[dict] = []

    for i in range(min(7, len(d_times))):
        d_date = datetime.fromisoformat(d_times[i]).date()
        delta  = (d_date - today_date).days

        if delta == 0:
            day_label, short_label = "Today", "Today"
        elif delta == 1:
            day_label, short_label = "Tomorrow", "Tmrw"
        else:
            wd = d_date.weekday()
            day_label, short_label = _DAY_NAMES[wd], _SHORT_DAYS[wd]

        d_condition, d_text = _map_wmo(_safe(d_codes[i] if i < len(d_codes) else 0))

        daily.append({
            "day":           day_label,
            "shortDay":      short_label,
            "condition":     d_condition,
            "conditionText": d_text,
            "high":          round(_safe(d_max[i]    if i < len(d_max)    else 0)),
            "low":           round(_safe(d_min[i]    if i < len(d_min)    else 0)),
            "precipitation": round(_safe(d_precip[i] if i < len(d_precip) else 0)),
        })

    # ── Moon phase ───────────────────────────────────────────
    phase_name, illumination = _moon_phase(now)
    moon = {
        "phase":        phase_name,
        "illumination": illumination,
        "moonrise":     "N/A",
        "moonset":      "N/A",
    }

    # ── Assemble WeatherData ─────────────────────────────────
    return {
        "location": city_name,
        "country":  country,
        "date":     now.strftime("%A, %B %d").lstrip("0"),
        "current":  current,
        "hourly":   hourly,
        "daily":    daily,
        "moon":     moon,
    }
