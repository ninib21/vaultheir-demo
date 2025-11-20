import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { HederaService } from './hedera.service';

@Controller('hedera')
export class HederaController {
  constructor(private readonly hederaService: HederaService) {}

  @Post('notarize')
  async notarize(@Body() body: { content: string; metadata?: Record<string, any> }) {
    const response = await this.hederaService.notarizeIPAsset(body.content, body.metadata);
    return {
      success: true,
      transactionId: response.transactionId.toString(),
      timestamp: new Date().toISOString(),
    };
  }

  @Get('transaction/:transactionId')
  async getTransaction(@Param('transactionId') transactionId: string) {
    const receipt = await this.hederaService.getTransactionReceipt(transactionId);
    return receipt;
  }
}

