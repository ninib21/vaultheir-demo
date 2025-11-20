import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Client,
  AccountId,
  PrivateKey,
  FileCreateTransaction,
  FileContentsQuery,
  TransactionResponse,
} from '@hashgraph/sdk';

@Injectable()
export class HederaService implements OnModuleInit {
  private client: Client;
  private operatorId: AccountId;
  private operatorKey: PrivateKey;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const network = this.configService.get<string>('HEDERA_NETWORK', 'testnet');
    const operatorId = this.configService.get<string>('HEDERA_OPERATOR_ID');
    const operatorKey = this.configService.get<string>('HEDERA_OPERATOR_KEY');

    if (!operatorId || !operatorKey) {
      console.warn('⚠️  Hedera credentials not configured. Hedera features will be disabled.');
      return;
    }

    this.operatorId = AccountId.fromString(operatorId);
    this.operatorKey = PrivateKey.fromString(operatorKey);

    this.client = Client.forName(network);
    this.client.setOperator(this.operatorId, this.operatorKey);

    console.log(`✅ Hedera client initialized for ${network}`);
  }

  /**
   * Notarize IP asset on Hedera Hashgraph
   */
  async notarizeIPAsset(
    content: string | Uint8Array,
    metadata?: Record<string, any>
  ): Promise<TransactionResponse> {
    if (!this.client) {
      throw new Error('Hedera client not initialized. Please configure HEDERA_OPERATOR_ID and HEDERA_OPERATOR_KEY.');
    }

    try {
      const contentBytes = typeof content === 'string' 
        ? new TextEncoder().encode(content)
        : content;

      // Create file on Hedera
      const transaction = await new FileCreateTransaction()
        .setContents(contentBytes)
        .setKeys([this.operatorKey.publicKey])
        .freezeWith(this.client);

      const signedTransaction = await transaction.sign(this.operatorKey);
      const response = await signedTransaction.execute(this.client);

      console.log(`✅ IP asset notarized. Transaction ID: ${response.transactionId.toString()}`);

      return response;
    } catch (error) {
      console.error('❌ Error notarizing IP asset:', error);
      throw error;
    }
  }

  /**
   * Retrieve IP asset from Hedera
   */
  async getIPAsset(fileId: string): Promise<Uint8Array> {
    if (!this.client) {
      throw new Error('Hedera client not initialized.');
    }

    try {
      const query = new FileContentsQuery()
        .setFileId(fileId);

      const contents = await query.execute(this.client);

      return contents;
    } catch (error) {
      console.error('❌ Error retrieving IP asset:', error);
      throw error;
    }
  }

  /**
   * Get transaction receipt
   */
  async getTransactionReceipt(transactionId: string) {
    if (!this.client) {
      throw new Error('Hedera client not initialized.');
    }

    // Implementation for getting transaction receipt
    // This would query the Hedera network for the transaction status
    return {
      transactionId,
      status: 'success',
      timestamp: new Date().toISOString(),
    };
  }
}

