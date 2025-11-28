'use client';

import dynamic from 'next/dynamic';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Navigation from '@/components/Navigation';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  Users,
  Shield,
  Target,
  Rocket,
  CheckCircle,
  BarChart3,
  Globe,
  Award,
  Download
} from 'lucide-react';
import { downloadInvestorPitchDeck } from '@/lib/utils/download';

// Same background as homepage
const Background3D = dynamic(() => import('@/components/Background3D'), {
  ssr: false,
  loading: () => null,
});

export default function InvestorsPage() {
  return (
    <ErrorBoundary>
      <main className="relative min-h-screen overflow-hidden">
        <Navigation />
        <Background3D />

        <div className="relative z-10">
          {/* Hero Section */}
          <section className="pt-32 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-20"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block px-6 py-2 rounded-full glass-effect border border-primary-500/30 mb-6"
                >
                  <span className="text-primary-400 font-semibold">Investment Opportunity</span>
                </motion.div>

                <h1 className="text-5xl md:text-7xl font-black mb-6">
                  <span className="gradient-text">Invest in the Future</span>
                  <br />
                  <span className="text-white">of Digital Legacy</span>
                </h1>

                <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  Join us in revolutionizing how families protect and transfer their digital assets
                  across generations. VaultHeir™ is positioned at the intersection of fintech,
                  security, and estate planning.
                </p>
              </motion.div>

              {/* Key Metrics */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20"
              >
                {[
                  { icon: TrendingUp, label: 'Market Growth', value: '45% CAGR', color: 'primary' },
                  { icon: DollarSign, label: 'TAM', value: '$14.1T', color: 'accent' },
                  { icon: Users, label: 'Target Users', value: '100M+', color: 'primary' },
                  { icon: Rocket, label: 'Launch Status', value: 'Ready', color: 'accent' },
                ].map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="glass-effect p-6 rounded-2xl border border-white/10 hover:border-primary-500/50 transition-all group"
                  >
                    <metric.icon className={`w-8 h-8 text-${metric.color}-400 mb-3 group-hover:scale-110 transition-transform`} />
                    <div className="text-3xl font-bold gradient-text mb-1">{metric.value}</div>
                    <div className="text-gray-400 text-sm">{metric.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Market Opportunity */}
          <section className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-black mb-4">
                  <span className="gradient-text">Massive Market Opportunity</span>
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  The digital estate planning market is exploding as wealth transfers to digital-native generations
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  {
                    title: 'Market Size',
                    description: '$14.1T Total Addressable Market (Global Estate Transfer)',
                    stats: [
                      '68 million baby boomers entering retirement',
                      '$30 trillion in wealth transfer over next decade',
                      '90% of families lack digital estate plans',
                      'SAM: $850B (Digital LegalTech)',
                      'SOM: $5.8B (5-year penetration)',
                    ],
                  },
                  {
                    title: 'Growth Drivers',
                    description: 'Multiple tailwinds accelerating adoption',
                    stats: [
                      'Increasing digital asset ownership',
                      'Crypto & NFT mainstream adoption',
                      'Regulatory compliance requirements',
                    ],
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="glass-effect p-8 rounded-2xl border border-white/10"
                  >
                    <BarChart3 className="w-12 h-12 text-primary-400 mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400 mb-6">{item.description}</p>
                    <ul className="space-y-3">
                      {item.stats.map((stat, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-accent-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300">{stat}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Competitive Advantages */}
          <section className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-black mb-4">
                  <span className="gradient-text">Our Competitive Edge</span>
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Technology moats and strategic advantages that set us apart
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: Shield,
                    title: 'Military-Grade Security',
                    description: 'AES-256-GCM encryption, multi-party computation, and zero-knowledge architecture',
                  },
                  {
                    icon: Target,
                    title: 'First-Mover Advantage',
                    description: 'Patent-pending heir verification system and AI-powered document intelligence',
                  },
                  {
                    icon: Globe,
                    title: 'Global Compliance',
                    description: 'Built-in support for international inheritance laws and regulations',
                  },
                  {
                    icon: Award,
                    title: 'Enterprise Ready',
                    description: 'Multi-tenancy, SSO, white-labeling for B2B2C expansion',
                  },
                  {
                    icon: Rocket,
                    title: 'Scalable Technology',
                    description: 'Cloud-native architecture on AWS with auto-scaling and redundancy',
                  },
                  {
                    icon: Users,
                    title: 'Network Effects',
                    description: 'Each user brings heirs, creating viral growth loops',
                  },
                ].map((advantage, index) => (
                  <motion.div
                    key={advantage.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="glass-effect p-6 rounded-2xl border border-white/10 hover:border-primary-500/50 transition-all group"
                  >
                    <advantage.icon className="w-10 h-10 text-primary-400 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold text-white mb-3">{advantage.title}</h3>
                    <p className="text-gray-400">{advantage.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Business Model */}
          <section className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-black mb-4">
                  <span className="gradient-text">Recurring Revenue Model</span>
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Multiple revenue streams with high customer lifetime value
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {[
                  {
                    tier: 'Free Forever',
                    price: '$0',
                    revenue: 'Lead Generation',
                    features: ['Basic vault'],
                  },
                  {
                    tier: 'Plus',
                    price: '$4.99',
                    period: '/mo',
                    revenue: '$59.88 Annual ARR',
                    features: ['Binder', 'Storage', 'Basic automation'],
                  },
                  {
                    tier: 'Pro',
                    price: '$14.99',
                    period: '/mo',
                    revenue: '$179.88 Annual ARR',
                    features: ['Executor tools', 'CNS', 'Memory vault'],
                    highlight: true,
                  },
                  {
                    tier: 'Enterprise Family',
                    price: '$24.99',
                    period: '/mo',
                    revenue: '$299.88 Annual ARR',
                    features: ['Full family vault', 'Unlimited sharing'],
                  },
                  {
                    tier: 'Lifetime',
                    price: '$399',
                    revenue: 'Permanent Access',
                    features: ['One-time payment', 'All features'],
                  },
                ].map((plan, index) => (
                  <motion.div
                    key={plan.tier}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className={`glass-effect p-8 rounded-2xl border ${
                      plan.highlight
                        ? 'border-primary-500/50 shadow-lg shadow-primary-500/20'
                        : 'border-white/10'
                    }`}
                  >
                    <h3 className="text-xl font-bold text-white mb-2">{plan.tier}</h3>
                    <div className="mb-1">
                      <span className="text-3xl font-black gradient-text">{plan.price}</span>
                      {plan.period && <span className="text-lg text-gray-400">{plan.period}</span>}
                    </div>
                    <div className="text-gray-400 text-xs mb-6">{plan.revenue}</div>
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-accent-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="glass-effect-strong p-12 rounded-3xl border border-primary-500/30 text-center"
              >
                <Rocket className="w-16 h-16 text-primary-400 mx-auto mb-6" />
                <h2 className="text-4xl md:text-5xl font-black mb-6">
                  <span className="gradient-text">Join Our Journey</span>
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  We're raising our Series A to scale operations, expand our team,
                  and capture market share in this rapidly growing sector.
                </p>
                <div className="flex justify-center">
                  <motion.button
                    onClick={downloadInvestorPitchDeck}
                    className="px-10 py-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-bold text-white text-lg shadow-lg shadow-primary-500/30 flex items-center justify-center gap-3"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download className="w-6 h-6" />
                    Download Pitch Deck
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      </main>
    </ErrorBoundary>
  );
}
