import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

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

export function MorphingHero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const slide = heroSlides[currentSlide];

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: '#443143' }}>
      {/* Gradient Orbs Background - Animated */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, #B89CFF 0%, transparent 70%)' }}
          animate={{
            top: ['−20%', '−10%', '−20%'],
            left: ['−10%', '0%', '−10%'],
            opacity: [0.2, 0.25, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, #F4CCF5 0%, transparent 70%)' }}
          animate={{
            bottom: ['−20%', '−15%', '−20%'],
            right: ['−10%', '0%', '−10%'],
            opacity: [0.15, 0.2, 0.15],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, #D8B4FE 0%, transparent 70%)' }}
          animate={{
            top: ['40%', '45%', '40%'],
            right: ['20%', '25%', '20%'],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Noise Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        mixBlendMode: 'overlay'
      }}></div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
          <div className="text-center max-w-5xl mx-auto">
            {/* Eyebrow Text */}
            <motion.div
              className="mb-8 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse"></div>
              <span className="text-white/90 text-sm tracking-wide">Launching Fall 2026</span>
            </motion.div>

            {/* Main Headline - Morphing */}
            <div className="mb-8 min-h-[280px] flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.95 }}
                  transition={{
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                >
                  <h1 className="mb-6">
                    <span className="block text-white text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.1] mb-4">
                      {slide.title}
                    </span>
                    <motion.span
                      className="block text-transparent bg-clip-text text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.1]"
                      style={{
                        backgroundImage: 'linear-gradient(135deg, #B89CFF 0%, #F4CCF5 50%, #D8B4FE 100%)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                      }}
                      animate={{
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    >
                      {slide.highlight}
                    </motion.span>
                  </h1>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Subheading - Morphing */}
            <div className="min-h-[100px] mb-14">
              <AnimatePresence mode="wait">
                <motion.p
                  key={`desc-${currentSlide}`}
                  className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.2
                  }}
                >
                  {slide.description}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* CTA Button */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <a
                href="https://ramp-pine-94585756.figma.site"
                className="group relative inline-flex items-center justify-center px-10 py-5 overflow-hidden rounded-full transition-all duration-500 hover:scale-105"
                style={{ backgroundColor: '#F4CCF5' }}
              >
                <span className="relative z-10 text-black text-lg tracking-tight">Join the Waitlist</span>
                <motion.div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 100%)' }}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
              </a>
            </motion.div>

            {/* Progress Indicators */}
            <div className="flex justify-center gap-3 mb-12">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className="relative h-1.5 rounded-full overflow-hidden transition-all duration-300"
                  style={{ width: currentSlide === index ? '48px' : '24px' }}
                >
                  <div className="absolute inset-0 bg-white/20" />
                  {currentSlide === index && (
                    <motion.div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(135deg, #B89CFF 0%, #F4CCF5 100%)' }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 5, ease: 'linear' }}
                      style={{ transformOrigin: 'left' }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Animated Stat Card */}
            <div className="max-w-xs mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`stat-${currentSlide}`}
                  className="group relative overflow-hidden rounded-2xl p-8"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -30 }}
                  transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.3
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="relative z-10">
                    <div className="text-5xl text-white mb-3 tracking-tight">{slide.stat.value}</div>
                    <div className="text-white/60 tracking-wide">{slide.stat.label}</div>
                  </div>
                  <motion.div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(135deg, rgba(184, 156, 255, 0.1) 0%, transparent 100%)' }}
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
