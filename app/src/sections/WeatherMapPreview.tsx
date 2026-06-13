import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router';
import { useWeatherStore } from '@/store/useWeatherStore';
import { fetchFeaturedCities, type FeaturedCityWeather } from '@/lib/weather-api';

// ── City coordinates ───────────────────────────────────────────
const CITY_COORDS: Record<string, [number, number]> = {
  Tokyo:      [35.6895,  139.6917],
  Paris:      [48.8566,    2.3522],
  'New York': [40.7128,  -74.0060],
  Sydney:     [-33.8688, 151.2093],
  Dubai:      [25.2048,   55.2708],
  London:     [51.5074,   -0.1278],
  Manila:     [14.5995,  120.9842],
};

// ── WMO condition → emoji ──────────────────────────────────────
function conditionEmoji(condition: string): string {
  const map: Record<string, string> = {
    sunny: '☀️', clear: '☀️', 'clear-night': '🌙',
    'partly-cloudy': '⛅', 'partly-cloudy-night': '🌤️',
    cloudy: '☁️', overcast: '☁️', rainy: '🌧️',
    'heavy-rain': '⛈️', thunderstorm: '⛈️', snowy: '❄️',
    foggy: '🌫️', windy: '💨', hail: '🌨️', sleet: '🌨️',
  };
  return map[condition] ?? '🌡️';
}

// ── Build a Leaflet DivIcon for a city ─────────────────────────
function buildIcon(city: FeaturedCityWeather): L.DivIcon {
  const emoji = conditionEmoji(city.current.condition);
  return L.divIcon({
    className: '',   // prevent Leaflet's default white box
    iconAnchor: [0, 36],
    popupAnchor: [60, -36],
    html: `
      <div class="skycast-marker">
        <div class="skycast-marker-card">
          <span class="skycast-marker-emoji">${emoji}</span>
          <div class="skycast-marker-text">
            <span class="skycast-marker-name">${city.location}</span>
            <span class="skycast-marker-temp">${city.current.temp}°</span>
          </div>
        </div>
        <div class="skycast-marker-dot"></div>
      </div>
    `,
  });
}

export default function WeatherMapPreview() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<L.Map | null>(null);
  const layerGroup   = useRef<L.LayerGroup | null>(null);
  const navigate     = useNavigate();
  const { setLocation } = useWeatherStore();
  const [cities, setCities] = useState<FeaturedCityWeather[]>([]);

  // ── 1. Fetch live city data ────────────────────────────────
  useEffect(() => {
    fetchFeaturedCities().then(setCities).catch(() => {});
  }, []);

  // ── 2. Initialise Leaflet map (once) ──────────────────────
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = L.map(mapContainer.current, {
      center: [20, 15],
      zoom: 2,
      minZoom: 1.5,
      maxZoom: 8,
      zoomControl: false,
      attributionControl: true,
    });

    // Zoom control — top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Warm-toned CartoDB Voyager tile layer (free, no key)
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors ' +
          '&copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20,
      }
    ).addTo(map);

    layerGroup.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ── 3. Add / refresh markers when cities load ─────────────
  useEffect(() => {
    const lg = layerGroup.current;
    if (!lg || cities.length === 0) return;

    lg.clearLayers();

    cities.forEach((city) => {
      const coords = CITY_COORDS[city.location];
      if (!coords) return;

      const marker = L.marker(coords, { icon: buildIcon(city) });

      marker.on('click', () => {
        setLocation(city.location);
        navigate('/live');
      });

      marker.bindTooltip(
        `<strong>${city.location}</strong><br/>${city.current.conditionText} · ${city.current.temp}°C`,
        { direction: 'top', offset: [60, -40], className: 'skycast-tooltip' }
      );

      lg.addLayer(marker);
    });
  }, [cities, navigate, setLocation]);

  return (
    <>
      {/* ── Marker + map styles ─────────────────────────────── */}
      <style>{`
        /* Marker card */
        .skycast-marker { display: flex; flex-direction: column; align-items: flex-start; }
        .skycast-marker-card {
          display: flex; align-items: center; gap: 6px;
          background: rgba(245, 240, 232, 0.94);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.7);
          border-radius: 20px;
          padding: 5px 10px 5px 8px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.13);
          white-space: nowrap;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .skycast-marker-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        }
        .skycast-marker-emoji  { font-size: 18px; line-height: 1; }
        .skycast-marker-text   { display: flex; flex-direction: column; line-height: 1.25; }
        .skycast-marker-name   { font-size: 11px; font-weight: 700; color: #3D3731; }
        .skycast-marker-temp   { font-size: 13px; color: #6B5E54; }

        /* Pulsing dot below card */
        .skycast-marker-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #C4957A; margin-top: 3px; margin-left: 16px;
          box-shadow: 0 0 0 0 rgba(196,149,122,0.6);
          animation: skyCastPulse 2s ease-out infinite;
        }
        @keyframes skyCastPulse {
          0%   { box-shadow: 0 0 0 0   rgba(196,149,122,0.7); }
          70%  { box-shadow: 0 0 0 10px rgba(196,149,122,0); }
          100% { box-shadow: 0 0 0 0   rgba(196,149,122,0); }
        }

        /* Tooltip */
        .skycast-tooltip {
          background: rgba(245,240,232,0.95) !important;
          border: 1px solid rgba(255,255,255,0.6) !important;
          border-radius: 10px !important;
          color: #3D3731 !important;
          font-size: 13px !important;
          box-shadow: 0 4px 16px rgba(0,0,0,0.1) !important;
          padding: 6px 10px !important;
        }
        .skycast-tooltip::before { display: none !important; }

        /* Zoom controls */
        .leaflet-control-zoom a {
          background: rgba(245,240,232,0.9) !important;
          color: #3D3731 !important;
          border-color: rgba(0,0,0,0.08) !important;
        }
        .leaflet-control-zoom a:hover {
          background: #F0EBE4 !important;
        }

        /* Attribution */
        .leaflet-control-attribution {
          background: rgba(245,240,232,0.8) !important;
          font-size: 10px !important;
          border-radius: 6px 0 0 0 !important;
        }
      `}</style>

      <section className="bg-sky py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-display-medium text-charcoal text-center mb-4">
            Weather at a Glance
          </h2>
          <p className="text-body-regular text-warm-gray text-center mb-10">
            Click any city marker to view live conditions
          </p>

          <div className="relative max-w-[1000px] mx-auto aspect-video rounded-2xl shadow-elevated overflow-hidden ring-1 ring-black/5">
            <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
          </div>
        </div>
      </section>
    </>
  );
}
