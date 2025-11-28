'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, CheckCircle, Award, Globe, Zap } from 'lucide-react';

const badges = [
  {
    icon: Shield,
    title: 'Secured by Hedera',
    description: 'Enterprise-grade DLT',
    color: 'from-purple-500 to-indigo-500',
  },
  {
    icon: Lock,
    title: '256-bit AES Encryption',
    description: 'Military-grade security',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: CheckCircle,
    title: 'SOC 2 Type II',
    description: 'Compliant infrastructure',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Award,
    title: 'GDPR Compliant',
    description: 'EU data protection',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: Globe,
    title: '99.99% Uptime',
    description: 'Enterprise SLA',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: Zap,
    title: '< 3s Finality',
    description: 'Instant confirmation',
    color: 'from-violet-500 to-purple-500',
  },
];

const partners = [
  { name: 'Hedera', logo: 'H' },
  { name: 'AWS', logo: 'AWS' },
  { name: 'Google Cloud', logo: 'GCP' },
  { name: 'MongoDB', logo: 'M' },
  { name: 'Cloudflare', logo: 'CF' },
];

export default function TrustBadges() {
  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 border-y border-white/10 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h3 className="text-lg font-semibold text-gray-400 mb-2">Enterprise-Grade Security</h3>
          <p className="text-sm text-gray-500">Trusted by leading companies worldwide</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass-effect rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all text-center group cursor-pointer"
            >
              <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r ${badge.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
                <badge.icon className="w-6 h-6 text-white" />
              </div>
              <div className="font-semibold text-white text-sm mb-1">{badge.title}</div>
              <div className="text-xs text-gray-500">{badge.description}</div>
            </motion.div>
          ))}
        </div>

        {/* Partner Logos */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-8 pt-8 border-t border-white/10"
        >
          <span className="text-sm text-gray-500">Powered by:</span>
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.1 }}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
            >
              <span className="font-bold text-gray-400 text-sm">{partner.logo}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
