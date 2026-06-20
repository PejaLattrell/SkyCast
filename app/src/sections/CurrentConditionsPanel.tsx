import { useState } from 'react';
import { motion } from 'framer-motion';
import WeatherIcon from '@/components/WeatherIcon';
import TemperatureDisplay from '@/components/TemperatureDisplay';
import { useWeatherStore } from '@/store/useWeatherStore';
import { conditionGradients } from '@/data/weatherData';

function uvLabel(uv: number): string {
  if (uv <= 2) return 'Low';
  if (uv <= 5) return 'Moderate';
  if (uv <= 7) return 'High';
  if (uv <= 10) return 'Very High';
  return 'Extreme';
}

const dataCards = [
  { label: 'Humidity',   value: (d: typeof import('@/data/weatherData').sanFranciscoWeather) => `${d.current.humidity}%`,                          icon: '💧' },
  { label: 'Wind',       value: (d: typeof import('@/data/weatherData').sanFranciscoWeather) => `${d.current.windSpeed} km/h ${d.current.windDirection}`, icon: '💨' },
  { label: 'UV Index',   value: (d: typeof import('@/data/weatherData').sanFranciscoWeather) => `${d.current.uvIndex} (${uvLabel(d.current.uvIndex)})`,   icon: '☀️' },
  { label: 'Visibility', value: (d: typeof import('@/data/weatherData').sanFranciscoWeather) => `${d.current.visibility} km`,                       icon: '👁' },
  { label: 'Pressure',   value: (d: typeof import('@/data/weatherData').sanFranciscoWeather) => `${d.current.pressure} hPa`,                        icon: '📊' },
  { label: 'Dew Point',  value: (d: typeof import('@/data/weatherData').sanFranciscoWeather) => `${d.current.dewPoint}°`,                           icon: '🌡️' },
];

const landmarkImages: Record<string, string> = {
  'manila': '/assets/landmarks/Manila.webp',
  'paris': '/assets/landmarks/Paris.webp',
  'dubai': '/assets/landmarks/Dubai.webp',
  'london': '/assets/landmarks/London.jpg',
  'sydney': '/assets/landmarks/SydneyOperaHouse.jpg',
  'tokyo': '/assets/landmarks/Tokyo-Tower.jpg',
  'new york': '/assets/landmarks/new_york.jpg',
  'newyork': '/assets/landmarks/new_york.jpg',
  'san francisco': '/assets/landmarks/san_francisco.png',
  'sanfrancisco': '/assets/landmarks/san_francisco.png',
};

function getCityLandmark(location: string): string | null {
  const norm = location.toLowerCase().trim();
  for (const [key, path] of Object.entries(landmarkImages)) {
    if (norm.includes(key)) {
      return path;
    }
  }
  return null;
}

export default function CurrentConditionsPanel() {
  const { weatherData, fetchAndSetWeather } = useWeatherStore();
  const [query, setQuery] = useState('');
  const condition = weatherData.current.condition;
  const gradient = conditionGradients[condition] || conditionGradients['partly-cloudy'];
  const landmarkUrl = getCityLandmark(weatherData.location);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const city = query.trim();
    if (!city) return;
    fetchAndSetWeather(city);
    setQuery('');
  };

  return (
    <motion.section
      animate={{
        background: `linear-gradient(135deg, ${gradient.start} 0%, ${gradient.end} 100%)`,
      }}
      transition={{ duration: 0.8 }}
      className="relative overflow-hidden pt-16 pb-12 px-6"
    >
      {/* Landmark Background */}
      {landmarkUrl && (
        <motion.div
          key={landmarkUrl}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute inset-0 pointer-events-none z-0 landmark-mask"
          style={{
            backgroundImage: `url(${landmarkUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'left center',
          }}
        />
      )}

      <div className="relative z-10 max-w-[1200px] mx-auto">
        {/* Location Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-light-gray">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <h1 className="text-heading-large text-charcoal">{weatherData.location}</h1>
            </div>
            <p className="text-body-regular text-light-gray mt-1 ml-[18px]">{weatherData.date}</p>
          </div>

          {/* Search Bar - starts in the middle of stats (matches Column 2 + Column 3 width) and extends to the right */}
          <form onSubmit={handleSearch} className="relative flex items-center w-full lg:w-[30%]">
            <input
              id="live-city-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a city…"
              className="w-full h-10 pl-5 pr-11 rounded-full bg-white/30 backdrop-blur-xl border border-white/20 text-charcoal placeholder-light-gray text-body-regular outline-none focus:ring-2 focus:ring-white/40 transition-all shadow-soft"
            />
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="absolute right-4 text-light-gray pointer-events-none"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </form>
        </div>

        {/* Main Display */}
        <div className="mt-10 flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left - Main Weather */}
          <div className="lg:w-[55%] flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="text-terracotta">
              <WeatherIcon condition={condition} size={120} />
            </div>
            <div className="mt-4">
              <TemperatureDisplay value={weatherData.current.temp} size="large" />
            </div>
            <p className="text-heading-medium text-charcoal mt-2">
              {weatherData.current.conditionText}
            </p>
            <p className="text-body-regular text-warm-gray mt-1">
              Feels like {weatherData.current.feelsLike}°
            </p>
          </div>

          {/* Right - Data Grid */}
          <div className="lg:w-[45%] grid grid-cols-2 md:grid-cols-3 gap-4">
            {dataCards.map((card) => (
              <div
                key={card.label}
                className="glass-panel p-5 hover:shadow-card hover:border-white/[0.35] transition-all duration-300"
              >
                <span className="text-lg">{card.icon}</span>
                <p className="text-caption text-light-gray mt-2">{card.label}</p>
                <p className="text-heading-small text-charcoal mt-1">{card.value(weatherData)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
