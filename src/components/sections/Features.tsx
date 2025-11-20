'use client';

import { motion } from 'framer-motion';
import {
  Shield,
  Zap,
  Lock,
  TrendingUp,
  Globe,
  Brain,
  Code,
  Database,
  Sparkles,
  Users,
  BarChart3,
  CheckCircle,
} from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Blockchain Notarization',
    description: 'Immutable, tamper-proof IP records on Hedera Hashgraph',
    color: 'from-primary-500 to-primary-600',
  },
  {
    icon: Zap,
    title: 'Instant Protection',
    description: 'From idea to notarized IP in minutes, not months',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Lock,
    title: 'Enterprise Security',
    description: 'Zero-trust architecture with military-grade encryption',
    color: 'from-red-500 to-pink-500',
  },
  {
    icon: TrendingUp,
    title: 'AI-Powered Valuation',
    description: 'Advanced algorithms estimate your IP worth',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Globe,
    title: 'Global Recognition',
    description: 'Blockchain verification accepted worldwide',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Brain,
    title: 'Smart Contracts',
    description: 'Automated IP management and licensing',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Code,
    title: 'Developer API',
    description: 'Full REST API for custom integrations',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    icon: Database,
    title: 'Portfolio Management',
    description: 'Centralized dashboard for all your IP assets',
    color: 'from-teal-500 to-cyan-500',
  },
  {
    icon: Sparkles,
    title: 'Custom Templates',
    description: 'Industry-specific IP documentation templates',
    color: 'from-rose-500 to-pink-500',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Multi-user access with role-based permissions',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Real-time insights into your IP portfolio',
    color: 'from-amber-500 to-yellow-500',
  },
  {
    icon: CheckCircle,
    title: 'Compliance Ready',
    description: 'SOC 2, ISO 27001, GDPR compliant',
    color: 'from-emerald-500 to-green-500',
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">Powerful Features</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Everything you need to protect, manage, and monetize your intellectual property
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.05, type: 'spring' }}
              className="group glass-effect-strong rounded-2xl p-8 hover:border-primary-500/50 transition-all cursor-pointer hover-lift"
              whileHover={{ y: -8, scale: 1.03 }}
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-300 transition-colors">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

