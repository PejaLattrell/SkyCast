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

export default function CurrentConditionsPanel() {
  const { weatherData } = useWeatherStore();
  const condition = weatherData.current.condition;
  const gradient = conditionGradients[condition] || conditionGradients['partly-cloudy'];

  return (
    <motion.section
      animate={{
        background: `linear-gradient(135deg, ${gradient.start} 0%, ${gradient.end} 100%)`,
      }}
      transition={{ duration: 0.8 }}
      className="pt-16 pb-12 px-6"
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Location Bar */}
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-light-gray">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <h1 className="text-heading-large text-charcoal">{weatherData.location}</h1>
        </div>
        <p className="text-body-regular text-light-gray mt-1 ml-[18px]">{weatherData.date}</p>

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
