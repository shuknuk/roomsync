import { Home, ArrowRight } from 'lucide-react';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

export function FinalCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-32 md:py-40 overflow-hidden transition-colors duration-300 bg-neutral-900 dark:bg-black">
      {/* Gradient background - Animated */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-[1000px] h-[1000px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, #B89CFF 0%, transparent 70%)' }}
          animate={{
            top: ['-30%', '-25%', '-30%'],
            left: ['45%', '50%', '45%'],
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
            bottom: ['-30%', '-25%', '-30%'],
            right: ['-20%', '-15%', '-20%'],
            opacity: [0.15, 0.2, 0.15],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        {/* Icon - Animated */}
        <motion.div
          className="mb-12 flex justify-center"
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.5, rotate: -10 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="w-28 h-28 rounded-3xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #B89CFF 0%, #F4CCF5 100%)',
              boxShadow: '0 20px 60px rgba(184, 156, 255, 0.4)'
            }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <Home className="w-14 h-14 text-white" strokeWidth={2} />
          </motion.div>
        </motion.div>

        {/* Headline - Staggered animation */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl tracking-tight text-white mb-2 leading-[1.1]">
            Ready to find
          </h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.h2
            className="text-5xl md:text-6xl lg:text-7xl tracking-tight mb-8 leading-[1.1] text-transparent bg-clip-text"
            style={{
              backgroundImage: 'linear-gradient(135deg, #B89CFF 0%, #F4CCF5 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text'
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
            your people?
          </motion.h2>
        </motion.div>

        {/* Subtext */}
        <motion.p
          className="text-xl md:text-2xl text-neutral-400 mb-14 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          Your Perfect Rutgers Roommate Match Could Start Here
        </motion.p>

        {/* CTA Button - Enhanced */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.a
            href="https://ramp-pine-94585756.figma.site"
            className="group inline-flex items-center gap-3 px-10 py-5 rounded-full"
            style={{
              backgroundColor: '#F4CCF5',
              boxShadow: '0 12px 40px rgba(244, 204, 245, 0.4)'
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <Home className="w-6 h-6 text-black" />
            </motion.div>
            <span className="text-black text-lg tracking-tight">Join Waitlist</span>
            <motion.div
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="w-6 h-6 text-black" />
            </motion.div>
          </motion.a>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          className="space-y-6 pt-8 border-t border-white/10 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-neutral-500 leading-relaxed">
            Launching at Rutgers University · Expanding to Big Ten schools soon
          </p>
          <p className="text-sm text-neutral-600">
            © 2026 Roomora. All rights reserved.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
