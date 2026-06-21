import { useLocation } from 'react-router';
import { useWeatherStore } from '@/store/useWeatherStore';
import { getFullTemp } from '@/lib/weather-utils';

interface TemperatureDisplayProps {
  value: number;
  size?: 'large' | 'medium' | 'small';
  showUnitToggle?: boolean;
  className?: string;
}

export default function TemperatureDisplay({
  value,
  size = 'large',
  showUnitToggle = true,
  className = '',
}: TemperatureDisplayProps) {
  const { unit, setUnit, weatherData } = useWeatherStore();
  const location = useLocation();
  
  const isNight = location.pathname === '/live' && weatherData.current.isNight;

  const sizeClasses = {
    large: 'text-data-display',
    medium: 'text-heading-large',
    small: 'text-heading-medium',
  };

  return (
    <div className={`inline-flex items-start gap-1 ${className}`}>
      <span className={`${sizeClasses[size]} font-light tracking-tight transition-colors duration-300 ${isNight ? 'text-cream' : 'text-charcoal'}`}>
        {getFullTemp(value, unit)}
        <sup className="text-[0.4em] align-super ml-0.5">°</sup>
      </span>
      {showUnitToggle && (
        <button
          onClick={() => setUnit(unit === 'C' ? 'F' : 'C')}
          className={`mt-2 h-6 px-2 rounded-full text-caption transition-all duration-300 cursor-pointer shadow-soft ${
            isNight
              ? 'bg-white/10 text-white/70 hover:text-white border border-white/10'
              : 'bg-cream text-warm-gray hover:text-charcoal'
          }`}
        >
          {unit}
        </button>
      )}
    </div>
  );
}
