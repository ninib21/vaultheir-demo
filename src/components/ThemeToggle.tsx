'use client';

import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './providers/ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  // Render a placeholder with same dimensions to prevent layout shift
  if (!mounted) {
    return (
      <div className="w-14 h-7 rounded-full bg-white/10 border border-white/20" />
    );
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full bg-white/10 border border-white/20 flex items-center p-1 cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <motion.div
        className="w-5 h-5 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center shadow-lg"
        animate={{ x: theme === 'dark' ? 0 : 26 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {theme === 'dark' ? (
          <Moon className="w-3 h-3 text-white" />
        ) : (
          <Sun className="w-3 h-3 text-white" />
        )}
      </motion.div>

      {/* Background icons */}
      <div className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none">
        <Moon className={`w-3 h-3 transition-opacity ${theme === 'dark' ? 'opacity-0' : 'opacity-30'}`} />
        <Sun className={`w-3 h-3 transition-opacity ${theme === 'dark' ? 'opacity-30' : 'opacity-0'}`} />
      </div>
    </motion.button>
  );
}
