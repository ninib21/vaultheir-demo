'use client';

import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const stats = [
  { value: '$2.3M', numValue: 2.3, prefix: '$', suffix: 'M', label: 'Assets Protected', sublabel: 'Total value secured on-chain' },
  { value: '12,847', numValue: 12847, prefix: '', suffix: '', label: 'IP Assets', sublabel: 'Notarized on blockchain' },
  { value: '95%', numValue: 95, prefix: '', suffix: '%', label: 'Cost Savings', sublabel: 'vs traditional filing' },
  { value: '< 3s', numValue: 3, prefix: '< ', suffix: 's', label: 'Notarization Time', sublabel: 'Instant blockchain proof' },
];

function CountUp({ end, prefix = '', suffix = '', duration = 2, decimals = 0 }: { end: number; prefix?: string; suffix?: string; duration?: number; decimals?: number }) {
  const [count, setCount] = React.useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  React.useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      // Easing function for smoother animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(easeOut * end);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  const displayValue = decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString();

  return <span ref={ref}>{prefix}{displayValue}{suffix}</span>;
}

export default function Stats() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 border-y border-white/10 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Platform Statistics</h2>
          <p className="text-gray-400">Real-time metrics from the Vaultheir™ network</p>
        </motion.div>

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
              <div className="text-4xl md:text-5xl lg:text-6xl font-extrabold gradient-text mb-3 group-hover:scale-110 transition-transform duration-300">
                <CountUp
                  end={stat.numValue}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  decimals={stat.prefix === '$' ? 1 : 0}
                />
              </div>
              <div className="text-lg md:text-xl font-bold text-white mb-2">{stat.label}</div>
              <div className="text-sm text-gray-400 leading-relaxed">{stat.sublabel}</div>
            </motion.div>
          ))}
        </div>

        {/* Live indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center justify-center gap-2 mt-10"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-sm text-gray-400">Live on Hedera Mainnet</span>
        </motion.div>
      </div>
    </section>
  );
}

