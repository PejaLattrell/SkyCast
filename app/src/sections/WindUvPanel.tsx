import { useWeatherStore } from '@/store/useWeatherStore';

export default function WindUvPanel() {
  const { weatherData } = useWeatherStore();
  const { current } = weatherData;

  const uvAngle = (current.uvIndex / 11) * 180 - 180;
  const uvColor = current.uvIndex <= 2 ? '#7A9A6E' : current.uvIndex <= 5 ? '#D4A03A' : current.uvIndex <= 7 ? '#C4957A' : '#C49B8E';

  return (
    <section className="bg-cream py-12 px-6">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Wind Card */}
        <div className="glass-panel">
          <p className="text-heading-small text-charcoal">Wind</p>
          <div className="flex flex-col items-center mt-4">
            {/* Compass Rose */}
            <div className="relative w-[120px] h-[120px]">
              {/* Compass circle */}
              <div className="absolute inset-0 rounded-full border border-white/20" />
              {/* Cardinal directions */}
              <span className="absolute top-1 left-1/2 -translate-x-1/2 text-caption text-light-gray">N</span>
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-caption text-light-gray">S</span>
              <span className="absolute left-1 top-1/2 -translate-y-1/2 text-caption text-light-gray">W</span>
              <span className="absolute right-1 top-1/2 -translate-y-1/2 text-caption text-light-gray">E</span>
              {/* Directional arrow */}
              <svg
                className="absolute inset-0 w-full h-full animate-compass-pulse"
                viewBox="0 0 120 120"
                style={{ transform: `rotate(${current.windDeg}deg)` }}
              >
                <line x1="60" y1="60" x2="60" y2="20" stroke="#C4957A" strokeWidth="2.5" strokeLinecap="round" />
                <polygon points="60,15 55,25 65,25" fill="#C4957A" />
              </svg>
              {/* Center dot */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-charcoal" />
            </div>
            <p className="text-heading-large font-light text-charcoal mt-4">{current.windSpeed} km/h</p>
            <p className="text-body-small text-warm-gray mt-1">Direction: {current.windDirection}</p>
          </div>
        </div>

        {/* UV Index Card */}
        <div className="glass-panel">
          <p className="text-heading-small text-charcoal">UV Index</p>
          <div className="flex flex-col items-center mt-4">
            {/* Semi-circular gauge */}
            <div className="relative w-[120px] h-[60px] overflow-hidden">
              <svg viewBox="0 0 120 60" className="w-full h-full">
                {/* Background arc */}
                <path
                  d="M10 55 A50 50 0 0 1 110 55"
                  fill="none"
                  stroke="rgba(0,0,0,0.06)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                {/* Colored arc */}
                <defs>
                  <linearGradient id="uvGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#7A9A6E" />
                    <stop offset="50%" stopColor="#D4A03A" />
                    <stop offset="100%" stopColor="#C4957A" />
                  </linearGradient>
                </defs>
                <path
                  d="M10 55 A50 50 0 0 1 110 55"
                  fill="none"
                  stroke="url(#uvGrad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                {/* Needle */}
                <line
                  x1="60"
                  y1="55"
                  x2={60 + Math.cos((uvAngle * Math.PI) / 180) * 45}
                  y2={55 + Math.sin((uvAngle * Math.PI) / 180) * 45}
                  stroke="#2C2824"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="60" cy="55" r="4" fill="#2C2824" />
              </svg>
            </div>
            <p className="text-heading-large font-light mt-3" style={{ color: uvColor }}>{current.uvIndex}</p>
            <p className="text-body-regular text-warm-gray mt-1">
              {current.uvIndex <= 2 ? 'Low' : current.uvIndex <= 5 ? 'Moderate' : current.uvIndex <= 7 ? 'High' : 'Very High'}
            </p>
            <p className="text-body-small text-light-gray mt-2 text-center">
              {current.uvIndex <= 2 ? 'No protection needed' : current.uvIndex <= 5 ? 'Seek shade during midday hours' : 'Protection essential'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
