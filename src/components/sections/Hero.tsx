'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Shield, Zap, Lock } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
        }
      );
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-16"
    >
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-10"
        >
          <motion.div variants={itemVariants} className="space-y-6">
            <motion.div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-effect-strong text-sm font-semibold text-primary-300 border border-primary-500/30"
              whileHover={{ scale: 1.05, borderColor: 'rgba(161, 161, 170, 0.5)' }}
              transition={{ duration: 0.2 }}
            >
              <Shield className="w-4 h-4" />
              Powered by Hedera Hashgraph
            </motion.div>
            
            <h1
              ref={titleRef}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold tracking-tight leading-[1.1]"
            >
              <span className="gradient-text block mb-2">Vaultheir™</span>
              <span className="text-white block">Revolutionary IP Management</span>
            </h1>
            
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
              Protect your intellectual property{' '}
              <span className="text-primary-400 font-semibold">90% faster</span> and{' '}
              <span className="text-accent-400 font-semibold">95% cheaper</span> with
              blockchain-powered notarization
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-5 justify-center items-center mt-8"
          >
            <motion.a
              href="#demo"
              className="group relative px-10 py-5 bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500 rounded-xl font-bold text-white overflow-hidden glow-effect text-lg"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <span className="relative z-10 flex items-center gap-3">
                Try Free Demo
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-accent-500 via-accent-600 to-primary-500"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              />
            </motion.a>
            
            <motion.a
              href="#pricing"
              className="px-10 py-5 glass-effect-strong rounded-xl font-semibold text-white border border-primary-500/50 hover:border-primary-400 hover:bg-white/[0.05] transition-all duration-300 text-lg"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              View Pricing
            </motion.a>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 max-w-5xl mx-auto"
          >
            {[
              { icon: Zap, text: 'Instant Notarization', subtext: 'Minutes, not months', color: 'from-yellow-400 to-orange-500' },
              { icon: Shield, text: 'Blockchain Security', subtext: 'Immutable & tamper-proof', color: 'from-primary-400 to-primary-600' },
              { icon: Lock, text: '95% Cost Savings', subtext: 'vs traditional filing', color: 'from-accent-400 to-accent-600' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="glass-effect-strong p-8 rounded-2xl hover-lift group"
                whileHover={{ y: -8, scale: 1.03 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-white mb-2 text-lg">{feature.text}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.subtext}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

