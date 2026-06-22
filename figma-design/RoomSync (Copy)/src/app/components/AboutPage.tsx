import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

export function AboutPage() {
  const navigate = useNavigate();

  const team = [
    {
      name: 'Aditya Bhambhani',
      role: 'Co-Founder & Product Designer',
      description: 'Focused on designing and building intuitive, user-friendly digital experiences across the platform.'
    },
    {
      name: 'Shriya Sharma',
      role: 'Co-Founder & UI/UX Designer',
      description: 'Focused on creating intuitive user experiences and seamless interactions across the platform.'
    },
    {
      name: 'Kinshuk Goel',
      role: 'Co-Founder & Backend Developer',
      description: 'Focused on building and maintaining the platform\'s core functionality, infrastructure, and backend systems.'
    },
    {
      name: 'Mahek Sharma',
      role: 'Co-Founder & User Research',
      description: 'Focused on user research, community outreach, and gathering student feedback to shape the platform.'
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden transition-colors duration-300 bg-white dark:bg-neutral-900">
      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #B89CFF 0%, transparent 70%)' }}></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #F4CCF5 0%, transparent 70%)' }}></div>

      <div className="relative z-10 py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
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
            className="mb-12"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-5xl md:text-6xl tracking-tight text-neutral-900 dark:text-white mb-8">
              About
            </h1>

            {/* Main content */}
            <motion.div
              className="space-y-6 text-neutral-700 dark:text-neutral-300 leading-relaxed text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Roommate searching in college has become chaotic.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Students jump between Instagram stories, GroupMe chats, spreadsheets, Reddit posts, Snapchat, Facebook Marketplace, and random forms just to find someone they might be living with for an entire year. Most platforms either feel outdated, impersonal, or rushed.
              </motion.p>

              <motion.p
                className="text-purple-700"
                style={{ color: '#9333EA' }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                That's why we built Roomora.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-neutral-700 dark:text-neutral-300"
              >
                We're a team of four Rutgers students who experienced firsthand how stressful and disconnected the roommate search process can be. We wanted to create something that feels more natural, social, and student-focused — a platform where finding a roommate is based on compatibility, lifestyle, habits, and genuine connection rather than luck.
              </motion.p>

              <motion.p
                className="text-purple-700"
                style={{ color: '#9333EA' }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                Our goal is simple: <br />
                make roommate matching easier, safer, and more personal for students.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-neutral-700 dark:text-neutral-300"
              >
                Instead of endlessly messaging strangers across different apps, Roomora brings everything into one experience designed specifically for college students navigating housing decisions.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="text-neutral-700 dark:text-neutral-300"
              >
                We're currently building and improving the platform with student feedback as we grow our community and waitlist ahead of launch.
              </motion.p>

              <motion.p
                className="text-purple-700"
                style={{ color: '#9333EA' }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                Built by students, for students.
              </motion.p>
            </motion.div>
          </motion.div>

          {/* Mission Card */}
          <motion.div
            className="my-20 rounded-3xl p-12 md:p-16 text-center overflow-hidden relative"
            style={{
              background: 'linear-gradient(135deg, #B89CFF 0%, #F4CCF5 100%)',
              boxShadow: '0 20px 60px rgba(184, 156, 255, 0.3)'
            }}
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Floating orb animation */}
            <motion.div
              className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 blur-3xl"
              style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)' }}
              animate={{
                x: [0, 30, 0],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-20 blur-3xl"
              style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)' }}
              animate={{
                x: [0, -20, 0],
                y: [0, 30, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            <div className="relative z-10">
              <motion.h2
                className="text-4xl md:text-5xl tracking-tight text-white mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
              >
                Our Mission
              </motion.h2>
              <motion.p
                className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.6 }}
              >
                Roomora was created to solve the chaos of college roommate hunting. We're tired of endless Facebook posts,
                crowded GroupMe chats, and mismatched living situations. Our mission is to make finding compatible roommates
                simple, safe, and stress-free for every college student.
              </motion.p>
            </div>
          </motion.div>

          {/* Meet the Team Section */}
          <motion.div
            className="mt-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h2 className="text-4xl md:text-5xl tracking-tight text-neutral-900 dark:text-white mb-12">
              Meet the Team
            </h2>

            <div className="space-y-10">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  className="group"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.4 + index * 0.1,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                >
                  <h3 className="text-2xl text-neutral-900 dark:text-white mb-2">
                    {member.name}
                  </h3>
                  <p className="text-neutral-700 dark:text-neutral-300 mb-3">
                    {member.role}
                  </p>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {member.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Back to Home Button */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
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
