import { UserPlus, Search, MessageCircle } from 'lucide-react';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

const steps = [
  {
    icon: UserPlus,
    step: '01',
    title: 'Create Your Profile',
    description: 'Share your lifestyle, budget, and housing preferences in minutes.'
  },
  {
    icon: Search,
    step: '02',
    title: 'Browse & Match',
    description: 'Browse compatibility-ranked profiles. Like the ones that feel right.'
  },
  {
    icon: MessageCircle,
    step: '03',
    title: 'Connect & Chat',
    description: 'Chat, confirm details, and sign that lease — stress free.'
  }
];

export function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-32 md:py-40 overflow-hidden transition-colors duration-300 bg-white dark:bg-neutral-800">
      {/* Decorative gradient orbs */}
      <motion.div
        className="absolute top-20 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #B89CFF 0%, transparent 70%)' }}
        initial={{ opacity: 0, x: 100 }}
        animate={isInView ? { opacity: 0.2, x: 0 } : { opacity: 0, x: 100 }}
        transition={{ duration: 1.5 }}
      />
      <motion.div
        className="absolute bottom-20 left-0 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #F4CCF5 0%, transparent 70%)' }}
        initial={{ opacity: 0, x: -100 }}
        animate={isInView ? { opacity: 0.2, x: 0 } : { opacity: 0, x: -100 }}
        transition={{ duration: 1.5 }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <motion.div
          className="text-center mb-24 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-5xl md:text-6xl tracking-tight text-neutral-900 dark:text-white mb-6">
            How It Works
          </h2>
          <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Your Next Roommate Match Starts Here
          </p>
        </motion.div>

        {/* Steps - Enhanced layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                className="relative text-center group"
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.2,
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                {/* Step number - large background */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 text-[120px] opacity-[0.03] dark:opacity-[0.08] pointer-events-none select-none tracking-tighter">
                  {step.step}
                </div>

                {/* Icon container */}
                <div className="relative inline-block mb-8">
                  <motion.div
                    className="w-24 h-24 rounded-3xl flex items-center justify-center"
                    style={{
                      backgroundColor: '#F4CCF5',
                      boxShadow: '0 8px 32px rgba(244, 204, 245, 0.3)'
                    }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon className="w-12 h-12 text-black" strokeWidth={2} />
                  </motion.div>

                  {/* Step number badge */}
                  <motion.div
                    className="absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center text-white text-sm"
                    style={{ background: 'linear-gradient(135deg, #B89CFF 0%, #D8B4FE 100%)' }}
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : { scale: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                  >
                    {step.step}
                  </motion.div>
                </div>

                {/* Content */}
                <h3 className="text-2xl tracking-tight text-neutral-900 dark:text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>

                {/* Connecting line (not on last item) */}
                {index < steps.length - 1 && (
                  <motion.div
                    className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-neutral-200 dark:from-neutral-700 to-transparent"
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 + 0.5 }}
                    style={{ transformOrigin: 'left' }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
