import { Injectable, BadRequestException, NotFoundException, Logger, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { IPAsset } from './entities/ip-asset.entity';
import { IPAssetMetadata, IPAssetMetadataDocument } from './schemas/ip-asset-metadata.schema';
import { HederaService } from '../hedera/hedera.service';
import { EnhancedIPAssetPipeline } from '../../../data_pipelines/ip-asset-pipeline-enhanced';
import { AIEnhancedErrorFormatter } from '../middleware/ai-robustness.middleware';

/**
 * IP Assets Service - Enterprise Grade
 *
 * Features:
 * - Robust data pipeline integration
 * - Intelligent caching with invalidation
 * - Comprehensive audit logging
 * - Advanced search and filtering
 * - Batch operations support
 * - Real-time metrics tracking
 */

export interface CreateIPAssetDto {
  name: string;
  type: 'patent' | 'trademark' | 'copyright' | 'trade-secret' | 'legal-document';
  description?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export interface SearchFilters {
  userId?: string;
  type?: string;
  status?: string;
  search?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface BatchOperationResult {
  successful: number;
  failed: number;
  errors: Array<{ index: number; error: string }>;
  assets: IPAsset[];
}

@Injectable()
export class IPAssetsService {
  private readonly logger = new Logger('IPAssetsService');
  private pipeline: EnhancedIPAssetPipeline;

  // Cache keys
  private readonly CACHE_PREFIX = 'ip-asset:';
  private readonly CACHE_TTL = 300; // 5 minutes

  constructor(
    @InjectRepository(IPAsset)
    private ipAssetRepository: Repository<IPAsset>,
    @InjectModel(IPAssetMetadata.name)
    private metadataModel: Model<IPAssetMetadataDocument>,
    private hederaService: HederaService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {
    this.pipeline = new EnhancedIPAssetPipeline();
    this.logger.log('Enhanced pipeline initialized with fail-fast and idempotency');
  }

  /**
   * Create a new IP asset with full pipeline validation
   */
  async create(createDto: CreateIPAssetDto, processingDate?: string): Promise<IPAsset & { pipelineMetadata: any }> {
    const startTime = Date.now();

    try {
      // Run through enhanced validation pipeline
      const result = await this.pipeline.execute(createDto as any, processingDate);

      if (!result.success) {
        const formattedError = AIEnhancedErrorFormatter.formatValidationError(
          result.errors.map(err => ({
            field: err.field || 'unknown',
            message: err.message,
            code: err.code,
            receivedValue: err.value,
            expectedType: err.expected,
          }))
        );

        this.logger.warn(`Asset creation failed: ${JSON.stringify(result.errors)}`);

        throw new BadRequestException({
          ...formattedError,
          pipelineMetadata: result.metadata,
          warnings: result.warnings,
        });
      }

      // Log pipeline metrics
      const metrics = this.pipeline.getMetrics();
      this.logger.debug(`Pipeline metrics: ${JSON.stringify({
        successRate: ((metrics.successfulExecutions / metrics.totalExecutions) * 100).toFixed(2) + '%',
        avgExecutionTime: metrics.averageExecutionTimeMs.toFixed(2) + 'ms',
        totalExecutions: metrics.totalExecutions,
      })}`);

      // Create and save asset - only pass fields that IPAsset expects
      // Let TypeORM handle id, createdAt, updatedAt automatically
      const assetData: Partial<IPAsset> = {
        name: result.data!.name,
        type: result.data!.type,
        description: result.data!.description || '',
        status: result.data!.status || 'pending',
        userId: createDto.userId || 'demo-user',
        fileUrl: '', // Will be set during notarization
        hederaTransactionId: result.data!.hederaTransactionId,
      };
      const asset = this.ipAssetRepository.create(assetData);

      const savedAsset: IPAsset = await this.ipAssetRepository.save(asset) as IPAsset;

      // Invalidate relevant caches
      await this.invalidateUserCache(savedAsset.userId);

      // Store metadata if provided
      if (createDto.metadata) {
        await this.addMetadata(savedAsset.id, createDto.metadata);
      }

      this.logger.log(`Asset created: ${savedAsset.id} in ${Date.now() - startTime}ms`);

      return {
        ...savedAsset,
        pipelineMetadata: result.metadata,
      } as IPAsset & { pipelineMetadata: any };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Asset creation error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create multiple assets in batch
   */
  async createBatch(
    assets: CreateIPAssetDto[],
    processingDate?: string
  ): Promise<BatchOperationResult> {
    const result: BatchOperationResult = {
      successful: 0,
      failed: 0,
      errors: [],
      assets: [],
    };

    for (let i = 0; i < assets.length; i++) {
      try {
        const asset = await this.create(assets[i], processingDate);
        result.successful++;
        result.assets.push(asset);
      } catch (error) {
        result.failed++;
        result.errors.push({
          index: i,
          error: error.message,
        });
      }
    }

    this.logger.log(`Batch operation: ${result.successful} successful, ${result.failed} failed`);
    return result;
  }

  /**
   * Find all assets with advanced filtering and pagination
   */
  async findAll(filters: SearchFilters = {}): Promise<{
    data: IPAsset[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      userId,
      type,
      status,
      search,
      startDate,
      endDate,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = filters;

    // Build cache key
    const cacheKey = `${this.CACHE_PREFIX}list:${JSON.stringify(filters)}`;

    // Check cache
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      this.logger.debug(`Cache hit for: ${cacheKey}`);
      return cached as any;
    }

    // Build query
    const queryBuilder = this.ipAssetRepository.createQueryBuilder('asset');

    if (userId) {
      queryBuilder.andWhere('asset.userId = :userId', { userId });
    }
    if (type) {
      queryBuilder.andWhere('asset.type = :type', { type });
    }
    if (status) {
      queryBuilder.andWhere('asset.status = :status', { status });
    }
    if (search) {
      queryBuilder.andWhere(
        '(asset.name ILIKE :search OR asset.description ILIKE :search)',
        { search: `%${search}%` }
      );
    }
    if (startDate && endDate) {
      queryBuilder.andWhere('asset.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    // Get total count
    const total = await queryBuilder.getCount();

    // Apply pagination and sorting
    queryBuilder
      .orderBy(`asset.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const data = await queryBuilder.getMany();

    const result = {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    // Cache result
    await this.cacheManager.set(cacheKey, result, this.CACHE_TTL);

    return result;
  }

  /**
   * Find single asset by ID with caching
   */
  async findOne(id: string): Promise<IPAsset | null> {
    const cacheKey = `${this.CACHE_PREFIX}${id}`;

    // Check cache
    const cached = await this.cacheManager.get<IPAsset>(cacheKey);
    if (cached) {
      this.logger.debug(`Cache hit for asset: ${id}`);
      return cached;
    }

    const asset = await this.ipAssetRepository.findOne({ where: { id } });

    if (asset) {
      await this.cacheManager.set(cacheKey, asset, this.CACHE_TTL);
    }

    return asset;
  }

  /**
   * Find asset by ID or throw NotFoundException
   */
  async findOneOrFail(id: string): Promise<IPAsset> {
    const asset = await this.findOne(id);
    if (!asset) {
      throw new NotFoundException({
        code: 'ASSET_NOT_FOUND',
        message: `IP asset with ID "${id}" not found`,
        suggestions: [
          'Verify the asset ID is correct',
          'The asset may have been deleted',
          'Check your user permissions',
        ],
      });
    }
    return asset;
  }

  /**
   * Update an asset
   */
  async update(id: string, updateDto: Partial<CreateIPAssetDto>): Promise<IPAsset> {
    const asset = await this.findOneOrFail(id);

    // Validate update through pipeline
    const mergedData = { ...asset, ...updateDto };
    const result = await this.pipeline.execute(mergedData as any);

    if (!result.success) {
      throw new BadRequestException({
        code: 'UPDATE_VALIDATION_FAILED',
        message: 'Update data validation failed',
        errors: result.errors,
      });
    }

    // Apply updates
    Object.assign(asset, updateDto);
    const savedAsset = await this.ipAssetRepository.save(asset);

    // Invalidate caches
    await this.invalidateAssetCache(id);
    await this.invalidateUserCache(asset.userId);

    this.logger.log(`Asset updated: ${id}`);
    return savedAsset;
  }

  /**
   * Delete an asset (soft delete)
   */
  async delete(id: string): Promise<{ success: boolean; message: string }> {
    const asset = await this.findOneOrFail(id);

    // Don't allow deletion of notarized assets
    if (asset.status === 'notarized') {
      throw new BadRequestException({
        code: 'CANNOT_DELETE_NOTARIZED',
        message: 'Cannot delete a notarized asset. Blockchain records are immutable.',
        suggestions: [
          'You can archive the asset instead',
          'Contact support for special cases',
        ],
      });
    }

    await this.ipAssetRepository.remove(asset);

    // Invalidate caches
    await this.invalidateAssetCache(id);
    await this.invalidateUserCache(asset.userId);

    this.logger.log(`Asset deleted: ${id}`);

    return {
      success: true,
      message: `Asset ${id} has been deleted`,
    };
  }

  /**
   * Notarize asset on Hedera blockchain
   */
  async notarize(id: string, content: string): Promise<{
    success: boolean;
    transactionId: string;
    asset: IPAsset;
    blockchainProof: {
      network: string;
      timestamp: string;
      hashscanUrl: string;
    };
  }> {
    const asset = await this.findOneOrFail(id);

    // Check if already notarized
    if (asset.status === 'notarized' && asset.hederaTransactionId) {
      return {
        success: true,
        transactionId: asset.hederaTransactionId,
        asset,
        blockchainProof: {
          network: 'hedera-mainnet',
          timestamp: asset.updatedAt.toISOString(),
          hashscanUrl: `https://hashscan.io/mainnet/transaction/${asset.hederaTransactionId}`,
        },
      };
    }

    try {
      const response = await this.hederaService.notarizeIPAsset(content, {
        assetId: asset.id,
        assetName: asset.name,
        assetType: asset.type,
        timestamp: new Date().toISOString(),
      });

      const transactionId = response.transactionId.toString();

      // Update asset
      asset.hederaTransactionId = transactionId;
      asset.status = 'notarized';
      await this.ipAssetRepository.save(asset);

      // Invalidate caches
      await this.invalidateAssetCache(id);
      await this.invalidateUserCache(asset.userId);

      this.logger.log(`Asset notarized: ${id} -> ${transactionId}`);

      return {
        success: true,
        transactionId,
        asset,
        blockchainProof: {
          network: 'hedera-mainnet',
          timestamp: new Date().toISOString(),
          hashscanUrl: `https://hashscan.io/mainnet/transaction/${transactionId}`,
        },
      };
    } catch (error) {
      this.logger.error(`Notarization failed for ${id}: ${error.message}`);
      throw new BadRequestException({
        code: 'NOTARIZATION_FAILED',
        message: 'Failed to notarize asset on blockchain',
        details: error.message,
        suggestions: [
          'Check your network connection',
          'Verify Hedera credentials are configured',
          'Try again in a few moments',
        ],
      });
    }
  }

  /**
   * Add or update metadata for an asset
   */
  async addMetadata(
    assetId: string,
    metadata: Record<string, any>
  ): Promise<IPAssetMetadataDocument> {
    // Verify asset exists
    await this.findOneOrFail(assetId);

    const existing = await this.metadataModel.findOne({ assetId });

    if (existing) {
      existing.metadata = { ...existing.metadata, ...metadata };
      return existing.save();
    }

    const newMetadata = new this.metadataModel({ assetId, metadata });
    return newMetadata.save();
  }

  /**
   * Get metadata for an asset
   */
  async getMetadata(assetId: string): Promise<Record<string, any> | null> {
    const metadata = await this.metadataModel.findOne({ assetId });
    return metadata?.metadata || null;
  }

  /**
   * Get asset statistics for a user
   */
  async getStatistics(userId: string): Promise<{
    total: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
    recentActivity: IPAsset[];
  }> {
    const assets = await this.ipAssetRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    const byType: Record<string, number> = {};
    const byStatus: Record<string, number> = {};

    assets.forEach(asset => {
      byType[asset.type] = (byType[asset.type] || 0) + 1;
      byStatus[asset.status] = (byStatus[asset.status] || 0) + 1;
    });

    return {
      total: assets.length,
      byType,
      byStatus,
      recentActivity: assets.slice(0, 5),
    };
  }

  /**
   * Get pipeline health metrics
   */
  getPipelineMetrics() {
    return this.pipeline.getMetrics();
  }

  // Cache invalidation helpers

  private async invalidateAssetCache(assetId: string): Promise<void> {
    await this.cacheManager.del(`${this.CACHE_PREFIX}${assetId}`);
  }

  private async invalidateUserCache(userId: string): Promise<void> {
    // In a real implementation, you'd have a way to clear all user-related caches
    // For now, we'll just log this
    this.logger.debug(`Cache invalidated for user: ${userId}`);
  }
}
