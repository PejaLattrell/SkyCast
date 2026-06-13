import WeatherIcon from '@/components/WeatherIcon';
import { useWeatherStore } from '@/store/useWeatherStore';

export default function HourlyForecastStrip() {
  const { weatherData, unit } = useWeatherStore();

  return (
    <section className="py-6 px-6">
      <div className="max-w-[1200px] mx-auto">
        <p className="text-caption text-light-gray mb-4">Today</p>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
          {weatherData.hourly.map((hour, i) => (
            <div
              key={hour.time}
              className={`
                glass-panel py-4 px-3 min-w-[72px] flex-shrink-0 text-center
                hover:bg-white/30 transition-all duration-200 cursor-pointer
                ${i === 0 ? 'border-l-2 border-l-terracotta' : ''}
              `}
            >
              <p className="text-body-small text-light-gray">{hour.time}</p>
              <div className="flex justify-center my-2">
                <WeatherIcon condition={hour.condition} size={28} className="text-warm-gray" />
              </div>
              <p className="text-heading-small text-charcoal">
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
