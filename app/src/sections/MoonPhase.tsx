import { useWeatherStore } from '@/store/useWeatherStore';

export default function MoonPhase() {
  const { weatherData } = useWeatherStore();
  const { moon } = weatherData;

  // Waxing gibbous: right side illuminated at 78%

  return (
    <section className="bg-sand py-12 px-6">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-heading-medium text-charcoal mb-6">Moon Phase</h2>
        <div className="glass-panel flex flex-col items-center text-center">
          {/* Moon */}
          <div
            className="relative w-[100px] h-[100px] rounded-full overflow-hidden"
            style={{
              background: '#E8E4E0',
              boxShadow: '0 0 40px rgba(196, 149, 122, 0.2)',
            }}
          >
            {/* Moon base color */}
            <div className="absolute inset-0 rounded-full" style={{ background: '#DDD8D0' }} />

            {/* Illuminated portion */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: '#F0ECE4',
                clipPath: `ellipse(${moon.illumination}% 50% at 100% 50%)`,
              }}
            />

            {/* Crater details */}
            <div className="absolute w-3 h-3 rounded-full bg-black/[0.06]" style={{ top: '25%', left: '30%' }} />
            <div className="absolute w-2 h-2 rounded-full bg-black/[0.04]" style={{ top: '55%', left: '60%' }} />
            <div className="absolute w-4 h-4 rounded-full bg-black/[0.05]" style={{ top: '40%', left: '45%' }} />
          </div>

          <p className="text-heading-small text-charcoal mt-4">{moon.phase}</p>
          <p className="text-body-regular text-warm-gray mt-1">{moon.illumination}% illuminated</p>
          <p className="text-body-small text-light-gray mt-2">
            Rises {moon.moonrise} · Sets {moon.moonset}
          </p>
        </div>
      </div>
    </section>
  );
}
