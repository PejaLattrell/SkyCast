import { useNavigate } from 'react-router';
import WeatherIcon from '@/components/WeatherIcon';

const features = [
  {
    icon: 'sunny' as const,
    title: 'Live Weather',
    description: 'Real-time conditions, temperature, humidity, and wind — all at a glance with beautiful, data-rich visualizations.',
    link: '/live',
    linkText: 'Check Live Weather',
  },
  {
    icon: 'partly-cloudy' as const,
    title: '7-Day Forecast',
    description: 'Plan your week with precision. Hourly and daily forecasts with trend charts and weather pattern insights.',
    link: '/forecast',
    linkText: 'See the Forecast',
  },
  {
    icon: 'thunderstorm' as const,
    title: 'Severe Alerts',
    description: 'Stay safe with instant notifications for storms, extreme temperatures, and severe weather events in your area.',
    link: '/live',
    linkText: 'View Alerts',
  },
];

export default function FeaturesShowcase() {
  const navigate = useNavigate();

  return (
    <section className="bg-cream py-20 px-6">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-display-medium text-charcoal text-center mb-16">
          Three Ways to Experience Weather
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-sand rounded-2xl p-10 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-elevated"
            >
              <div className="text-terracotta">
                <WeatherIcon condition={feature.icon} size={48} />
              </div>
              <h3 className="text-heading-small text-charcoal mt-6">{feature.title}</h3>
              <p className="text-body-regular text-warm-gray mt-3 leading-relaxed">
                {feature.description}
              </p>
              <button
                onClick={() => navigate(feature.link)}
                className="text-body-small text-terracotta mt-4 hover:underline cursor-pointer inline-flex items-center gap-1 transition-all"
              >
                {feature.linkText} <span>→</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
