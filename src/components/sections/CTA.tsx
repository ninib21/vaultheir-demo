'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CTA() {
  return (
    <section className="relative py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative glass-effect-strong rounded-3xl p-12 md:p-16 text-center overflow-hidden border-2 border-primary-500/40 shadow-2xl shadow-primary-500/20"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-accent-500/10 to-primary-500/10 opacity-60" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(161,161,170,0.1),transparent_70%)]" />
          <div className="relative z-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="inline-block mb-8"
            >
              <Sparkles className="w-16 h-16 text-primary-400 drop-shadow-lg" />
            </motion.div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6">
              <span className="gradient-text">Ready to Get Started?</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
              Join thousands of innovators protecting their IP with Vaultheir™. Start your 14-day free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center mb-8">
              <motion.a
                href="#demo"
                className="group px-10 py-5 bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500 rounded-xl font-bold text-white inline-flex items-center justify-center gap-3 glow-effect text-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                Start Free Trial
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.a>
              <motion.a
                href="#pricing"
                className="px-10 py-5 glass-effect-strong border border-primary-500/50 rounded-xl font-semibold text-white hover:border-primary-400 hover:bg-white/[0.05] transition-all duration-300 text-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                View Pricing
              </motion.a>
            </div>
            <p className="text-sm md:text-base text-gray-400 font-medium">
              No credit card required • Cancel anytime • 14-day free trial
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

