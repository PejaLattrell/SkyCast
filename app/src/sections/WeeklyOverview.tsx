import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WeatherIcon from '@/components/WeatherIcon';
import { useWeatherStore } from '@/store/useWeatherStore';
import { getWeekTempRange, mapRange } from '@/lib/weather-utils';
import type { DailyData } from '@/types/weather';

function DayCard({ day, index, isExpanded, onToggle, weekMin, weekMax }: {
  day: DailyData;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  weekMin: number;
  weekMax: number;
}) {
  const { unit } = useWeatherStore();
  const isToday = index === 0;

  const lowPct = mapRange(day.low, weekMin, weekMax, 0, 100);
  const highPct = mapRange(day.high, weekMin, weekMax, 0, 100);
  const barLeft = Math.min(lowPct, highPct);
  const barWidth = Math.abs(highPct - lowPct);

  const displayHigh = unit === 'F' ? Math.round((day.high * 9) / 5 + 32) : day.high;
  const displayLow = unit === 'F' ? Math.round((day.low * 9) / 5 + 32) : day.low;

  return (
    <div className="glass-panel !p-0 overflow-hidden cursor-pointer" onClick={onToggle}>
      {/* Collapsed Row */}
      <div className="flex items-center h-16 px-6">
        <span className={`text-body-regular font-medium w-[100px] flex-shrink-0 ${isToday ? 'text-terracotta' : 'text-charcoal'}`}>
          {day.day}
        </span>
        <div className="w-9 flex-shrink-0">
          <WeatherIcon condition={day.condition} size={24} className="text-warm-gray" />
        </div>
        <span className="text-body-small text-warm-gray w-[140px] md:w-[200px] flex-shrink-0 hidden sm:block ml-4">
          {day.conditionText}
        </span>
        <div className="flex-1 mx-4 hidden md:block">
          <div className="w-full h-1.5 rounded-full bg-black/[0.06] relative">
            <div
              className="absolute h-full rounded-full"
              style={{
                left: `${barLeft}%`,
                width: `${Math.max(barWidth, 4)}%`,
                background: 'linear-gradient(to right, #C4957A, #C49B8E)',
              }}
            />
            {isToday && (
              <div
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-terracotta border border-cream"
                style={{ left: `${mapRange(day.high, weekMin, weekMax, 0, 100)}%` }}
              />
            )}
          </div>
        </div>
        <span className="text-body-regular font-medium w-[80px] text-right flex-shrink-0 text-charcoal">
          {displayHigh}° <span className="text-warm-gray">/ {displayLow}°</span>
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`text-light-gray ml-3 transition-transform duration-300 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && day.hourly && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-4 pt-2 border-t border-white/10">
              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
                {day.hourly.map((h, i) => (
                  <div key={i} className="text-center py-2">
                    <p className="text-caption text-light-gray">{h.time}</p>
                    <div className="flex justify-center my-1">
                      <WeatherIcon condition={h.condition} size={20} className="text-warm-gray" />
                    </div>
                    <p className="text-body-small text-charcoal">
                      {unit === 'F' ? Math.round((h.temp * 9) / 5 + 32) : h.temp}°
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function WeeklyOverview() {
  const { weatherData } = useWeatherStore();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const { min, max } = getWeekTempRange(weatherData.daily);

  return (
    <section className="pt-20 pb-8 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-light-gray">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <h1 className="text-heading-large text-charcoal">{weatherData.location}</h1>
        </div>
        <p className="text-body-regular text-light-gray mb-6 ml-[18px]">{weatherData.date}</p>

        <div className="flex flex-col gap-2">
          {weatherData.daily.map((day, i) => (
            <DayCard
              key={day.day}
              day={day}
              index={i}
              isExpanded={expandedIndex === i}
              onToggle={() => setExpandedIndex(expandedIndex === i ? null : i)}
              weekMin={min}
              weekMax={max}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
