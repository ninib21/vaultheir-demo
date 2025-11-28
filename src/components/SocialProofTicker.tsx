'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CheckCircle, X } from 'lucide-react';

const notifications = [
  { name: 'Sarah', location: 'New York', action: 'protected a patent', time: '2 min ago' },
  { name: 'James', location: 'London', action: 'notarized 3 documents', time: '5 min ago' },
  { name: 'Maria', location: 'Tokyo', action: 'secured trade secrets', time: '8 min ago' },
  { name: 'David', location: 'Berlin', action: 'protected a trademark', time: '12 min ago' },
  { name: 'Emma', location: 'Sydney', action: 'notarized legal documents', time: '15 min ago' },
  { name: 'Michael', location: 'Toronto', action: 'protected copyrights', time: '18 min ago' },
  { name: 'Lisa', location: 'Singapore', action: 'secured IP portfolio', time: '22 min ago' },
  { name: 'Alex', location: 'Dubai', action: 'notarized contracts', time: '25 min ago' },
];

export default function SocialProofTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Initial delay before showing first notification
    const initialDelay = setTimeout(() => {
      if (!isDismissed) setIsVisible(true);
    }, 5000);

    return () => clearTimeout(initialDelay);
  }, [isDismissed]);

  useEffect(() => {
    if (!isVisible || isDismissed) return;

    // Hide after 4 seconds
    const hideTimeout = setTimeout(() => {
      setIsVisible(false);
    }, 4000);

    // Show next notification after 8 seconds
    const nextTimeout = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % notifications.length);
      setIsVisible(true);
    }, 8000);

    return () => {
      clearTimeout(hideTimeout);
      clearTimeout(nextTimeout);
    };
  }, [isVisible, currentIndex, isDismissed]);

  const notification = notifications[currentIndex];

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -100, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-8 left-8 z-50 max-w-sm"
        >
          <div className="glass-effect-strong rounded-xl p-4 border border-white/20 shadow-xl flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white">
                <span className="font-semibold">{notification.name}</span> from{' '}
                <span className="text-gray-300">{notification.location}</span>
              </p>
              <p className="text-sm text-gray-400">{notification.action}</p>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                {notification.time}
              </p>
            </div>
            <button
              onClick={() => setIsDismissed(true)}
              className="text-gray-500 hover:text-white transition-colors p-1"
              aria-label="Dismiss notifications"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
