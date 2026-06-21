import { useLocation } from 'react-router';
import { useWeatherStore } from '@/store/useWeatherStore';

export default function Footer() {
  const location = useLocation();
  const { weatherData } = useWeatherStore();
  
  const isNight = location.pathname === '/live' && weatherData.current.isNight;

  return (
    <footer className={`w-full py-12 px-6 pb-24 md:pb-12 transition-colors duration-500 ${isNight ? 'bg-[#1A1828]' : 'bg-cream'}`}>
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/assets/logo.png" alt="SkyCast Logo" className="w-6 h-6 rounded-full object-cover shadow-soft" />
            <span className={`text-heading-small font-medium tracking-tight ${isNight ? 'text-cream' : 'text-charcoal'}`}>
              SkyCast
            </span>
          </div>
          <div className="flex gap-6">
            <span className={`text-body-small cursor-pointer transition-colors ${isNight ? 'text-white/40 hover:text-white/70' : 'text-light-gray hover:text-warm-gray'}`}>About</span>
            <span className={`text-body-small cursor-pointer transition-colors ${isNight ? 'text-white/40 hover:text-white/70' : 'text-light-gray hover:text-warm-gray'}`}>Privacy</span>
            <span className={`text-body-small cursor-pointer transition-colors ${isNight ? 'text-white/40 hover:text-white/70' : 'text-light-gray hover:text-warm-gray'}`}>Terms</span>
          </div>
        </div>
        <div className="mt-6 text-center md:text-left">
          <span className={`text-caption ${isNight ? 'text-white/30' : 'text-light-gray'}`}>2025 SkyCast</span>
        </div>
      </div>
    </footer>
  );
}
