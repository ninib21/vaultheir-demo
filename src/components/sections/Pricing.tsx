'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Zap, Crown, Building2, ArrowRight, Calculator } from 'lucide-react';
import ROICalculator from '@/components/ROICalculator';
import { usePricing } from '@/lib/hooks/usePricing';
import { Skeleton } from '@/components/ui/Skeleton';

const pricingTiers = [
  {
    name: 'Starter',
    subtitle: 'Individual Creator',
    price: 99,
    annualPrice: 990,
    icon: Zap,
    description: 'Perfect for individual creators and freelancers',
    features: [
      'Up to 10 IP assets/month',
      'Basic blockchain notarization',
      'Simple IP portfolio dashboard',
      'Email support',
      'Standard templates',
      'Basic analytics',
    ],
    notIncluded: [
      'AI-powered valuation',
      'API access',
      'Team collaboration',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    popular: false,
    color: 'from-primary-500 to-primary-600',
  },
  {
    name: 'Professional',
    subtitle: 'SMB',
    price: 499,
    annualPrice: 4990,
    icon: Crown,
    description: 'Ideal for small-medium businesses and startups',
    features: [
      'Up to 100 IP assets/month',
      'Advanced blockchain notarization',
      'AI-powered IP valuation estimates',
      'Priority support',
      'Custom templates',
      'Advanced analytics dashboard',
      'API access (limited)',
      'Team collaboration (up to 5 users)',
      'Export & reporting',
      'Custom branding',
    ],
    notIncluded: [
      'White-label options',
      'Unlimited team members',
      'Custom integrations',
    ],
    cta: 'Start Free Trial',
    popular: true,
    color: 'from-accent-500 to-primary-500',
  },
  {
    name: 'Enterprise',
    subtitle: 'Corporate',
    price: 2499,
    annualPrice: 24990,
    icon: Building2,
    description: 'For large corporations and IP law firms',
    features: [
      'Unlimited IP assets',
      'Enterprise-grade blockchain notarization',
      'Advanced AI valuation models',
      '24/7 dedicated support',
      'White-label options',
      'Full API access',
      'Unlimited team members',
      'Custom integrations',
      'Compliance reporting',
      'Advanced analytics & insights',
      'SLA guarantees (99.9% uptime)',
      'Dedicated account manager',
    ],
    notIncluded: [],
    cta: 'Contact Sales',
    popular: false,
    color: 'from-primary-600 to-accent-600',
  },
];

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [showCalculator, setShowCalculator] = useState(false);
  const [pricingData, setPricingData] = useState<Record<string, any>>({});
  const { getTiers, loading } = usePricing();

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
    <section id="pricing" className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">Simple, Transparent Pricing</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include 14-day free trial.
          </p>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-primary-500 text-white'
                  : 'glass-effect text-gray-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all relative ${
                billingCycle === 'annual'
                  ? 'bg-primary-500 text-white'
                  : 'glass-effect text-gray-400 hover:text-white'
              }`}
            >
              Annual
              <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs px-2 py-0.5 rounded-full">
                Save 17%
              </span>
            </button>
          </div>

          <motion.button
            onClick={() => setShowCalculator(!showCalculator)}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 glass-effect rounded-lg text-primary-400 hover:text-primary-300 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Calculator className="w-5 h-5" />
            Calculate Your ROI
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative glass-effect-strong rounded-3xl p-10 ${
                tier.popular 
                  ? 'ring-2 ring-primary-500/50 scale-105 shadow-2xl shadow-primary-500/20 border-primary-500/30' 
                  : 'hover:border-primary-500/30'
              } transition-all duration-300 hover-lift`}
              whileHover={{ y: tier.popular ? -5 : -8, scale: tier.popular ? 1.06 : 1.02 }}
            >
              {tier.popular && (
                <motion.div 
                  className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-accent-500 via-primary-500 to-accent-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-primary-500/50"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, type: 'spring' }}
                >
                  Most Popular
                </motion.div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <tier.icon className={`w-8 h-8 bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`} />
                <div>
                  <h3 className="text-2xl font-bold text-white">{tier.name}</h3>
                  <p className="text-sm text-gray-400">{tier.subtitle}</p>
                </div>
              </div>

              <p className="text-gray-300 mb-6">{tier.description}</p>

              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-extrabold text-white">
                    ${Math.round(billingCycle === 'annual' ? tier.annualPrice / 12 : tier.price)}
                  </span>
                  <span className="text-gray-400 text-xl">/month</span>
                </div>
                {billingCycle === 'annual' && (
                  <div className="mt-3 flex items-center gap-2">
                    <p className="text-sm text-gray-400 line-through">
                      ${tier.price * 12}/year
                    </p>
                    <p className="text-sm font-semibold text-accent-400">
                      ${tier.annualPrice} billed annually
                    </p>
                    <span className="text-xs bg-accent-500/20 text-accent-400 px-2 py-1 rounded-full font-semibold">
                      Save 17%
                    </span>
                  </div>
                )}
              </div>

              <motion.a
                href={tier.name === 'Enterprise' ? '#contact' : '#demo'}
                className={`block w-full text-center py-3 px-6 rounded-lg font-semibold mb-6 transition-all ${
                  tier.popular
                    ? `bg-gradient-to-r ${tier.color} text-white glow-effect`
                    : 'glass-effect border border-primary-500/50 text-white hover:border-primary-500'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {tier.cta}
              </motion.a>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-300 mb-3">Included:</p>
                {tier.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
                {tier.notIncluded.length > 0 && (
                  <>
                    <p className="text-sm font-semibold text-gray-500 mt-4 mb-3">Not included:</p>
                    {tier.notIncluded.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <X className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-500 text-sm line-through">{feature}</span>
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
            <a href="#contact" className="text-primary-400 hover:text-primary-300">
              Contact our sales team
            </a>
          </p>
          <p className="text-sm text-gray-500">
            All plans include 14-day free trial. No credit card required.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

