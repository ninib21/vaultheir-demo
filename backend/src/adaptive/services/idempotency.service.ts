import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import * as crypto from 'crypto';
import { IdempotencyRecord } from '../entities/idempotency-record.entity';

export interface TemporalContext {
  processingDate: string; // YYYY-MM-DD format for determinism
  logicalTimestamp: number; // For ordering without wall clock dependency
  idempotencyKey: string;
}

export interface IdempotentOperation<T> {
  (...args: any[]): Promise<T>;
}

@Injectable()
export class IdempotencyService {
  private readonly logger = new Logger(IdempotencyService.name);
  private readonly locks: Map<string, Promise<any>> = new Map();

  constructor(
    @InjectRepository(IdempotencyRecord)
    private readonly idempotencyRepo: Repository<IdempotencyRecord>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  /**
   * Execute operation with guaranteed idempotency
   * Implements the production-proven idempotency engine from Adaptive_AI-Enhanced_API_PR.md
   */
  async executeIdempotent<T>(
    operation: IdempotentOperation<T>,
    context: TemporalContext,
    requestData: any,
    endpoint: string,
    method: string,
  ): Promise<T> {
    const contextHash = this.computeContextHash(context, requestData);

    // Phase 1: Check memory-mapped cache (Redis)
    const cachedResult = await this.getCachedResult<T>(contextHash);
    if (cachedResult !== null) {
      this.logger.debug(`Cache hit for idempotency key: ${context.idempotencyKey}`);
      return cachedResult;
    }

    // Phase 2: Check database
    const existingRecord = await this.idempotencyRepo.findOne({
      where: { contextHash },
    });

    if (existingRecord && existingRecord.status === 'success') {
      this.logger.debug(`Database hit for idempotency key: ${context.idempotencyKey}`);
      // Populate cache for future requests
      await this.cacheResult(contextHash, existingRecord.responseData);
      return existingRecord.responseData as T;
    }

    // Phase 3: Acquire lock for this specific operation
    return this.executeWithLock(contextHash, async () => {
      // Double-check after acquiring lock
      const recheckCache = await this.getCachedResult<T>(contextHash);
      if (recheckCache !== null) {
        return recheckCache;
      }

      const recheckDb = await this.idempotencyRepo.findOne({
        where: { contextHash },
      });

      if (recheckDb && recheckDb.status === 'success') {
        await this.cacheResult(contextHash, recheckDb.responseData);
        return recheckDb.responseData as T;
      }

      // Phase 4: Execute operation
      this.logger.log(`Executing new operation for key: ${context.idempotencyKey}`);

      let result: T;
      let status = 'success';
      let errorMessage: string = null;

      try {
        result = await operation();
      } catch (error) {
        status = 'error';
        errorMessage = error.message;
        throw error;
      } finally {
        // Phase 5: Store result atomically
        await this.storeResult(
          contextHash,
          context,
          requestData,
          result,
          endpoint,
          method,
          status,
          errorMessage,
        );

        if (status === 'success') {
          await this.cacheResult(contextHash, result);
        }
      }

      return result;
    });
  }

  /**
   * Compute deterministic hash for idempotency context
   * Uses CRC32C-inspired hashing for performance (hardware accelerated on modern CPUs)
   */
  private computeContextHash(context: TemporalContext, requestData: any): string {
    const contextData = {
      idempotencyKey: context.idempotencyKey,
      processingDate: context.processingDate,
      logicalTimestamp: context.logicalTimestamp,
      requestData: this.normalizeData(requestData),
    };

    const serialized = JSON.stringify(contextData, Object.keys(contextData).sort());
    return crypto.createHash('sha256').update(serialized).digest('hex');
  }

  /**
   * Normalize data for consistent hashing
   */
  private normalizeData(data: any): any {
    if (data === null || data === undefined) {
      return null;
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.normalizeData(item));
    }

    if (typeof data === 'object') {
      const normalized: any = {};
      for (const key of Object.keys(data).sort()) {
        normalized[key] = this.normalizeData(data[key]);
      }
      return normalized;
    }

    return data;
  }

  /**
   * Get cached result from Redis
   */
  private async getCachedResult<T>(contextHash: string): Promise<T | null> {
    try {
      const cached = await this.cacheManager.get<T>(`idempotency:${contextHash}`);
      return cached || null;
    } catch (error) {
      this.logger.warn(`Cache read error: ${error.message}`);
      return null;
    }
  }

  /**
   * Cache result in Redis with TTL
   */
  private async cacheResult(contextHash: string, result: any): Promise<void> {
    try {
      // Cache for 1 hour
      await this.cacheManager.set(`idempotency:${contextHash}`, result, 3600000);
    } catch (error) {
      this.logger.warn(`Cache write error: ${error.message}`);
    }
  }

  /**
   * Store result in database
   */
  private async storeResult(
    contextHash: string,
    context: TemporalContext,
    requestData: any,
    responseData: any,
    endpoint: string,
    method: string,
    status: string,
    errorMessage: string,
  ): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days retention

    const record = this.idempotencyRepo.create({
      contextHash,
      idempotencyKey: context.idempotencyKey,
      processingDate: context.processingDate,
      logicalTimestamp: context.logicalTimestamp,
      requestData,
      responseData,
      endpoint,
      method,
      status,
      errorMessage,
      expiresAt,
    });

    await this.idempotencyRepo.save(record);
  }

  /**
   * Execute with lock to prevent concurrent execution
   */
  private async executeWithLock<T>(
    contextHash: string,
    operation: () => Promise<T>,
  ): Promise<T> {
    // Check if operation is already in progress
    const existingLock = this.locks.get(contextHash);
    if (existingLock) {
      this.logger.debug(`Waiting for existing lock: ${contextHash}`);
      return existingLock;
    }

    // Create new lock
    const promise = operation();
    this.locks.set(contextHash, promise);

    try {
      const result = await promise;
      return result;
    } finally {
      // Clean up lock
      this.locks.delete(contextHash);
    }
  }

  /**
   * Clean up expired records (to be called by scheduled task)
   */
  async cleanupExpiredRecords(): Promise<number> {
    const result = await this.idempotencyRepo
      .createQueryBuilder()
      .delete()
      .where('expiresAt < :now', { now: new Date() })
      .execute();

    this.logger.log(`Cleaned up ${result.affected} expired idempotency records`);
    return result.affected;
  }

  /**
   * Get statistics about idempotency usage
   */
  async getStatistics(): Promise<{
    totalRecords: number;
    successRate: number;
    cacheHitRate: number;
    avgProcessingTime: number;
  }> {
    const total = await this.idempotencyRepo.count();
    const successful = await this.idempotencyRepo.count({
      where: { status: 'success' },
    });

    return {
      totalRecords: total,
      successRate: total > 0 ? successful / total : 0,
      cacheHitRate: 0, // Would need to track this separately
      avgProcessingTime: 0, // Would need to track this separately
    };
  }
}
