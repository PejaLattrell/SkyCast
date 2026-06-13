import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import WeatherIcon from '@/components/WeatherIcon';
import { featuredCities as staticCities } from '@/data/weatherData';
import { useWeatherStore } from '@/store/useWeatherStore';
import { formatTemp } from '@/lib/weather-utils';
import { fetchFeaturedCities, type FeaturedCityWeather } from '@/lib/weather-api';

export default function FeaturedCitiesStrip() {
  const { unit, fetchAndSetWeather, setLocation } = useWeatherStore();
  const [cities, setCities] = useState<FeaturedCityWeather[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);

  useEffect(() => {
    fetchFeaturedCities()
      .then(setCities)
      .catch(() => {
        // Fall back to static placeholder data if the backend is unreachable
        setCities(
          staticCities.map((c) => ({
            location: c.name,
            country: c.country,
            current: { temp: c.temp, condition: c.condition, conditionText: c.condition.replace('-', ' ') },
          }))
        );
      })
      .finally(() => setLoadingCities(false));
  }, []);

  return (
    <section className="bg-sand py-12 px-6">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-heading-medium text-charcoal mb-6">Around the World</h2>
        <motion.div
          drag="x"
          dragConstraints={{ left: -600, right: 0 }}
          dragElastic={0.1}
          className="flex gap-5 overflow-x-auto hide-scrollbar cursor-grab active:cursor-grabbing pb-2"
        >
          {loadingCities
            ? // Skeleton placeholders while fetching
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="glass-panel min-w-[200px] min-h-[140px] flex-shrink-0 animate-pulse"
                />
              ))
            : cities.map((city) => (
                <button
                  key={city.location}
                  onClick={() => {
                    setLocation(city.location);
                    fetchAndSetWeather(city.location);
                  }}
                  className="glass-panel min-w-[200px] min-h-[140px] flex-shrink-0 hover:shadow-card hover:border-white/[0.35] transition-all duration-300 text-left cursor-pointer"
                >
                  <h3 className="text-heading-small text-charcoal">{city.location}</h3>
                  <p className="text-caption text-light-gray mt-0.5">{city.country}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-heading-large font-light text-charcoal">
                      {formatTemp(city.current.temp, unit)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <WeatherIcon condition={city.current.condition} size={20} className="text-warm-gray" />
                    <span className="text-body-small text-warm-gray capitalize">
                      {city.current.conditionText}
                    </span>
                  </div>
                </button>
              ))}
        </motion.div>
      </div>
    </section>
  );
}

