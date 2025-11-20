'use client';

import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const stats = [
  { value: '95%', label: 'Cost Savings', sublabel: 'vs traditional filing' },
  { value: '90%', label: 'Faster', sublabel: 'than traditional methods' },
  { value: '$0.01', label: 'Per Transaction', sublabel: 'on Hedera Hashgraph' },
  { value: '100%', label: 'Immutable', sublabel: 'blockchain security' },
];

function CountUp({ end, duration = 2 }: { end: number; duration?: number }) {
  const [count, setCount] = React.useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  React.useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}</span>;
}

export default function Stats() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 border-y border-white/10 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1, type: 'spring' }}
              className="text-center group"
            >
              <div className="text-5xl md:text-6xl lg:text-7xl font-extrabold gradient-text mb-3 group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-lg md:text-xl font-bold text-white mb-2">{stat.label}</div>
              <div className="text-sm text-gray-400 leading-relaxed">{stat.sublabel}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

