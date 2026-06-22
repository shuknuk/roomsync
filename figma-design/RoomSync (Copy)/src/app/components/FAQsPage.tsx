import { motion } from 'motion/react';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';

export function FAQsPage() {
  const navigate = useNavigate();
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
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #B89CFF 0%, transparent 70%)' }}></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #F4CCF5 0%, transparent 70%)' }}></div>

      <div className="relative z-10 py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Back Button */}
          <motion.button
            onClick={() => navigate('/')}
            className="group inline-flex items-center gap-2 mb-12 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-lg">Back to Home</span>
          </motion.button>

          {/* Header */}
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl tracking-tight text-neutral-900 dark:text-white mb-6">
              FAQs
            </h1>
            <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed">
              Got questions? We've got answers.
            </p>
          </motion.div>

          {/* FAQs List */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="group rounded-2xl overflow-hidden bg-white dark:bg-neutral-800"
                style={{
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.05,
                  ease: [0.22, 1, 0.36, 1]
                }}
                whileHover={{ boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)' }}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left transition-colors duration-300"
                >
                  <span className="text-lg md:text-xl text-neutral-900 dark:text-white pr-4">
                    {faq.question}
                  </span>
                  <motion.div
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#F4CCF5' }}
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {openIndex === index ? (
                      <Minus className="w-5 h-5 text-black" strokeWidth={2} />
                    ) : (
                      <Plus className="w-5 h-5 text-black" strokeWidth={2} />
                    )}
                  </motion.div>
                </button>

                <motion.div
                  initial={false}
                  animate={{
                    height: openIndex === index ? 'auto' : 0,
                    opacity: openIndex === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 text-neutral-600 dark:text-neutral-300 text-lg leading-relaxed">
                    {faq.answer}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Still have questions section */}
          <motion.div
            className="mt-20 text-center rounded-3xl p-12 md:p-16"
            style={{
              background: 'linear-gradient(135deg, #B89CFF 0%, #F4CCF5 100%)',
              boxShadow: '0 20px 60px rgba(184, 156, 255, 0.3)'
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-3xl md:text-4xl tracking-tight text-white mb-4">
              Still have questions?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join our waitlist and we'll keep you updated with all the latest information about Roomora.
            </p>
            <motion.a
              href="https://ramp-pine-94585756.figma.site"
              className="inline-flex items-center justify-center px-10 py-5 rounded-full text-black text-lg tracking-tight"
              style={{
                backgroundColor: 'rgb(255, 255, 255)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              Join the Waitlist
            </motion.a>
          </motion.div>

          {/* Back to Home Button */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.button
              onClick={() => navigate('/')}
              className="inline-block px-16 py-6 rounded-full text-black text-xl tracking-tight"
              style={{
                backgroundColor: '#F4CCF5',
                boxShadow: '0 8px 32px rgba(244, 204, 245, 0.3)'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              Back to Home
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
