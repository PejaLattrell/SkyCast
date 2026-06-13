import { useNavigate } from 'react-router';

export default function CTABanner() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden py-24 px-6" style={{ background: 'linear-gradient(135deg, #B8C4B0 0%, #EDE4D3 100%)' }}>
      {/* Floating decorative circles */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full bg-cream/[0.15] animate-float-1"
        style={{ top: '-10%', left: '-5%' }}
      />
      <div
        className="absolute w-[300px] h-[300px] rounded-full bg-cream/[0.15] animate-float-2"
        style={{ bottom: '-10%', right: '10%' }}
      />
      <div
        className="absolute w-[200px] h-[200px] rounded-full bg-cream/[0.15] animate-float-3"
        style={{ top: '30%', right: '20%' }}
      />

      <div className="relative z-10 max-w-[640px] mx-auto text-center">
        <h2 className="text-display-medium text-charcoal">
          Ready to See the Skies Differently?
        </h2>
        <p className="text-body-large text-warm-gray mt-4">
          Start your weather journey today.
        </p>
        <button
          onClick={() => navigate('/live')}
          className="mt-8 h-14 px-9 bg-cream text-charcoal text-heading-small rounded-full shadow-soft hover:shadow-elevated hover:scale-[1.03] transition-all duration-300 cursor-pointer"
        >
          Launch Live Weather
        </button>
      </div>
    </section>
  );
}
