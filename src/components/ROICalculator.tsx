'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, DollarSign, Loader2 } from 'lucide-react';
import { usePricing } from '@/lib/hooks/usePricing';
import { useToastContext } from '@/components/providers/ToastProvider';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function ROICalculator() {
  const [patents, setPatents] = useState(0);
  const [trademarks, setTrademarks] = useState(0);
  const [copyrights, setCopyrights] = useState(0);
  const [tier, setTier] = useState('professional');
  const [roiData, setRoiData] = useState<{
    traditional_cost: number;
    vaultheir_cost: number;
    savings: number;
    savings_percent: number;
  } | null>(null);

  const { getROI, loading, error } = usePricing();
  const { success, error: showError } = useToastContext();

  useEffect(() => {
    const calculateROI = async () => {
      if (patents === 0 && trademarks === 0 && copyrights === 0) {
        setRoiData(null);
        return;
      }

      try {
        const result = await getROI({ patents, trademarks, copyrights, tier });
        setRoiData(result);
      } catch (err) {
        // Error is handled by the hook
        setRoiData(null);
      }
    };

    const timeoutId = setTimeout(calculateROI, 500); // Debounce
    return () => clearTimeout(timeoutId);
  }, [patents, trademarks, copyrights, tier, getROI]);

  const traditionalCost = roiData?.traditional_cost || 0;
  const vaultheirCost = roiData?.vaultheir_cost || 0;
  const savings = roiData?.savings || 0;
  const savingsPercent = roiData?.savings_percent || 0;

  return (
    <div className="glass-effect-strong rounded-2xl p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="w-8 h-8 text-primary-400" />
        <h3 className="text-2xl font-bold text-white">ROI Calculator</h3>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm"
        >
          {error}
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Pricing Tier
            </label>
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value)}
              className="w-full px-4 py-2.5 glass-effect border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            >
              <option value="starter">Starter</option>
              <option value="professional">Professional</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Patents (Traditional: $20,000 each)
            </label>
            <input
              type="number"
              value={patents}
              onChange={(e) => setPatents(Math.max(0, Number(e.target.value)))}
              className="w-full px-4 py-2.5 glass-effect border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              min="0"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Trademarks (Traditional: $3,000 each)
            </label>
            <input
              type="number"
              value={trademarks}
              onChange={(e) => setTrademarks(Math.max(0, Number(e.target.value)))}
              className="w-full px-4 py-2.5 glass-effect border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              min="0"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Copyrights (Traditional: $500 each)
            </label>
            <input
              type="number"
              value={copyrights}
              onChange={(e) => setCopyrights(Math.max(0, Number(e.target.value)))}
              className="w-full px-4 py-2.5 glass-effect border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              min="0"
              placeholder="0"
            />
          </div>
        </div>

        <div className="space-y-4">
          {loading && !roiData ? (
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner size="lg" text="Calculating ROI..." />
            </div>
          ) : (
            <>
              <motion.div
                className="glass-effect-strong p-6 rounded-xl border border-red-500/30 hover:border-red-500/50 transition-colors"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-red-400" />
                  <h4 className="font-semibold text-gray-300">Traditional Filing Cost</h4>
                </div>
                <p className="text-4xl font-extrabold text-red-400">
                  ${traditionalCost.toLocaleString()}
                </p>
                <p className="text-sm text-gray-400 mt-2">Average annual cost</p>
              </motion.div>

              <motion.div
                className="glass-effect-strong p-6 rounded-xl border border-primary-500/30 hover:border-primary-500/50 transition-colors"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-primary-400" />
                  <h4 className="font-semibold text-gray-300">Vaultheir™ Cost</h4>
                </div>
                <p className="text-4xl font-extrabold text-primary-400">
                  ${vaultheirCost.toLocaleString()}
                </p>
                <p className="text-sm text-gray-400 mt-2">Annual subscription + fees</p>
              </motion.div>

              {savings > 0 && (
                <motion.div
                  className="glass-effect-strong p-6 rounded-xl border border-accent-500/30 bg-gradient-to-br from-accent-500/10 to-primary-500/10 hover:border-accent-500/50 transition-colors"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-accent-400" />
                    <h4 className="font-semibold text-white">Your Savings</h4>
                  </div>
                  <p className="text-4xl font-extrabold text-accent-400">
                    ${savings.toLocaleString()}
                  </p>
                  <p className="text-lg font-bold text-accent-300 mt-2">
                    {savingsPercent.toFixed(1)}% savings
                  </p>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>

      {savings > 0 && roiData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-5 bg-gradient-to-r from-primary-500/20 to-accent-500/20 border border-primary-500/50 rounded-xl"
        >
          <p className="text-center text-white text-lg">
            💡 <strong>You could save ${savings.toLocaleString()}</strong> annually by switching to
            Vaultheir™
          </p>
        </motion.div>
      )}

      {patents === 0 && trademarks === 0 && copyrights === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>Enter your IP assets above to see potential savings</p>
        </div>
      )}
    </div>
  );
}

