import { pricingClient } from './client';

export interface PricingRequest {
  tier: string;
  assets: number;
  billing_cycle?: 'monthly' | 'annual';
}

export interface PricingResponse {
  tier: string;
  base_price: number;
  base_price_annual: number;
  assets: number;
  over_limit: number;
  over_limit_cost: number;
  total_monthly: number;
  total_annual: number;
  savings: number;
  cached: boolean;
}

export interface ROIRequest {
  patents?: number;
  trademarks?: number;
  copyrights?: number;
  tier?: string;
}

export interface ROIResponse {
  traditional_cost: number;
  vaultheir_cost: number;
  savings: number;
  savings_percent: number;
  roi: number;
}

export interface PricingTiers {
  tiers: Record<string, {
    monthly: number;
    annual: number;
    limit: number;
    over_limit_price: number;
  }>;
  traditional_costs: {
    patent: number;
    trademark: number;
    copyright: number;
  };
}

/**
 * Calculate pricing for a given tier and number of assets
 */
export async function calculatePricing(request: PricingRequest): Promise<PricingResponse> {
  const response = await pricingClient.post<PricingResponse>('/calculate', request);
  return response.data;
}

/**
 * Calculate ROI compared to traditional IP filing
 */
export async function calculateROI(request: ROIRequest): Promise<ROIResponse> {
  const response = await pricingClient.post<ROIResponse>('/roi', request);
  return response.data;
}

/**
 * Get all available pricing tiers
 */
export async function getPricingTiers(): Promise<PricingTiers> {
  const response = await pricingClient.get<PricingTiers>('/tiers');
  return response.data;
}

/**
 * Check pricing service health
 */
export async function checkPricingHealth(): Promise<boolean> {
  try {
    const response = await pricingClient.get('/health');
    return response.data.status === 'ok';
  } catch {
    return false;
  }
}

