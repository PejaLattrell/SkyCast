import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { useWeatherStore } from '@/store/useWeatherStore';

export default function HeroSection() {
  const navigate = useNavigate();
  const { setLocation } = useWeatherStore();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const city = query.trim();
    if (!city) return;
    setLocation(city);
    navigate('/live');
  };

  return (
    <section className="relative min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden mt-16">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/hero-bg-video.mp4" type="video/mp4" />
      </video>

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(245, 240, 232, 0.85) 0%, rgba(245, 240, 232, 0.4) 40%, transparent 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-[800px] mx-auto px-6 text-center pt-20 pb-32">
        <motion.h1
          initial={{ filter: 'blur(8px)', opacity: 0 }}
          animate={{ filter: 'blur(0px)', opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="text-display-large text-charcoal"
        >
          Where Nature Meets Forecast
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-body-large text-warm-gray max-w-[560px] mx-auto mt-6"
        >
          Experience weather as it should be — beautiful, intuitive, and deeply connected to the world around you.
        </motion.p>

        {/* City Search */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          className="flex items-center gap-2 mt-8 max-w-[420px] mx-auto"
        >
          <input
            id="hero-city-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a city…"
            className="flex-1 h-12 px-5 rounded-full bg-white/60 backdrop-blur-xl border border-white/30 text-charcoal placeholder-light-gray text-body-regular outline-none focus:ring-2 focus:ring-white/50 transition-all"
          />
          <button
            type="submit"
            id="hero-search-btn"
            className="h-12 px-6 bg-cream text-charcoal text-heading-small rounded-full shadow-soft hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
          >
            Check Weather
          </button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-5"
        >
          <button
            onClick={() => navigate('/live')}
            className="h-11 px-7 bg-white/15 backdrop-blur-xl border border-white/20 text-charcoal text-heading-small rounded-full hover:shadow-card hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          >
            See the Forecast
          </button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-px h-10 bg-light-gray animate-bounce-scroll" />
      </motion.div>
    </section>
  );
}

