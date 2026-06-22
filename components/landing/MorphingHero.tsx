import { useState, useEffect } from 'react';

// ponytail: Optimized animation by using vanilla React state to manage fade transitions combined with Tailwind CSS classes instead of importing heavy motion libraries.
interface MorphingHeroProps {
  onStart: () => void;
  ctaLabel: string;
}

const heroSlides = [
  {
    title: 'Find Your Perfect',
    highlight: 'Roommate',
    description: 'Roomora is the roommate-matching app built specifically for college students. Less anxiety, more compatibility — all in one place.',
    stat: { value: '100%', label: 'Student Focused' }
  },
  {
    title: 'Smart Matching',
    highlight: 'Algorithm',
    description: 'Our compatibility quiz and AI-powered matching ensures you connect with roommates who share your lifestyle and preferences.',
    stat: { value: '3-Step', label: 'Match Process' }
  },
  {
    title: 'Join the Future',
    highlight: 'Fall 2026',
    description: 'Be part of the first wave. Starting at Rutgers University and expanding to Big Ten schools.',
    stat: { value: 'Fall 2026', label: 'Launching' }
  }
];

export function MorphingHero({ onStart, ctaLabel }: MorphingHeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // Trigger fade out
      setIsFading(true);
      
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        // Trigger fade in
        setIsFading(false);
      }, 400); // matches transition time
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const slide = heroSlides[currentSlide];

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center py-24 md:py-32" style={{ backgroundColor: '#443143' }}>
      {/* Gradient Orbs Background - Animated with custom CSS classes (refer to app/globals.css) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-3xl animate-float-1"
          style={{ 
            background: 'radial-gradient(circle, #B89CFF 0%, transparent 70%)',
            top: '-20%',
            left: '-10%',
          }}
        />
        <div
          className="absolute w-[800px] h-[800px] rounded-full blur-3xl animate-float-2"
          style={{ 
            background: 'radial-gradient(circle, #F4CCF5 0%, transparent 70%)',
            bottom: '-20%',
            right: '-10%',
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full blur-3xl animate-float-3"
          style={{ 
            background: 'radial-gradient(circle, #D8B4FE 0%, transparent 70%)',
            top: '40%',
            right: '20%',
          }}
        />
      </div>

      {/* Noise Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        mixBlendMode: 'overlay'
      }}></div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center max-w-5xl mx-auto">
          {/* Eyebrow Text */}
          <div className="mb-8 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-700 animate-fade-up">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse"></div>
            <span className="text-white/90 text-sm tracking-wide">Launching Fall 2026</span>
          </div>

          {/* Main Headline - Morphing via React fade */}
          <div className="mb-8 min-h-[200px] md:min-h-[280px] flex flex-col items-center justify-center">
            <div className={`transition-all duration-400 transform ${isFading ? 'opacity-0 translate-y-4 scale-95' : 'opacity-100 translate-y-0 scale-100'}`}>
              <h1>
                <span className="block text-white text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[1.1] mb-4">
                  {slide.title}
                </span>
                <span
                  className="block text-transparent bg-clip-text text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[1.1] font-black animate-gradient-text"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, #B89CFF 0%, #F4CCF5 50%, #D8B4FE 100%)',
                    backgroundSize: '200% 200%',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                  }}
                >
                  {slide.highlight}
                </span>
              </h1>
            </div>
          </div>

          {/* Subheading - Morphing */}
          <div className="min-h-[80px] mb-14">
            <p className={`text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed transition-all duration-400 ${isFading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
              {slide.description}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <button
              onClick={onStart}
              className="group relative inline-flex items-center justify-center px-10 py-5 overflow-hidden rounded-full transition-all duration-300 hover:scale-105 active:scale-95 text-black text-lg font-bold tracking-tight shadow-lg"
              style={{ 
                backgroundColor: '#F4CCF5',
                boxShadow: '0 8px 32px rgba(244, 204, 245, 0.3)'
              }}
            >
              <span>{ctaLabel}</span>
            </button>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center gap-3 mb-12">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsFading(true);
                  setTimeout(() => {
                    setCurrentSlide(idx);
                    setIsFading(false);
                  }, 400);
                }}
                className={`relative h-1.5 rounded-full overflow-hidden transition-all duration-300 ${
                  currentSlide === idx ? 'w-12 bg-white' : 'w-6 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Stats widget */}
          <div className="max-w-xs mx-auto">
            <div className={`group relative overflow-hidden rounded-2xl p-8 transition-all duration-400 bg-white/5 backdrop-blur-md border border-white/10 ${isFading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              <div className="relative z-10">
                <div className="text-5xl text-white mb-3 tracking-tight font-bold">
                  {slide.stat.value}
                </div>
                <div className="text-white/60 tracking-wide text-sm font-medium">
                  {slide.stat.label}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
