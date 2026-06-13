import { testimonials } from '@/data/weatherData';

export default function TestimonialsSection() {
  return (
    <section className="bg-blush py-20 px-6">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-heading-large text-charcoal text-center mb-12">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.author}
              className="bg-cream rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
            >
              <p className="text-body-large text-charcoal italic leading-relaxed">
                "{t.quote}"
              </p>
              <div className="w-8 h-0.5 bg-terracotta mt-5 mb-5" />
              <p className="text-body-small font-medium text-charcoal">{t.author}</p>
              <p className="text-caption text-light-gray mt-1">{t.location}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
