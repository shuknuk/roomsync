import { Home, Menu, Sun, Moon, User, X } from 'lucide-react';
import { useState } from 'react';

// ponytail: Simplified by using simple React state, native CSS transitions, and local dark mode callbacks instead of importing framer-motion and react-router.
interface HeaderProps {
  activeView: string;
  onNavigate: (view: any) => void;
  onStart: () => void;
  authenticated: boolean;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
}

export function Header({
  activeView,
  onNavigate,
  onStart,
  authenticated,
  isDarkMode,
  setIsDarkMode,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { label: 'Home', view: 'home' },
    { label: 'How it Works', view: 'how-it-works' },
    { label: 'About', view: 'about' },
    { label: 'FAQs', view: 'faqs' }
  ];

  return (
    <header 
      className="sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-300"
      style={{
        backgroundColor: isDarkMode ? 'rgba(68, 49, 67, 0.7)' : 'rgba(255, 255, 255, 0.8)',
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'
      }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 group relative text-left transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            <div 
              className="w-11 h-11 rounded-2xl flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:shadow-[0_8px_32px_rgba(184,156,255,0.4)]"
              style={{ background: 'linear-gradient(135deg, #B388FF, #D8B4FE)' }}
            >
              <Home className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <span className="text-xl tracking-tight font-semibold">
              <span style={{ color: '#D8B4FE' }}>Room</span>
              <span className={isDarkMode ? "text-white" : "text-neutral-900"}>ora</span>
            </span>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-10">
            {menuItems.map((item) => (
              <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                className={`relative text-[15px] font-medium transition-all duration-300 hover:-translate-y-[2px] ${
                  activeView === item.view 
                    ? (isDarkMode ? 'text-white font-semibold' : 'text-neutral-900 font-semibold')
                    : (isDarkMode ? 'text-white/70 hover:text-white' : 'text-neutral-600 hover:text-neutral-900')
                }`}
              >
                {item.label}
                <div 
                  className={`absolute -bottom-1 left-0 right-0 h-0.5 rounded-full transition-transform duration-300 origin-center ${
                    activeView === item.view ? 'scale-x-100' : 'scale-x-0'
                  }`}
                  style={{ background: 'linear-gradient(135deg, #B89CFF 0%, #F4CCF5 100%)' }}
                />
              </button>
            ))}
          </nav>

          {/* Action buttons */}
          <div className="flex items-center gap-4">
            {/* Dark Mode toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 border ${
                isDarkMode 
                  ? 'bg-white/10 text-white hover:bg-white/20 border-white/20' 
                  : 'bg-black/5 text-neutral-800 hover:bg-black/10 border-black/10'
              }`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Enter/Sign in Button */}
            <button
              onClick={onStart}
              className={`hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-all duration-200 hover:scale-105 active:scale-95 ${
                isDarkMode 
                  ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20' 
                  : 'bg-black/5 text-neutral-800 hover:bg-black/10 border border-black/10'
              }`}
            >
              <User className="w-4 h-4" />
              <span>{authenticated ? 'Enter App' : 'Sign In'}</span>
            </button>

            {/* Mobile Menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-neutral-900'}`} />
              ) : (
                <Menu className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-neutral-900'}`} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div 
          className={`absolute top-20 left-0 right-0 z-40 border-b px-6 py-6 space-y-4 flex flex-col md:hidden shadow-xl backdrop-blur-lg transition-all duration-300 animate-fade-in ${
            isDarkMode 
              ? 'bg-[#443143]/95 border-white/10 text-white/90' 
              : 'bg-white/95 border-black/10 text-neutral-800'
          }`}
        >
          {menuItems.map((item) => (
            <button
              key={item.view}
              onClick={() => {
                onNavigate(item.view);
                setMobileMenuOpen(false);
              }}
              className={`text-left py-2 font-medium border-b border-black/5 dark:border-white/5 transition-colors ${
                activeView === item.view ? 'text-purple-400 font-semibold' : ''
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => {
              onStart();
              setMobileMenuOpen(false);
            }}
            className="flex items-center justify-between py-2 font-semibold pt-4"
          >
            <span>{authenticated ? 'Enter App' : 'Sign In'}</span>
            <User className="w-5 h-5" />
          </button>
        </div>
      )}
    </header>
  );
}
