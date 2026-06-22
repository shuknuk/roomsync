import { Shield, Users, MessageCircle, Search, CheckCircle, Heart } from 'lucide-react';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

const features = [
  {
    icon: Shield,
    title: 'Verified Users',
    description: 'All users go through identity verification for your safety and peace of mind.',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: Search,
    title: 'Smart Matching',
    description: 'Our algorithm matches you with compatible roommates based on lifestyle and preferences.',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: MessageCircle,
    title: 'Instant Messaging',
    description: 'Connect with potential roommates instantly through our secure messaging platform.',
    color: 'from-pink-500 to-pink-600'
  }
];

export function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-32 md:py-40 overflow-hidden transition-colors duration-300 bg-neutral-50 dark:bg-neutral-900">
      {/* Subtle gradient background */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #F4CCF5 0%, transparent 70%)' }}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.3 } : { opacity: 0 }}
        transition={{ duration: 1.2 }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-5xl md:text-6xl tracking-tight text-neutral-900 dark:text-white mb-6">
            Why Choose Roomora?
          </h2>
          <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
            We built Roomora so you never have to post in a random group chat again.
          </p>
        </motion.div>

        {/* Features Grid - Apple-inspired cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                className="group relative overflow-hidden rounded-3xl p-10 bg-white dark:bg-neutral-800"
                style={{
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)'
                }}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.2,
                  ease: [0.22, 1, 0.36, 1]
                }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                {/* Hover gradient overlay */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(135deg, rgba(244, 204, 245, 0.1) 0%, transparent 100%)' }}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />

                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8"
                    style={{ backgroundColor: '#F4CCF5' }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon className="w-8 h-8 text-black" strokeWidth={2} />
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-2xl tracking-tight text-neutral-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-lg">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
