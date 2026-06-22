import { Home, Menu } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { DarkModeToggle } from './DarkModeToggle';
import { CircleExpand } from './CircleExpand';

export function Header() {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionOrigin, setTransitionOrigin] = useState({ x: 0, y: 0 });
  const logoRef = useRef<HTMLAnchorElement>(null);

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (window.location.pathname === '/') return;

    const rect = logoRef.current?.getBoundingClientRect();
    if (rect) {
      setTransitionOrigin({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
      setIsTransitioning(true);

      setTimeout(() => {
        navigate('/');
        setTimeout(() => {
          setIsTransitioning(false);
        }, 100);
      }, 600);
    }
  };

  return (
    <>
      <CircleExpand
        isActive={isTransitioning}
        origin={transitionOrigin}
      />

      <motion.header
        className="sticky top-0 z-50 backdrop-blur-xl"
        style={{
          backgroundColor: 'rgba(68, 49, 67, 0.7)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-20">
            {/* Logo - With expand animation */}
            <motion.a
              ref={logoRef}
              href="/"
              onClick={handleLogoClick}
              className="flex items-center gap-3 group relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-11 h-11 rounded-2xl flex items-center justify-center overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #B388FF, #D8B4FE)' }}
                whileHover={{
                  boxShadow: '0 8px 32px rgba(184, 156, 255, 0.4)',
                }}
                transition={{ duration: 0.3 }}
              >
                <Home className="w-6 h-6 text-white" strokeWidth={2} />

                {/* Ripple effect on click */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)' }}
                  initial={{ scale: 0, opacity: 0 }}
                  whileTap={{ scale: 2, opacity: [0, 0.5, 0] }}
                  transition={{ duration: 0.6 }}
                />
              </motion.div>

              <span className="text-xl tracking-tight">
                <span style={{ color: '#D8B4FE' }}>Room</span>
                <span className="text-white">ora</span>
              </span>
            </motion.a>

            {/* Navigation - With stagger animation */}
            <nav className="hidden md:flex items-center gap-10">
              {[
                { label: 'Home', href: '/' },
                { label: 'How it Works', href: '/how-it-works' },
                { label: 'About', href: '/about' },
                { label: 'FAQs', href: '/faqs' }
              ].map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  className="relative text-white/70 hover:text-white transition-colors duration-300 text-[15px]"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  {item.label}
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: 'linear-gradient(135deg, #B89CFF 0%, #F4CCF5 100%)' }}
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              ))}
            </nav>

            {/* Actions - Refined */}
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <DarkModeToggle />
              <button className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors duration-300">
                <Menu className="w-6 h-6 text-white" />
              </button>
            </motion.div>
          </div>
        </div>
      </motion.header>
    </>
  );
}
