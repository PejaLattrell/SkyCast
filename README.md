# SkyCast 🌤️

A full-stack weather application with a real-time ETL pipeline, interactive map, and a beautifully designed UI.

**Live data flow:** Open-Meteo API → Python ETL → Supabase → FastAPI → React

---

## Screenshots

| Explore | Live Weather | Forecast |
|---|---|---|
| Landing page with city search and interactive Leaflet map | Current conditions, AQI, precipitation | 7-day forecast & hourly chart |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, Framer Motion |
| **Map** | Leaflet.js + CartoDB Voyager tiles (no API key needed) |
| **State** | Zustand |
| **Backend** | Python, FastAPI, APScheduler |
| **ETL** | Open-Meteo (forecast + air quality), httpx |
| **Database** | Supabase (PostgreSQL + Row Level Security) |

---

## Project Structure

```
Weather App/
├── app/                        # React / Vite frontend
│   ├── src/
│   │   ├── lib/
│   │   │   └── weather-api.ts  # All API calls to the backend
│   │   ├── sections/           # Page sections (map, highlights, etc.)
│   │   ├── store/
│   │   │   └── useWeatherStore.ts  # Zustand global state
│   │   └── types/
│   │       └── weather.ts      # Shared TypeScript types
│   ├── .env                    # Frontend env vars (git-ignored)
│   └── vite.config.ts          # Dev proxy: /api → localhost:8000
│
├── server/                     # FastAPI / ETL backend
│   ├── api/
│   │   └── routes.py           # REST endpoints
│   ├── db/
│   │   ├── client.py           # Supabase client + read helpers
│   │   └── schema.sql          # Run once in Supabase SQL Editor
│   ├── etl/
│   │   ├── fetch.py            # Open-Meteo geocoding, forecast & AQI
│   │   ├── transform.py        # Raw JSON → WeatherData shape
│   │   ├── store.py            # Supabase upsert / insert / prune
│   │   └── pipeline.py         # Orchestrates fetch → transform → store
│   ├── main.py                 # FastAPI app + lifespan scheduler
│   ├── config.py               # Loads .env, exports typed constants
│   ├── requirements.txt
│   ├── run.bat                 # One-command Windows launcher
│   └── .env                    # Backend credentials (git-ignored)
│
├── tech-spec.md
├── .gitignore
└── .gitattributes
```

---

## Data Flow

```
User searches city
      │
      ▼
React app  ──/api/weather?city=──▶  FastAPI (server/)
                                          │
                               reads latest snapshot
                                          │
                                          ▼
                                      Supabase
                                   (weather_snapshots)
                                          ▲
                              ETL runs every 10 min
                                          │
                              Open-Meteo Forecast API
                              Open-Meteo Air Quality API
```

---

## Prerequisites

- **Node.js** 18+ — [nodejs.org](https://nodejs.org)
- **Python** 3.9+ — [python.org](https://python.org)
- **Supabase** account — [supabase.com](https://supabase.com) (free tier)

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/skycast.git
cd skycast
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor → New Query**, paste the contents of [`server/db/schema.sql`](server/db/schema.sql) and click **Run**
3. Go to **Project Settings → API** and copy:
   - **Project URL** (e.g. `https://abcdef.supabase.co`)
   - **`service_role` secret key** (needed for ETL writes — keep server-side only)

### 3. Configure the backend

```bash
cd server
copy .env.example .env   # Windows
# cp .env.example .env   # macOS/Linux
```

Edit `server/.env`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

DEFAULT_CITIES=Tokyo,Paris,New York,Sydney,Dubai,London,Manila
REFRESH_INTERVAL_MINUTES=10
```

### 4. Start the backend

```powershell
cd server
.\run.bat
```

This will:
- Install Python dependencies from `requirements.txt`
- Start FastAPI on **http://localhost:8000**
- Immediately fetch weather for all default cities
- Auto-refresh data every 10 minutes

> **API docs** (auto-generated): [http://localhost:8000/docs](http://localhost:8000/docs)

### 5. Start the frontend

```bash
cd app
npm install
npm run dev
```

The app will be available at **http://localhost:5173**. The Vite dev proxy forwards all `/api/*` requests to the FastAPI backend automatically.

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | Liveness check |
| `GET` | `/api/weather?city=Manila` | Latest weather for a city |
| `GET` | `/api/weather/featured` | Latest snapshot for all default cities |
| `GET` | `/api/weather/cities` | Names of all cached cities |
| `POST` | `/api/refresh?city=Manila` | Manually trigger an ETL re-fetch |

---

## Environment Variables

### `server/.env`

| Variable | Required | Description |
|---|---|---|
| `SUPABASE_URL` | ✅ | Your Supabase project URL |
| `SUPABASE_KEY` | ✅ | `service_role` secret key (bypasses RLS for writes) |
| `DEFAULT_CITIES` | — | Comma-separated city list (default: 7 world cities) |
| `REFRESH_INTERVAL_MINUTES` | — | ETL refresh cadence (default: `10`) |

### `app/.env` *(optional)*

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend URL in production (leave empty for local dev) |

---

## Deployment

The monorepo deploys in two independent parts.

### Frontend → Vercel

1. Import repo on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `app`
3. Add env var: `VITE_API_BASE_URL = https://your-backend.railway.app`
4. Deploy — Vercel runs `npm run build` automatically

### Backend → Railway

1. Import repo on [railway.app](https://railway.app)
2. Set **Root Directory** to `server`
3. Set **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add the same env vars from `server/.env`

---

## Features

- 🌍 **Interactive Leaflet map** — live weather markers for featured cities, click to view details
- 🌡️ **Live conditions** — temperature, feels-like, humidity, wind, UV index, visibility, pressure, dew point
- 💨 **Air quality** — European AQI with EEA colour scale + PM2.5 reading (via Open-Meteo Air Quality API)
- 🌧️ **Precipitation** — today's total (mm) with a 6-day daily bar chart
- 📅 **7-day forecast** — high/low, condition, precipitation probability
- 🕐 **Hourly strip** — next 24 hours with condition icons
- 🌙 **Moon phase** — calculated from astronomical reference
- 🌅 **Sunrise/Sunset arc** — animated with real-time sun position
- 🔄 **Auto-refresh** — ETL runs every 10 minutes via APScheduler
- 🔍 **City search** — any city worldwide via Open-Meteo Geocoding API

---

## License

MIT

---

*Built with [Open-Meteo](https://open-meteo.com) (free, no API key) · [Supabase](https://supabase.com) · [Leaflet](https://leafletjs.com) · [FastAPI](https://fastapi.tiangolo.com)*
