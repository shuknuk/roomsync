import { Shield, Search, MessageCircle } from 'lucide-react';

// ponytail: Simplified by utilizing Tailwind v4 transition classes (transition-all, duration-300, hover:scale-102, etc.) for high-performance hover effects instead of heavy Framer Motion script definitions.
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
  return (
    <section className="relative py-32 md:py-40 overflow-hidden transition-colors duration-300 bg-neutral-50 dark:bg-neutral-900 border-t border-b border-black/5 dark:border-white/5">
      {/* Subtle gradient background orb */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 blur-3xl pointer-events-none opacity-30"
        style={{ background: 'radial-gradient(circle, #F4CCF5 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto animate-fade-up">
          <h2 className="text-5xl md:text-6xl tracking-tight text-neutral-900 dark:text-white mb-6 font-bold">
            Why Choose Roomora?
          </h2>
          <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
            We built Roomora so you never have to post in a random group chat again.
          </p>
        </div>

        {/* Features Grid - Apple-inspired cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl p-10 bg-white dark:bg-neutral-800 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
                style={{
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)'
                }}
              >
                {/* Hover gradient overlay */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: 'linear-gradient(135deg, rgba(244, 204, 245, 0.08) 0%, transparent 100%)' }}
                />

                <div className="relative z-10">
                  {/* Icon */}
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                    style={{ backgroundColor: '#F4CCF5' }}
                  >
                    <Icon className="w-8 h-8 text-black" strokeWidth={2} />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl tracking-tight text-neutral-900 dark:text-white mb-4 font-bold">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-lg">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
