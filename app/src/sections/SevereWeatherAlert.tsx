import { useWeatherStore } from '@/store/useWeatherStore';

export default function SevereWeatherAlert() {
  const { weatherData } = useWeatherStore();
  const alert = weatherData.current.alert;

  if (!alert) return null;

  return (
    <section className="px-6 py-4">
      <div className="max-w-[1200px] mx-auto">
        <div className="bg-amber/[0.15] border-l-4 border-amber rounded-r-xl px-5 py-4 hover:bg-amber/[0.25] transition-colors duration-200 cursor-pointer">
          <div className="flex items-start gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4A03A" strokeWidth="2" className="flex-shrink-0 mt-0.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <div>
              <p className="text-heading-small text-amber">{alert.title}</p>
              <p className="text-body-regular text-charcoal mt-1">{alert.description}</p>
              <span className="text-body-small text-amber underline mt-2 inline-block">View details</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
