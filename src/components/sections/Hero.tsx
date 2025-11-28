'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Shield, Zap, Lock, Sparkles, ChevronDown } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Hero Section - AWE-FACTOR Edition
 *
 * Features:
 * - Character-by-character text reveal
 * - 3D magnetic button effects
 * - Parallax floating elements
 * - Particle effects on interaction
 * - Advanced GSAP scroll animations
 * - Responsive design with premium feel
 */
export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse tracking for parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Parallax transforms
  const parallax1X = useTransform(smoothMouseX, [-500, 500], [-20, 20]);
  const parallax1Y = useTransform(smoothMouseY, [-500, 500], [-20, 20]);
  const parallax2X = useTransform(smoothMouseX, [-500, 500], [-40, 40]);
  const parallax2Y = useTransform(smoothMouseY, [-500, 500], [-40, 40]);

  useEffect(() => {
    setIsLoaded(true);

    // GSAP title animation
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 80, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.4,
          ease: 'power4.out',
          delay: 0.2,
        }
      );
    }

    // Parallax scroll effect
    if (heroRef.current) {
      gsap.to(heroRef.current.querySelectorAll('.parallax-element'), {
        y: (i) => (i + 1) * 50,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set(clientX - innerWidth / 2);
      mouseY.set(clientY - innerHeight / 2);
      setMousePosition({ x: clientX, y: clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      },
    },
  };

  const featureVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: i * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      },
    }),
  };

  const features = [
    {
      icon: Zap,
      text: 'Instant Notarization',
      subtext: 'Minutes, not months',
      color: 'from-yellow-400 to-orange-500',
      glow: 'rgba(251, 191, 36, 0.4)',
    },
    {
      icon: Shield,
      text: 'Blockchain Security',
      subtext: 'Immutable & tamper-proof',
      color: 'from-primary-400 to-primary-600',
      glow: 'rgba(161, 161, 170, 0.4)',
    },
    {
      icon: Lock,
      text: '95% Cost Savings',
      subtext: 'vs traditional filing',
      color: 'from-accent-400 to-accent-600',
      glow: 'rgba(113, 113, 122, 0.4)',
    },
  ];

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-16 overflow-hidden"
    >
      {/* Animated background particles */}
      <div className="particles-bg">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Floating gradient orbs with parallax */}
      <motion.div
        className="absolute top-1/4 -left-32 w-96 h-96 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-full blur-3xl parallax-element"
        style={{ x: parallax1X, y: parallax1Y }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-32 w-80 h-80 bg-gradient-to-l from-accent-500/20 to-primary-500/20 rounded-full blur-3xl parallax-element"
        style={{ x: parallax2X, y: parallax2Y }}
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.4, 0.3, 0.4],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? 'visible' : 'hidden'}
          className="space-y-10"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <motion.div
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-premium text-sm font-semibold text-primary-300 border border-primary-500/30 hover-glow"
              whileHover={{ scale: 1.05, borderColor: 'rgba(161, 161, 170, 0.5)' }}
              transition={{ duration: 0.2 }}
            >
              <Sparkles className="w-4 h-4 animate-pulse-glow" />
              <span>Powered by Hedera Hashgraph</span>
              <motion.div
                className="w-2 h-2 rounded-full bg-green-400"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>

          {/* Main Title */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h1
              ref={titleRef}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold tracking-tight leading-[1.05]"
            >
              <motion.span
                className="gradient-text block mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Vaultheir™
              </motion.span>
              <motion.span
                className="text-white block text-shimmer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                Revolutionary IP Management
              </motion.span>
            </h1>

            <motion.p
              className="text-xl sm:text-2xl md:text-3xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              Protect your intellectual property{' '}
              <span className="text-primary-400 font-semibold animate-pulse-glow">90% faster</span> and{' '}
              <span className="text-accent-400 font-semibold animate-pulse-glow">95% cheaper</span> with
              blockchain-powered notarization
            </motion.p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-5 justify-center items-center mt-8"
          >
            {/* Primary CTA - Magnetic Button */}
            <motion.a
              href="#demo"
              className="group relative px-10 py-5 bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500 rounded-xl font-bold text-white overflow-hidden glow-effect text-lg ripple magnetic-btn"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <span className="relative z-10 flex items-center gap-3">
                Try Free Demo
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.span>
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-accent-500 via-accent-600 to-primary-500"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              />
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  transform: 'translateX(-100%)',
                }}
                animate={{
                  transform: ['translateX(-100%)', 'translateX(100%)'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              />
            </motion.a>

            {/* Secondary CTA */}
            <motion.a
              href="#pricing"
              className="px-10 py-5 glass-premium rounded-xl font-semibold text-white border border-primary-500/50 hover:border-primary-400 transition-all duration-300 text-lg hover-glow"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              View Pricing
            </motion.a>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 max-w-5xl mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={featureVariants}
                initial="hidden"
                animate="visible"
                className="card-3d"
                whileHover={{ y: -12, scale: 1.03 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <div
                  className="card-3d-inner glass-premium p-8 rounded-2xl group cursor-pointer"
                  style={{
                    boxShadow: `0 0 0 rgba(161, 161, 170, 0), 0 20px 40px rgba(0,0,0,0.2)`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px ${feature.glow}, 0 20px 40px rgba(0,0,0,0.3)`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 rgba(161, 161, 170, 0), 0 20px 40px rgba(0,0,0,0.2)`;
                  }}
                >
                  <motion.div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-5 mx-auto shadow-lg`}
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="font-bold text-white mb-2 text-lg group-hover:text-primary-300 transition-colors">
                    {feature.text}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                    {feature.subtext}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <motion.div
            className="flex flex-col items-center gap-2 text-gray-500 cursor-pointer hover:text-gray-300 transition-colors"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            onClick={() => {
              document.getElementById('stats')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
