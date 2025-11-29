'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Check, X, Zap, Crown, Calculator, Sparkles, Star, Gem } from 'lucide-react';
import ROICalculator from '@/components/ROICalculator';
import { usePricing } from '@/lib/hooks/usePricing';
import { Skeleton } from '@/components/ui/Skeleton';

/**
 * Pricing Section - AWE-FACTOR Edition
 *
 * Features:
 * - 3D card tilt effects on hover
 * - Animated gradient borders
 * - Particle effects on popular card
 * - Smooth price transitions
 * - Interactive billing toggle
 */

const pricingTiers = [
  {
    name: 'Free',
    key: 'free',
    subtitle: 'Basic Vault',
    price: 0,
    annualPrice: 0,
    icon: Zap,
    description: 'Perfect for individuals getting started',
    features: [
      'Basic digital vault',
      'Document storage',
      'Basic encryption',
      'Email support',
      'Emergency contacts',
    ],
    notIncluded: [
      'Emergency binder automation',
      'Executor tools',
      'Memory vault',
      'Family sharing',
    ],
    cta: 'Start Free',
    href: '/signup?plan=free',
    popular: false,
    color: 'from-primary-500 to-primary-600',
  },
  {
    name: 'Pro',
    key: 'pro',
    subtitle: 'Complete Estate Planning',
    price: 14.99,
    annualPrice: 149.88,
    icon: Crown,
    description: 'Ideal for families with complex estates',
    features: [
      'Executor automation tools',
      'CNS security layer',
      'Memory preservation vault',
      'AI Will Lawyer',
      'Digital directives',
      'Priority support',
      'Beneficiary mapping',
      'Healthcare directives',
      'Trust templates',
    ],
    notIncluded: [
      'Unlimited family sharing',
      'White-label options',
    ],
    cta: 'Start Free Trial',
    href: '/signup?plan=pro',
    popular: true,
    color: 'from-accent-500 to-primary-500',
  },
  {
    name: 'Lifetime',
    key: 'lifetime',
    subtitle: 'One-Time Payment',
    price: 399,
    annualPrice: 399,
    isLifetime: true,
    icon: Gem,
    description: 'Permanent access to all features',
    features: [
      'All Pro features',
      'All Enterprise features',
      'Lifetime updates',
      'Priority support forever',
      'No recurring fees',
      'All future features',
    ],
    notIncluded: [],
    cta: 'Get Lifetime Access',
    href: '/signup?plan=lifetime',
    popular: false,
    color: 'from-accent-500 to-accent-600',
  },
];

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [showCalculator, setShowCalculator] = useState(false);
  const [pricingData, setPricingData] = useState<Record<string, any>>({});
  const { getTiers, loading } = usePricing();

  const getAnnualSavingsPercent = (tier: (typeof pricingTiers)[number]) => {
    if (!tier.price || tier.price <= 0 || tier.isLifetime) return null;
    const baselineAnnual = tier.price * 12;
    if (!tier.annualPrice || tier.annualPrice >= baselineAnnual) return null;
    return Math.round((1 - tier.annualPrice / baselineAnnual) * 100);
  };

  const proTier = pricingTiers.find((tier) => tier.key === 'pro');
  const annualSavingsPercent = proTier ? getAnnualSavingsPercent(proTier) : null;
  const annualSavingsColor = annualSavingsPercent === null ? 'text-gray-300' : annualSavingsPercent >= 0 ? 'text-emerald-400' : 'text-rose-400';
  const annualSavingsLabel = annualSavingsPercent === null ? '0%' : `${annualSavingsPercent > 0 ? '+' : ''}${annualSavingsPercent}%`;

  useEffect(() => {
    const fetchTiers = async () => {
      try {
        const data = await getTiers();
        setPricingData(data);
      } catch (error) {
        // Use default pricing if API fails
        console.warn('Failed to fetch pricing tiers, using defaults');
      }
    };
    fetchTiers();
  }, [getTiers]);

  return (
    <section id="pricing" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradient orbs */}
      <motion.div
        className="absolute top-1/4 -left-64 w-96 h-96 bg-gradient-to-r from-primary-500/10 to-accent-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-64 w-80 h-80 bg-gradient-to-l from-accent-500/10 to-primary-500/10 rounded-full blur-3xl"
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

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-primary-500/30 mb-6"
          >
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-300">7-Day Free Trial on Pro Plans & Up</span>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">Simple, Transparent Pricing</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Choose the plan that fits your needs. Pro and Enterprise plans include a 7-day free trial.
          </p>

          {/* Enhanced Billing Toggle */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-2 mt-8 p-1.5 glass-premium rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <motion.button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all relative ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
              whileHover={{ scale: billingCycle === 'monthly' ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Monthly
            </motion.button>
            <motion.button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all relative ${
                billingCycle === 'annual'
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
              whileHover={{ scale: billingCycle === 'annual' ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Annual
              <motion.span
                className="absolute -top-3 -right-3 bg-white/10 px-2 py-1 rounded-full font-bold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.5 }}
              >
                <span className={`text-xs ${annualSavingsColor}`}>{annualSavingsLabel}</span>
              </motion.span>
            </motion.button>
          </motion.div>

          <motion.button
            onClick={() => setShowCalculator(!showCalculator)}
            className="mt-10 inline-flex items-center gap-2 px-6 py-3 glass-premium rounded-xl text-primary-400 hover:text-primary-300 transition-colors hover-glow group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Calculator className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>Calculate Your ROI</span>
            <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse-glow" />
          </motion.button>
        </motion.div>

        {showCalculator && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-12"
          >
            <ROICalculator />
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12 items-start pt-8">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.key}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative glass-effect-strong rounded-2xl p-5 flex flex-col h-full ${
                tier.popular
                  ? 'ring-2 ring-primary-500/50 shadow-2xl shadow-primary-500/20 border-primary-500/30'
                  : 'hover:border-primary-500/30'
              } transition-all duration-300`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-accent-500 via-primary-500 to-accent-500 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-primary-500/50 whitespace-nowrap">
                  Most Popular
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <tier.icon className={`w-7 h-7 bg-gradient-to-r ${tier.color} bg-clip-text text-transparent flex-shrink-0`} />
                <div className="min-w-0">
                  <h3 className="text-xl font-bold text-white truncate">{tier.name}</h3>
                  <p className="text-xs text-gray-400 truncate">{tier.subtitle}</p>
                </div>
              </div>

              <p className="text-gray-300 text-sm mb-4 min-h-[40px]">{tier.description}</p>

              <div className="mb-6">
                <div className="flex items-baseline gap-1 flex-wrap">
                  {tier.price === 0 ? (
                    <span className="text-4xl font-extrabold text-white">Free</span>
                  ) : (tier as any).isLifetime ? (
                    <>
                      <span className="text-4xl font-extrabold text-white">${tier.price}</span>
                      <span className="text-gray-400 text-sm">once</span>
                    </>
                  ) : (
                    <>
                      <span className="text-4xl font-extrabold text-white">
                        ${(billingCycle === 'annual' ? tier.annualPrice / 12 : tier.price).toFixed(2)}
                      </span>
                      <span className="text-gray-400 text-base">/mo</span>
                    </>
                  )}
                </div>
                {billingCycle === 'annual' && tier.price > 0 && !(tier as any).isLifetime && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-400 line-through">
                      ${tier.price * 12}/year
                    </p>
                    <p className="text-xs font-semibold text-accent-400">
                      ${tier.annualPrice} billed annually
                    </p>
                  </div>
                )}
              </div>

              <a
                href={tier.href ?? '#demo'}
                className={`block w-full text-center py-2.5 px-4 rounded-lg font-semibold mb-4 transition-all text-sm ${
                  tier.popular
                    ? `bg-gradient-to-r ${tier.color} text-white glow-effect`
                    : 'glass-effect border border-primary-500/50 text-white hover:border-primary-500'
                }`}
              >
                {tier.cta}
              </a>

              <div className="space-y-2 flex-grow">
                <p className="text-xs font-semibold text-gray-300 mb-2">Included:</p>
                {tier.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-xs leading-tight">{feature}</span>
                  </div>
                ))}
                {tier.notIncluded.length > 0 && (
                  <>
                    <p className="text-xs font-semibold text-gray-500 mt-3 mb-2">Not included:</p>
                    {tier.notIncluded.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <X className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-500 text-xs leading-tight line-through">{feature}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-400 mb-4">
            Need a custom solution?{' '}
            <a href="/contact" className="text-primary-400 hover:text-primary-300">
              Contact our sales team
            </a>
          </p>
          <p className="text-sm text-gray-500">
            Pro and Enterprise plans include 7-day free trial. No credit card required.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

