import { useEffect } from 'react';
import { motion } from 'framer-motion';
import CurrentConditionsPanel from '@/sections/CurrentConditionsPanel';
import HourlyForecastStrip from '@/sections/HourlyForecastStrip';
import DailyHighlights from '@/sections/DailyHighlights';
import SevereWeatherAlert from '@/sections/SevereWeatherAlert';
import { useWeatherStore } from '@/store/useWeatherStore';

export default function LiveWeather() {
  const { location, loading, error, fetchAndSetWeather } = useWeatherStore();

  // Fetch live data from Supabase (via backend) whenever the city changes
  useEffect(() => {
    fetchAndSetWeather(location);
  }, [location]);

  if (loading) {
    return (
      <main className="pt-16 min-h-screen flex flex-col items-center justify-center gap-5">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-10 h-10 rounded-full border-2 border-light-gray border-t-terracotta"
        />
        <p className="text-body-regular text-warm-gray">Fetching live weather…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="pt-16 min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="text-4xl">⚠️</span>
        <p className="text-heading-medium text-charcoal">Could not load weather data</p>
        <p className="text-body-regular text-warm-gray max-w-sm">{error}</p>
        <button
          onClick={() => fetchAndSetWeather(location)}
          className="mt-2 h-10 px-6 bg-cream text-charcoal text-heading-small rounded-full shadow-soft hover:shadow-elevated transition-all duration-300"
        >
          Try again
        </button>
      </main>
    );
  }

  return (
    <main className="pt-16">
      <CurrentConditionsPanel />
      <HourlyForecastStrip />
      <SevereWeatherAlert />
      <DailyHighlights />
    </main>
  );
}
