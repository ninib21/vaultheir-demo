import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { PricingService } from './pricing.service';

@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Get('calculate')
  async calculate(@Query('tier') tier: string, @Query('assets') assets: string) {
    return this.pricingService.calculatePricing(tier, parseInt(assets || '0'));
  }

  @Post('roi')
  async calculateROI(@Body() body: {
    patents: number;
    trademarks: number;
    copyrights: number;
    tier: string;
  }) {
    return this.pricingService.calculateROI(body);
  }
}

