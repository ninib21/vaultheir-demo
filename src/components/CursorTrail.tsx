'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Trail {
  id: number;
  x: number;
  y: number;
}

export default function CursorTrail() {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let trailId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const newTrail: Trail = {
        id: trailId++,
        x: e.clientX,
        y: e.clientY,
      };

      setTrails(prev => [...prev.slice(-12), newTrail]);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  // Clean up old trails
  useEffect(() => {
    const cleanup = setInterval(() => {
      setTrails(prev => prev.slice(-8));
    }, 50);

    return () => clearInterval(cleanup);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <AnimatePresence>
        {trails.map((trail, index) => (
          <motion.div
            key={trail.id}
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 0, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
            style={{
              left: trail.x - 4,
              top: trail.y - 4,
              width: 8 + (index * 0.5),
              height: 8 + (index * 0.5),
              filter: 'blur(1px)',
            }}
          />
        ))}
      </AnimatePresence>

      {/* Main cursor glow */}
      {trails.length > 0 && (
        <motion.div
          className="absolute w-6 h-6 rounded-full pointer-events-none"
          style={{
            left: trails[trails.length - 1]?.x - 12,
            top: trails[trails.length - 1]?.y - 12,
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
        />
      )}
    </div>
  );
}
