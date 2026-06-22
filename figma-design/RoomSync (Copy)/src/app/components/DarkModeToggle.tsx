import { Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check localStorage on mount
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = 'rgb(23, 23, 23)';
    } else {
      document.body.style.backgroundColor = 'rgb(255, 255, 255)';
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);

    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
      document.body.style.backgroundColor = 'rgb(23, 23, 23)';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
      document.body.style.backgroundColor = 'rgb(255, 255, 255)';
    }
  };

  return (
    <motion.button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/20"
      aria-label="Toggle dark mode"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {isDark ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </motion.button>
  );
}
