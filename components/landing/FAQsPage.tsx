import { ArrowLeft, Plus, Minus } from 'lucide-react';
import { useState } from 'react';

// ponytail: Optimized the height-expansion animation of the accordion by using native CSS Grid transition (grid-rows-[0fr] -> grid-rows-[1fr]) instead of JS animations or framer-motion library.
interface FAQsPageProps {
  onNavigate: (view: any) => void;
}

export function FAQsPage({ onNavigate }: FAQsPageProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Is Roomora free to use?',
      answer: 'Yes, Roomora is free to download and free to message.'
    },
    {
      question: 'Who is Roomora for?',
      answer: 'Roomora is built specifically for college students. It launches at Rutgers University and will expand to Big Ten schools and beyond.'
    },
    {
      question: 'How does the matching algorithm work?',
      answer: 'After you complete a compatibility quiz covering sleep schedule, cleanliness, study habits, and budget, our algorithm matches you with students whose preferences align with yours. You can also apply filters like price range, distance from campus, and housing type.'
    },
    {
      question: 'How do I know profiles are real?',
      answer: 'All users verify their identity using a university email address. Profile verification ensures you\'re only connecting with real students at your school.'
    },
    {
      question: 'Can I message someone before we officially match?',
      answer: 'Messaging is unlocked once you mutually match–meaning you both swiped right on each other. From there, messaging is completely free with no paywall.'
    },
    {
      question: 'What happens to my profile once I find my roommate?',
      answer: 'Once you and your roommate confirm each other on the app, both profiles will be removed from the search pool. Your account does stay active in case you need to find roommates in future.'
    },
    {
      question: 'How many swipes do I get on the free plan?',
      answer: 'Users have a daily swipe limit of 30 swipes resetting every 12 hours.'
    },
    {
      question: 'Can I search for a group room situation?',
      answer: 'Yes! Roomora supports group searches for 2–5 people looking for one more roommate, not just one-on-one matching.'
    },
    {
      question: 'What if my match isn\'t a perfect fit for every preference?',
      answer: 'Our algorithm gets as close as possible, but a perfect match isn\'t always available. That\'s what the in-app messaging is for — you can talk through expectations on budget, schedules, and house rules before committing to anything.'
    },
    {
      question: 'How do I get help if something goes wrong?',
      answer: 'Roomora has a "Help" section in the app where you can chat with our support team. You can also mail support@roomora.com.'
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="relative min-h-screen overflow-hidden transition-colors duration-300 bg-white dark:bg-neutral-900">
      {/* Gradient orbs */}
      <div 
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #B89CFF 0%, transparent 70%)' }}
      />
      <div 
        className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #F4CCF5 0%, transparent 70%)' }}
      />

      <div className="relative z-10 py-16 md:py-24 animate-fade-up">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Back Button */}
          <button
            onClick={() => onNavigate('home')}
            className="group inline-flex items-center gap-2 mb-12 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all duration-300 hover:-translate-x-1"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-lg font-medium">Back to Home</span>
          </button>

          {/* Header */}
          <div className="mb-16 text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl tracking-tight text-neutral-900 dark:text-white mb-6 font-bold">
              FAQs
            </h1>
            <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed font-medium">
              Got questions? We've got answers.
            </p>
          </div>

          {/* FAQs List */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="group rounded-2xl overflow-hidden bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/50 shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left transition-colors duration-300"
                >
                  <span className="text-lg md:text-xl text-neutral-900 dark:text-white pr-4 font-bold">
                    {faq.question}
                  </span>
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{ 
                      backgroundColor: '#F4CCF5',
                      transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                  >
                    {openIndex === index ? (
                      <Minus className="w-5 h-5 text-black" strokeWidth={2} />
                    ) : (
                      <Plus className="w-5 h-5 text-black" strokeWidth={2} />
                    )}
                  </div>
                </button>

                {/* Collapsible content area - Uses the native CSS grid-rows trick */}
                <div 
                  className={`grid transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    openIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 text-neutral-600 dark:text-neutral-300 text-lg leading-relaxed font-medium">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Back Button */}
          <div className="mt-16 text-center">
            <button
              onClick={() => onNavigate('home')}
              className="inline-block px-16 py-6 rounded-full text-black text-xl font-bold tracking-tight transition-all duration-300 hover:scale-105 active:scale-95 shadow-md"
              style={{
                backgroundColor: '#F4CCF5',
                boxShadow: '0 8px 32px rgba(244, 204, 245, 0.3)'
              }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
