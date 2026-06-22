import { UserPlus, Search, MessageCircle } from 'lucide-react';

// ponytail: Simplified by using pure CSS gradient orbs and Tailwind layout transitions instead of heavy React Intersection observers and Framer Motion layout/scale animators.
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
  return (
    <section className="relative py-32 md:py-40 overflow-hidden transition-colors duration-300 bg-white dark:bg-neutral-800">
      {/* Decorative gradient orbs */}
      <div 
        className="absolute top-20 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(circle, #B89CFF 0%, transparent 70%)' }}
      />
      <div 
        className="absolute bottom-20 left-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(circle, #F4CCF5 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-24 max-w-3xl mx-auto animate-fade-up">
          <h2 className="text-5xl md:text-6xl tracking-tight text-neutral-900 dark:text-white mb-6 font-bold">
            How It Works
          </h2>
          <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
            Your Next Roommate Match Starts Here
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative text-center group"
              >
                {/* Step number - large background */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 text-[120px] opacity-[0.03] dark:opacity-[0.08] pointer-events-none select-none tracking-tighter font-extrabold">
                  {step.step}
                </div>

                {/* Icon container */}
                <div className="relative inline-block mb-8">
                  <div 
                    className="w-24 h-24 rounded-3xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                    style={{
                      backgroundColor: '#F4CCF5',
                      boxShadow: '0 8px 32px rgba(244, 204, 245, 0.3)'
                    }}
                  >
                    <Icon className="w-12 h-12 text-black" strokeWidth={2} />
                  </div>

                  {/* Step number badge */}
                  <div 
                    className="absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold transition-transform duration-300 group-hover:scale-110"
                    style={{ background: 'linear-gradient(135deg, #B89CFF 0%, #D8B4FE 100%)' }}
                  >
                    {step.step}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl tracking-tight text-neutral-900 dark:text-white mb-4 font-bold">
                  {step.title}
                </h3>
                <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>

                {/* Connecting line (not on last item) */}
                {index < steps.length - 1 && (
                  <div 
                    className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-neutral-200 dark:from-neutral-700 to-transparent transition-transform duration-500 origin-left group-hover:scale-x-105"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
