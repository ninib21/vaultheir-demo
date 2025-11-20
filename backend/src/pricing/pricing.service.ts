import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PricingService {
  constructor(private readonly httpService: HttpService) {}

  /**
   * Calculate pricing for IP assets
   */
  async calculatePricing(tier: string, assets: number) {
    const basePrices = {
      starter: { monthly: 99, annual: 990, limit: 10 },
      professional: { monthly: 499, annual: 4990, limit: 100 },
      enterprise: { monthly: 2499, annual: 24990, limit: Infinity },
    };

    const tierPrices = basePrices[tier as keyof typeof basePrices] || basePrices.starter;
    const overLimit = Math.max(0, assets - tierPrices.limit);
    const overLimitCost = overLimit * (tier === 'starter' ? 15 : tier === 'professional' ? 10 : 0);

    return {
      tier,
      basePrice: tierPrices.monthly,
      basePriceAnnual: tierPrices.annual,
      assets,
      overLimit,
      overLimitCost,
      totalMonthly: tierPrices.monthly + overLimitCost,
      totalAnnual: tierPrices.annual + overLimitCost * 12,
      savings: tierPrices.annual - tierPrices.monthly * 12,
    };
  }

  /**
   * Get ROI calculation
   */
  async calculateROI(data: {
    patents: number;
    trademarks: number;
    copyrights: number;
    tier: string;
  }) {
    const patentCost = 20000;
    const trademarkCost = 3000;
    const copyrightCost = 500;

    const traditionalCost =
      data.patents * patentCost + data.trademarks * trademarkCost + data.copyrights * copyrightCost;

    const totalAssets = data.patents + data.trademarks + data.copyrights;
    const pricing = await this.calculatePricing(data.tier, totalAssets);
    const vaultheirCost = pricing.totalAnnual;

    const savings = traditionalCost - vaultheirCost;
    const savingsPercent = traditionalCost > 0 ? (savings / traditionalCost) * 100 : 0;

    return {
      traditionalCost,
      vaultheirCost,
      savings,
      savingsPercent: Number(savingsPercent.toFixed(1)),
      roi: savingsPercent,
    };
  }
}

