import HeroSection from '@/sections/HeroSection';
import FeaturedCitiesStrip from '@/sections/FeaturedCitiesStrip';
import FeaturesShowcase from '@/sections/FeaturesShowcase';
import WeatherMapPreview from '@/sections/WeatherMapPreview';
import TestimonialsSection from '@/sections/TestimonialsSection';
import CTABanner from '@/sections/CTABanner';

export default function Explore() {
  return (
    <main>
      <HeroSection />
      <FeaturedCitiesStrip />
      <FeaturesShowcase />
      <WeatherMapPreview />
      <TestimonialsSection />
      <CTABanner />
    </main>
  );
}
