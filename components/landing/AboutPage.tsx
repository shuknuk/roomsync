import { ArrowLeft } from 'lucide-react';

// ponytail: Simplified by replacing motion components with native HTML tags, standard transition classes, and our global animate-fade-up class for high-performance visual fade-ins without package dependencies.
interface AboutPageProps {
  onNavigate: (view: any) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
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
      <div 
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #B89CFF 0%, transparent 70%)' }}
      />
      <div 
        className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #F4CCF5 0%, transparent 70%)' }}
      />

      <div className="relative z-10 py-16 md:py-24 animate-fade-up">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Back Button */}
          <button
            onClick={() => onNavigate('home')}
            className="group inline-flex items-center gap-2 mb-12 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all duration-300 hover:-translate-x-1"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-lg font-medium">Back to Home</span>
          </button>

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl tracking-tight text-neutral-900 dark:text-white mb-8 font-bold">
              About
            </h1>

            {/* Main content */}
            <div className="space-y-6 text-neutral-700 dark:text-neutral-300 leading-relaxed text-lg font-medium">
              <p>
                Roommate searching in college has become chaotic.
              </p>

              <p>
                Students jump between Instagram stories, GroupMe chats, spreadsheets, Reddit posts, Snapchat, Facebook Marketplace, and random forms just to find someone they might be living with for an entire year. Most platforms either feel outdated, impersonal, or rushed.
              </p>

              <p className="text-purple-600 dark:text-purple-400 font-semibold" style={{ color: '#9333EA' }}>
                That's why we built Roomora.
              </p>

              <p>
                We're a team of four Rutgers students who experienced firsthand how stressful and disconnected the roommate search process can be. We wanted to create something that feels more natural, social, and student-focused — a platform where finding a roommate is based on compatibility, lifestyle, habits, and genuine connection rather than luck.
              </p>

              <p className="text-purple-600 dark:text-purple-400 font-semibold" style={{ color: '#9333EA' }}>
                Our goal is simple: <br />
                make roommate matching easier, safer, and more personal for students.
              </p>

              <p>
                Instead of endlessly messaging strangers across different apps, Roomora brings everything into one experience designed specifically for college students navigating housing decisions.
              </p>

              <p>
                We're currently building and improving the platform with student feedback as we grow our community and waitlist ahead of launch.
              </p>

              <p className="text-purple-600 dark:text-purple-400 font-bold" style={{ color: '#9333EA' }}>
                Built by students, for students.
              </p>
            </div>
          </div>

          {/* Mission Card */}
          <div
            className="my-20 rounded-3xl p-12 md:p-16 text-center overflow-hidden relative group hover:scale-[1.01] transition-transform duration-500"
            style={{
              background: 'linear-gradient(135deg, #B89CFF 0%, #F4CCF5 100%)',
              boxShadow: '0 20px 60px rgba(184, 156, 255, 0.2)'
            }}
          >
            {/* Background orbs inside card */}
            <div 
              className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none animate-float-1"
              style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)' }}
            />
            <div 
              className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-20 blur-3xl pointer-events-none animate-float-2"
              style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)' }}
            />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl tracking-tight text-white mb-6 font-bold">
                Our Mission
              </h2>
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-4xl mx-auto font-medium">
                Roomora was created to solve the chaos of college roommate hunting. We're tired of endless Facebook posts,
                crowded GroupMe chats, and mismatched living situations. Our mission is to make finding compatible roommates
                simple, safe, and stress-free for every college student.
              </p>
            </div>
          </div>

          {/* Meet the Team Section */}
          <div className="mt-20">
            <h2 className="text-4xl md:text-5xl tracking-tight text-neutral-900 dark:text-white mb-12 font-bold">
              Meet the Team
            </h2>

            <div className="space-y-10">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="group p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-black/5 dark:border-white/5 transition-all duration-300 hover:scale-[1.01]"
                >
                  <h3 className="text-2xl text-neutral-900 dark:text-white mb-2 font-bold">
                    {member.name}
                  </h3>
                  <p className="text-purple-600 dark:text-purple-400 font-semibold mb-3">
                    {member.role}
                  </p>
                  <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed font-medium">
                    {member.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Back to Home Button */}
          <div className="mt-20 text-center">
            <button
              onClick={() => onNavigate('home')}
              className="inline-block px-16 py-6 rounded-full text-black text-xl font-bold tracking-tight transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
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
