export function HowItWorksPage() {
  const steps = [
    {
      title: 'Download',
      description: 'Free from PlayStore or App Store. Available at participating universities- starting with Rutgers and rolling out to New.'
    },
    {
      title: 'Onboarding',
      description: 'Sign up with your university email to get verified instantly. Add a photo, a short bio, and a quick video intro — then set your roommate preferences so we know what actually matters to you.'
    },
    {
      title: 'Set your lifestyle filters',
      description: 'Answer our compatibility quiz covering sleep schedule, cleanliness, study habits, budget, and more. Then dial in your search filters — on-campus or off, price range, distance from campus, single or double.'
    },
    {
      title: 'Matching',
      description: 'Browse profiles sorted by compatibility with yours. Swipe right on people you\'d consider — when it\'s mutual, you both get notified. Free users get a daily swipe limit; upgrade anytime for unlimited.'
    },
    {
      title: 'Connect',
      description: 'No paywalls before messaging. Once you match, open a private DM to talk things through — budget, schedules, house rules — before committing to anything. Secure, in-app messaging only.'
    },
    {
      title: 'Lock it in',
      description: 'Once you find your people and both profiles are automatically removed from the search pool — no awkward lingering. Your account stays active for future moves.'
    }
  ];

  return (
    <div className="relative min-h-screen transition-colors duration-300 overflow-hidden bg-white dark:bg-neutral-900">
      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #B89CFF 0%, transparent 70%)' }}></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #F4CCF5 0%, transparent 70%)' }}></div>

      <div className="relative z-10 py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl lg:text-7xl tracking-tight text-neutral-900 dark:text-white mb-6">
              How It Works?
            </h1>
            <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-300 max-w-4xl mx-auto leading-relaxed">
              Roomora helps students move beyond scattered Facebook Marketplace posts and crowded GroupMe chats to find compatible college roommates through a more organized and personalized experience
            </p>
          </div>

          {/* Steps - Card layout */}
          <div className="space-y-8 mb-20">
            {steps.map((step, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl p-8 md:p-10 transition-all duration-500 hover:scale-[1.02] bg-white dark:bg-neutral-800"
                style={{
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
                  animation: `fadeUp 0.8s ease-out ${index * 0.1}s both`
                }}
              >
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: 'linear-gradient(135deg, rgba(244, 204, 245, 0.1) 0%, transparent 100%)' }}></div>

                <div className="relative z-10">
                  {/* Step number */}
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4 transition-all duration-500 group-hover:scale-110"
                    style={{ background: 'linear-gradient(135deg, #B89CFF 0%, #D8B4FE 100%)' }}>
                    <span className="text-white text-lg">{String(index + 1).padStart(2, '0')}</span>
                  </div>

                  {/* Title */}
                  <h2 className="text-3xl tracking-tight mb-4 text-purple-700 dark:text-purple-400">
                    {step.title}
                  </h2>

                  {/* Description */}
                  <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Back Button */}
          <div className="text-center">
            <a
              href="/"
              className="group inline-flex items-center justify-center px-10 py-5 rounded-full transition-all duration-500 hover:scale-105"
              style={{
                backgroundColor: '#F4CCF5',
                boxShadow: '0 8px 32px rgba(244, 204, 245, 0.3)'
              }}
            >
              <span className="text-black text-lg tracking-tight">Back to Home</span>
            </a>
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
    </div>
  );
}
