import { Home, ArrowRight } from 'lucide-react';

// ponytail: Simplified by avoiding Framer Motion loops for the gradient animations and using custom CSS keyframes (animate-float-1, etc.) for high performance and zero dependency overhead.
interface FinalCTAProps {
  onStart: () => void;
  ctaLabel: string;
}

export function FinalCTA({ onStart, ctaLabel }: FinalCTAProps) {
  return (
    <section className="relative py-32 md:py-40 overflow-hidden transition-colors duration-300 bg-neutral-900 dark:bg-black border-t border-white/5">
      {/* Gradient background - Animated via CSS keyframes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[1000px] h-[1000px] rounded-full blur-3xl animate-float-1"
          style={{ 
            background: 'radial-gradient(circle, #B89CFF 0%, transparent 70%)',
            top: '-30%',
            left: '45%',
          }}
        />
        <div
          className="absolute w-[800px] h-[800px] rounded-full blur-3xl animate-float-2"
          style={{ 
            background: 'radial-gradient(circle, #F4CCF5 0%, transparent 70%)',
            bottom: '-30%',
            right: '-20%',
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 text-center animate-fade-up">
        {/* Icon */}
        <div className="mb-12 flex justify-center">
          <div
            className="w-28 h-28 rounded-3xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-6 shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #B89CFF 0%, #F4CCF5 100%)',
              boxShadow: '0 20px 60px rgba(184, 156, 255, 0.4)'
            }}
          >
            <Home className="w-14 h-14 text-white" strokeWidth={2} />
          </div>
        </div>

        {/* Headline */}
        <div className="space-y-2 mb-8">
          <h2 className="text-5xl md:text-6xl lg:text-7xl tracking-tight text-white font-bold leading-[1.1]">
            Ready to find
          </h2>
          <h2
            className="text-5xl md:text-6xl lg:text-7xl tracking-tight font-black leading-[1.1] text-transparent bg-clip-text"
            style={{
              backgroundImage: 'linear-gradient(135deg, #B89CFF 0%, #F4CCF5 100%)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text'
            }}
          >
            your people?
          </h2>
        </div>

        {/* Subtext */}
        <p className="text-xl md:text-2xl text-neutral-400 mb-14 max-w-3xl mx-auto leading-relaxed font-medium">
          Your Perfect Rutgers Roommate Match Starts Here
        </p>

        {/* CTA Button */}
        <div className="mb-16">
          <button
            onClick={onStart}
            className="group inline-flex items-center gap-3 px-10 py-5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 text-black text-lg font-bold tracking-tight shadow-xl"
            style={{
              backgroundColor: '#F4CCF5',
              boxShadow: '0 12px 40px rgba(244, 204, 245, 0.4)'
            }}
          >
            <div className="transition-transform duration-300 group-hover:scale-110">
              <Home className="w-6 h-6 text-black" />
            </div>
            <span>{ctaLabel}</span>
            <ArrowRight className="w-6 h-6 text-black transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

        {/* Footer Info */}
        <div className="space-y-6 pt-8 border-t border-white/10 max-w-2xl mx-auto">
          <p className="text-neutral-500 leading-relaxed font-medium">
            Launching at Rutgers University · Expanding to Big Ten schools soon
          </p>
          <p className="text-sm text-neutral-600">
            © 2026 Roomora. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  );
}
