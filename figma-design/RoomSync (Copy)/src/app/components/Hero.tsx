export function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: '#443143' }}>
      {/* Gradient Orbs Background - Apple-inspired */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #B89CFF 0%, transparent 70%)' }}></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #F4CCF5 0%, transparent 70%)' }}></div>
        <div className="absolute top-[40%] right-[20%] w-[400px] h-[400px] rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #D8B4FE 0%, transparent 70%)' }}></div>
      </div>

      {/* Noise Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        mixBlendMode: 'overlay'
      }}></div>

      {/* Floating Background Cards - More subtle */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[15%] left-[8%] opacity-[0.06] transform rotate-[-8deg] transition-all duration-700 hover:opacity-10 hover:scale-105">
          <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 border border-white/20 w-80 shadow-2xl">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-white/40 flex items-center justify-center text-white text-xl">
                JS
              </div>
              <div>
                <div className="text-white text-xl">John Snow</div>
                <div className="text-white/60">Class of '28</div>
              </div>
            </div>
            <div className="space-y-2 mb-5 text-white/50">
              <p>Computer Science Major</p>
              <p>Night owl • Clean freak • Gamer</p>
            </div>
            <div className="flex gap-2">
              <div className="px-4 py-2 bg-white/20 rounded-full text-white text-sm">🎮 Gaming</div>
              <div className="px-4 py-2 bg-white/20 rounded-full text-white text-sm">📚 Studying</div>
            </div>
          </div>
        </div>

        <div className="absolute top-[25%] right-[10%] opacity-[0.06] transform rotate-[10deg] transition-all duration-700 hover:opacity-10 hover:scale-105">
          <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-10 border border-white/20 w-72 shadow-2xl">
            <div className="text-center">
              <div className="text-7xl font-bold mb-4 text-white">92%</div>
              <div className="text-white/80 text-lg mb-5">Compatibility Match</div>
              <div className="space-y-3 text-left">
                <div className="flex justify-between text-white/50">
                  <span>Sleep Schedule</span>
                  <span className="text-white">95%</span>
                </div>
                <div className="flex justify-between text-white/50">
                  <span>Cleanliness</span>
                  <span className="text-white">88%</span>
                </div>
                <div className="flex justify-between text-white/50">
                  <span>Social Habits</span>
                  <span className="text-white">93%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-[18%] left-[12%] opacity-[0.06] transform rotate-[5deg] transition-all duration-700 hover:opacity-10 hover:scale-105">
          <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 border border-white/20 w-80 shadow-2xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="text-2xl">🏠</div>
              <div className="text-white text-lg">Housing Preferences</div>
            </div>
            <div className="flex flex-wrap gap-2 mb-5">
              <div className="px-5 py-2 bg-white/20 rounded-full text-white">📍 On Campus</div>
              <div className="px-5 py-2 bg-white/20 rounded-full text-white">💰 $800-1200/mo</div>
              <div className="px-5 py-2 bg-white/20 rounded-full text-white">🛏️ Private Room</div>
            </div>
            <div className="text-white/50 mb-3">Move-in: Fall 2026</div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
          <div className="text-center max-w-5xl mx-auto">
            {/* Eyebrow Text */}
            <div className="mb-8 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse"></div>
              <span className="text-white/90 text-sm tracking-wide">Launching Fall 2026</span>
            </div>

            {/* Main Headline - Larger, Apple-style */}
            <h1 className="mb-8">
              <span className="block text-white text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.1] mb-4">
                Find Your Perfect
              </span>
              <span
                className="block text-transparent bg-clip-text text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.1]"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #B89CFF 0%, #F4CCF5 50%, #D8B4FE 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                }}
              >
                Roommate
              </span>
            </h1>

            {/* Subheading - More spacing */}
            <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto mb-14 leading-relaxed">
              RoomSync is the roommate-matching app built specifically for college students. Less anxiety, more compatibility — all in one place.
            </p>

            {/* CTA Button - Refined */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
              <a
                href="https://ramp-pine-94585756.figma.site"
                className="group relative inline-flex items-center justify-center px-10 py-5 overflow-hidden rounded-full transition-all duration-500"
                style={{ backgroundColor: '#F4CCF5' }}
              >
                <span className="relative z-10 text-black text-lg tracking-tight">Join the Waitlist</span>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 100%)' }}></div>
              </a>
            </div>

            {/* Quick Stats - Redesigned */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { label: 'Student Focused', value: '100%' },
                { label: 'Match Process', value: '3-Step' },
                { label: 'Launching', value: 'Fall 2026' }
              ].map((stat, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl p-8 transition-all duration-500 hover:scale-105"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    animation: `fadeUp 0.8s ease-out ${index * 0.15}s both`
                  }}
                >
                  <div className="relative z-10">
                    <div className="text-5xl text-white mb-3 tracking-tight">{stat.value}</div>
                    <div className="text-white/60 tracking-wide">{stat.label}</div>
                  </div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: 'linear-gradient(135deg, rgba(184, 156, 255, 0.1) 0%, transparent 100%)' }}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
