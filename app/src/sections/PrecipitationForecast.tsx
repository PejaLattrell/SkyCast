import { useState } from 'react';

const precipitationData = [
  { day: 'Tue', rain: 0.1, snow: 0, mixed: 0, chance: 30 },
  { day: 'Wed', rain: 0.4, snow: 0, mixed: 0, chance: 65 },
  { day: 'Thu', rain: 0.15, snow: 0, mixed: 0, chance: 40 },
  { day: 'Fri', rain: 0.02, snow: 0, mixed: 0, chance: 10 },
  { day: 'Sat', rain: 0.05, snow: 0, mixed: 0, chance: 15 },
  { day: 'Sun', rain: 0, snow: 0, mixed: 0, chance: 0 },
  { day: 'Mon', rain: 0, snow: 0, mixed: 0, chance: 5 },
];

const maxAmount = 0.5;

export default function PrecipitationForecast() {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  return (
    <section className="bg-sand py-12 px-6">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-heading-medium text-charcoal mb-6">Precipitation</h2>
        <div className="glass-panel">
          <div className="flex items-end justify-around gap-4 h-[200px]">
            {precipitationData.map((d, i) => {
              const total = d.rain + d.snow + d.mixed;
              const barHeight = Math.max((total / maxAmount) * 100, 4);
              const rainH = d.rain > 0 ? (d.rain / total) * barHeight : 0;
              const snowH = d.snow > 0 ? (d.snow / total) * barHeight : 0;

              return (
                <div
                  key={d.day}
                  className="flex flex-col items-center flex-1 max-w-[80px] h-full justify-end cursor-pointer"
                  onMouseEnter={() => setHoveredBar(i)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  <span className={`text-body-small mb-2 transition-opacity ${hoveredBar === i ? 'opacity-100' : 'opacity-70'}`}>
                    {d.chance}%
                  </span>
                  <div className="w-full relative" style={{ height: `${barHeight}%` }}>
                    {d.rain > 0 && (
                      <div
                        className="absolute bottom-0 w-full rounded-t-sm transition-opacity"
                        style={{
                          height: `${rainH}%`,
                          backgroundColor: '#C4957A',
                          opacity: hoveredBar === i ? 1 : 0.7,
                        }}
                      />
                    )}
                    {d.snow > 0 && (
                      <div
                        className="absolute w-full rounded-t-sm transition-opacity"
                        style={{
                          bottom: `${rainH}%`,
                          height: `${snowH}%`,
                          backgroundColor: '#D4E4ED',
                          opacity: hoveredBar === i ? 1 : 0.7,
                        }}
                      />
                    )}
                  </div>
                  <span className="text-caption text-light-gray mt-2">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
