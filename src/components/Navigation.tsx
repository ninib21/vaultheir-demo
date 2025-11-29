'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Shield } from 'lucide-react';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Home', href: '/', homepageOnly: false },
  { name: 'Features', href: '#features', homepageOnly: true },
  { name: 'Demo', href: '#demo', homepageOnly: true },
  { name: 'Pricing', href: '#pricing', homepageOnly: true },
  { name: 'Dashboard', href: '/dashboard', homepageOnly: false },
  { name: 'Investors', href: '/investors', homepageOnly: false },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper function to get the correct href
  const getHref = (item: typeof navItems[0]) => {
    if (item.homepageOnly && !isHomePage) {
      // If we're not on homepage and this is a homepage-only link, go to homepage with anchor
      return `/${item.href}`;
    }
    return item.href;
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'glass-effect-strong border-b border-white/20 shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.a 
            href="/" 
            className="flex items-center gap-3 group"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative">
              <Shield className="w-9 h-9 text-primary-400 group-hover:text-primary-300 transition-colors" />
              <div className="absolute inset-0 bg-primary-400/20 rounded-full blur-xl group-hover:bg-primary-400/30 transition-colors" />
            </div>
            <span className="text-2xl font-extrabold gradient-text">Vaultheir™</span>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <motion.a
                key={item.name}
                href={getHref(item)}
                className="text-gray-300 hover:text-white transition-colors font-semibold text-sm relative group"
                whileHover={{ y: -2 }}
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-400 to-accent-400 group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
            <motion.a
              href={isHomePage ? '#demo' : '/#demo'}
              className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg font-bold text-white hover:opacity-90 transition-all shadow-lg shadow-primary-500/30"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Demo
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-effect border-t border-white/10"
          >
            <div className="px-4 py-4 space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={getHref(item)}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-gray-300 hover:text-white transition-colors font-medium"
                >
                  {item.name}
                </a>
              ))}
              <a
                href={isHomePage ? '#demo' : '/#demo'}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-center px-6 py-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg font-semibold text-white"
              >
                Try Demo
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

