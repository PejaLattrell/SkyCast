import WeatherIcon from '@/components/WeatherIcon';
import { useWeatherStore } from '@/store/useWeatherStore';

export default function HourlyForecastStrip() {
  const { weatherData, unit } = useWeatherStore();
  const isNight = weatherData.current.isNight;

  return (
    <section className="py-6 px-6">
      <div className="max-w-[1200px] mx-auto">
        <p className={`text-caption transition-colors duration-300 ${isNight ? 'text-white/45' : 'text-light-gray'} mb-4`}>Today</p>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
          {weatherData.hourly.map((hour, i) => (
            <div
              key={hour.time}
              className={`
                glass-panel py-4 px-3 min-w-[72px] flex-shrink-0 text-center
                transition-all duration-200 cursor-pointer
                ${isNight ? 'hover:bg-white/20 border-white/10' : 'hover:bg-white/30'}
                ${i === 0 ? 'border-l-2 border-l-terracotta' : ''}
              `}
            >
              <p className={`text-body-small transition-colors duration-300 ${isNight ? 'text-white/50' : 'text-light-gray'}`}>{hour.time}</p>
              <div className="flex justify-center my-2">
                <WeatherIcon condition={hour.condition} size={28} className={`transition-colors duration-300 ${isNight ? 'text-white/70' : 'text-warm-gray'}`} />
              </div>
              <p className={`text-heading-small transition-colors duration-300 ${isNight ? 'text-cream' : 'text-charcoal'}`}>
                {unit === 'F' ? Math.round((hour.temp * 9) / 5 + 32) : hour.temp}°
              </p>
              {hour.precipitation > 0 && (
                <p className="text-caption text-amber mt-1">{hour.precipitation}%</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
