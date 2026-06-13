import { useWeatherStore } from '@/store/useWeatherStore';

/** Map European AQI value to a CSS colour — mirrors the Python _aqi_label() helper. */
function aqiColor(aqi: number): string {
  if (aqi <= 20) return '#7A9A6E';
  if (aqi <= 40) return '#A8C47A';
  if (aqi <= 60) return '#D4A03A';
  if (aqi <= 80) return '#C4957A';
  if (aqi <= 100) return '#B07070';
  return '#8B4444';
}

/** Compute 0–1 progress of the sun through today's arc based on real times. */
function sunProgress(sunrise: string, sunset: string): number {
  const parseTime = (t: string) => {
    const [timePart, ampm] = t.split(' ');
    let [h, m] = timePart.split(':').map(Number);
    if (ampm === 'PM' && h !== 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    return h * 60 + m;
  };
  try {
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const riseMin = parseTime(sunrise);
    const setMin = parseTime(sunset);
    if (setMin <= riseMin) return 0.5;
    return Math.min(1, Math.max(0, (nowMin - riseMin) / (setMin - riseMin)));
  } catch {
    return 0.3;
  }
}

export default function DailyHighlights() {
  const { weatherData } = useWeatherStore();
  const { current, daily } = weatherData;

  const progress = sunProgress(current.sunrise, current.sunset);
  const color = aqiColor(current.aqi);

  // Use the next 6 days' precipitation for the bar chart (skip today = index 0)
  const precipBars = daily.slice(1, 7);
  const maxPrecip = Math.max(...precipBars.map((d) => d.precipitation), 1);

  return (
    <section className="bg-cream py-12 px-6">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-heading-medium text-charcoal mb-6">Today's Highlights</h2>

        {/* Sunrise / Sunset */}
        <div className="glass-panel mb-6">
          <div className="flex items-center justify-between relative">
            {/* Sunrise */}
            <div className="flex flex-col items-start">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4A03A" strokeWidth="1.5" className="mb-1">
                <path d="M12 2v4M4.93 6.34l2.83 2.83M19.07 6.34l-2.83 2.83M6 14a6 6 0 1 1 12 0" />
              </svg>
              <p className="text-caption text-light-gray">Sunrise</p>
              <p className="text-heading-small text-charcoal">{current.sunrise}</p>
            </div>

            {/* Arc */}
            <div className="flex-1 mx-8 relative h-16">
              <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
                <path
                  d="M10 55 Q100 -20 190 55"
                  fill="none"
                  stroke="#C4957A"
                  strokeWidth="1.5"
                  opacity="0.3"
                />
                {/* Sun dot positioned by real time */}
                <circle
                  cx={10 + progress * 180}
                  cy={55 - Math.sin(progress * Math.PI) * 55}
                  r="6"
                  fill="#D4A03A"
                  className="animate-pulse"
                />
              </svg>
            </div>

            {/* Sunset */}
            <div className="flex flex-col items-end">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C4957A" strokeWidth="1.5" className="mb-1">
                <path d="M12 10V6M4.93 10.66l2.83-2.83M19.07 10.66l-2.83-2.83M6 18a6 6 0 1 0 12 0" />
              </svg>
              <p className="text-caption text-light-gray">Sunset</p>
              <p className="text-heading-small text-charcoal">{current.sunset}</p>
            </div>
          </div>
        </div>

        {/* AQI + Precipitation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Air Quality */}
          <div className="glass-panel">
            <p className="text-heading-small text-charcoal">Air Quality</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-heading-large font-light" style={{ color }}>{current.aqi}</span>
              <span className="text-body-regular text-warm-gray">{current.aqiLabel}</span>
            </div>
            {/* European AQI scale bar: 0–100 */}
            <div
              className="mt-4 w-full h-1.5 rounded-full relative overflow-hidden"
              style={{ background: 'linear-gradient(to right, #7A9A6E, #A8C47A, #D4A03A, #C4957A, #B07070, #8B4444)' }}
            >
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-cream shadow-soft"
                style={{
                  left: `${Math.min((current.aqi / 100) * 100, 97)}%`,
                  background: color,
                }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-caption text-light-gray">Good</span>
              <span className="text-caption text-light-gray">Very Poor</span>
            </div>
            {current.pm25 !== undefined && (
              <p className="text-caption text-light-gray mt-2">
                PM2.5 — <span className="text-charcoal">{current.pm25} µg/m³</span>
              </p>
            )}
          </div>

          {/* Precipitation */}
          <div className="glass-panel">
            <p className="text-heading-small text-charcoal">Precipitation</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-heading-large text-charcoal font-light">{current.precipitation24h}</span>
              <span className="text-body-small text-warm-gray">mm today</span>
            </div>
            {/* 6-day precipitation bar chart */}
            <div className="mt-4 flex items-end gap-2 h-10">
              {precipBars.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-sm bg-terracotta transition-all duration-500"
                    style={{
                      height: `${(d.precipitation / maxPrecip) * 100}%`,
                      minHeight: d.precipitation > 0 ? '4px' : '2px',
                      opacity: d.precipitation > 0 ? 0.7 : 0.2,
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-1">
              {precipBars.map((d, i) => (
                <span key={i} className="flex-1 text-center text-caption text-light-gray truncate">
                  {d.shortDay}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
