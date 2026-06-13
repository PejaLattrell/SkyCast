import type { WeatherCondition } from '@/types/weather';

interface WeatherIconProps {
  condition: WeatherCondition;
  size?: number;
  className?: string;
}

export default function WeatherIcon({ condition, size = 24, className = '' }: WeatherIconProps) {
  const s = size;

  switch (condition) {
    case 'sunny':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
          <g className="animate-spin-slow" style={{ transformOrigin: 'center' }}>
            <circle cx="12" cy="12" r="4" fill="currentColor" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <line
                key={deg}
                x1="12"
                y1="3"
                x2="12"
                y2="5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                transform={`rotate(${deg} 12 12)`}
              />
            ))}
          </g>
        </svg>
      );

    case 'partly-cloudy':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
          <g className="animate-spin-slow" style={{ transformOrigin: '8px 8px' }}>
            <circle cx="8" cy="8" r="3" fill="currentColor" />
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <line
                key={deg}
                x1="8"
                y1="2"
                x2="8"
                y2="3.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                transform={`rotate(${deg} 8 8)`}
              />
            ))}
          </g>
          <path
            className="animate-float"
            d="M15 16h3a3 3 0 0 0 0-6 3.5 3.5 0 0 0-6.5 1A4 4 0 0 0 8 15"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="rgba(255,255,255,0.3)"
          />
        </svg>
      );

    case 'cloudy':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
          <path
            className="animate-float"
            d="M6 16h12a4 4 0 0 0 0-8 4.5 4.5 0 0 0-8.5 1.5A5 5 0 0 0 4 15"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="rgba(255,255,255,0.25)"
          />
        </svg>
      );

    case 'overcast':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
          <path
            className="animate-float"
            style={{ animationDelay: '0.5s' }}
            d="M5 14h10a3.5 3.5 0 0 0 0-7 4 4 0 0 0-7.5 1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="rgba(255,255,255,0.2)"
          />
          <path
            className="animate-float"
            style={{ animationDelay: '1s' }}
            d="M8 18h9a3 3 0 0 0 0-6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="rgba(255,255,255,0.15)"
          />
        </svg>
      );

    case 'rainy':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
          <path
            d="M6 12h12a4 4 0 0 0 0-8 4.5 4.5 0 0 0-8.5 1.5A5 5 0 0 0 4 11"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="rgba(255,255,255,0.25)"
          />
          {[8, 12, 16].map((x, i) => (
            <line
              key={x}
              x1={x}
              y1="14"
              x2={x}
              y2="18"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              className="animate-rain"
              style={{ animationDelay: `${i * 0.3}s` }}
              strokeDasharray="4 16"
            />
          ))}
        </svg>
      );

    case 'heavy-rain':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
          <path
            d="M5 11h14a4 4 0 0 0 0-8 4.5 4.5 0 0 0-8.5 1.5A5 5 0 0 0 3 10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="rgba(255,255,255,0.25)"
          />
          {[6, 9, 12, 15, 18].map((x, i) => (
            <line
              key={x}
              x1={x}
              y1="13"
              x2={x}
              y2="18"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              className="animate-rain"
              style={{ animationDelay: `${i * 0.15}s` }}
              strokeDasharray="5 15"
            />
          ))}
        </svg>
      );

    case 'thunderstorm':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
          <path
            d="M5 10h14a4 4 0 0 0 0-8 4.5 4.5 0 0 0-8.5 1.5A5 5 0 0 0 3 9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="rgba(255,255,255,0.25)"
          />
          {[8, 16].map((x, i) => (
            <line
              key={x}
              x1={x}
              y1="12"
              x2={x}
              y2="15"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              className="animate-rain"
              style={{ animationDelay: `${i * 0.3}s` }}
              strokeDasharray="3 12"
            />
          ))}
          <path
            className="animate-lightning"
            d="M12 13l-2 4h3l-1 4 4-5h-3l2-3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="currentColor"
          />
        </svg>
      );

    case 'snowy':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
          <path
            d="M6 12h12a4 4 0 0 0 0-8 4.5 4.5 0 0 0-8.5 1.5A5 5 0 0 0 4 11"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="rgba(255,255,255,0.25)"
          />
          {[7, 12, 17].map((x, i) => (
            <g key={x} className="animate-snowfall" style={{ animationDelay: `${i * 0.6}s` }}>
              <text x={x} y="17" fill="currentColor" fontSize="8" textAnchor="middle">
                ❄
              </text>
            </g>
          ))}
        </svg>
      );

    case 'foggy':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
          {[7, 11, 15].map((y, i) => (
            <path
              key={y}
              d={`M4 ${y}q4 -2 8 0t8 0`}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="animate-foggypulse"
              style={{ animationDelay: `${i * 0.4}s` }}
            />
          ))}
        </svg>
      );

    case 'windy':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
          {[6, 10, 14].map((y, i) => (
            <path
              key={y}
              d={`M3 ${y}c2-2 5-1 6 0s3 1 5 0`}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="animate-float"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </svg>
      );

    case 'clear-night':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
          <path
            d="M14 4a7 7 0 1 0 6 12 9 9 0 0 1-6-12z"
            fill="currentColor"
            className="animate-float"
          />
          {[17, 20, 14].map((x, i) => (
            <circle
              key={x}
              cx={x}
              cy={5 + i * 5}
              r="0.8"
              fill="currentColor"
              className="animate-pulse"
              style={{ animationDelay: `${i * 0.5}s` }}
            />
          ))}
        </svg>
      );

    case 'partly-cloudy-night':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
          <path
            d="M12 3a6 6 0 1 0 5 11 8 8 0 0 1-5-11z"
            fill="currentColor"
            className="animate-float"
          />
          <circle cx="16" cy="6" r="0.6" fill="currentColor" className="animate-pulse" />
          <path
            className="animate-float"
            style={{ animationDelay: '0.5s' }}
            d="M15 17h3a3 3 0 0 0 0-6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="rgba(255,255,255,0.2)"
          />
        </svg>
      );

    case 'hail':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
          <path
            d="M6 11h12a4 4 0 0 0 0-8 4.5 4.5 0 0 0-8.5 1.5A5 5 0 0 0 4 10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="rgba(255,255,255,0.25)"
          />
          {[7, 12, 17].map((x, i) => (
            <rect
              key={x}
              x={x - 1}
              y={14 + i}
              width="2"
              height="2"
              rx="0.5"
              fill="currentColor"
              className="animate-snowfall"
              style={{ animationDelay: `${i * 0.4}s` }}
            />
          ))}
        </svg>
      );

    case 'sleet':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
          <path
            d="M6 11h12a4 4 0 0 0 0-8 4.5 4.5 0 0 0-8.5 1.5A5 5 0 0 0 4 10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="rgba(255,255,255,0.25)"
          />
          <line x1="8" y1="13" x2="8" y2="17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="animate-rain" strokeDasharray="4 12" />
          <text x="12" y="18" fill="currentColor" fontSize="6" textAnchor="middle" className="animate-snowfall">
            ❄
          </text>
          <line x1="16" y1="13" x2="16" y2="17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="animate-rain" strokeDasharray="4 12" style={{ animationDelay: '0.3s' }} />
        </svg>
      );

    default:
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
          <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
  }
}
