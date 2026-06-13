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
  const { unit, setUnit } = useWeatherStore();

  const sizeClasses = {
    large: 'text-data-display',
    medium: 'text-heading-large',
    small: 'text-heading-medium',
  };

  return (
    <div className={`inline-flex items-start gap-1 ${className}`}>
      <span className={`${sizeClasses[size]} text-charcoal font-light tracking-tight`}>
        {getFullTemp(value, unit)}
        <sup className="text-[0.4em] align-super ml-0.5">°</sup>
      </span>
      {showUnitToggle && (
        <button
          onClick={() => setUnit(unit === 'C' ? 'F' : 'C')}
          className="mt-2 h-6 px-2 bg-cream rounded-full text-caption text-warm-gray hover:text-charcoal transition-colors cursor-pointer shadow-soft"
        >
          {unit}
        </button>
      )}
    </div>
  );
}
