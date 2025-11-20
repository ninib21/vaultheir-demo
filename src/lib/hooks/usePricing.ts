import { useState, useCallback } from 'react';
import { calculatePricing, calculateROI, getPricingTiers, type PricingRequest, type ROIRequest } from '@/lib/api/pricing';

export function usePricing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPricing = useCallback(async (request: PricingRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await calculatePricing(request);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to calculate pricing';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getROI = useCallback(async (request: ROIRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await calculateROI(request);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to calculate ROI';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTiers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getPricingTiers();
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch pricing tiers';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getPricing,
    getROI,
    getTiers,
    loading,
    error,
  };
}

