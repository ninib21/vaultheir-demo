import { Injectable, Logger } from '@nestjs/common';
import { IdempotencyService, TemporalContext } from './services/idempotency.service';
import { CircuitBreakerService } from './services/circuit-breaker.service';
import { TemporalDeterminismService } from './services/temporal-determinism.service';
import { MetricsService } from './services/metrics.service';

/**
 * Adaptive AI-Enhanced API Service
 * Orchestrates all adaptive features and provides high-level APIs
 */
@Injectable()
export class AdaptiveService {
  private readonly logger = new Logger(AdaptiveService.name);

  constructor(
    private readonly idempotency: IdempotencyService,
    private readonly circuitBreaker: CircuitBreakerService,
    private readonly temporal: TemporalDeterminismService,
    private readonly metrics: MetricsService,
  ) {}

  /**
   * Execute operation with full adaptive protection
   * Combines idempotency, circuit breaker, temporal determinism, and metrics
   */
  async executeWithAdaptiveProtection<T>(
    operation: () => Promise<T>,
    options: {
      idempotencyKey?: string;
      circuitKey?: string;
      processingDate?: string;
      endpoint: string;
      method: string;
      requestData?: any;
      enableIdempotency?: boolean;
      enableCircuitBreaker?: boolean;
      enableTemporal?: boolean;
    },
  ): Promise<T> {
    const {
      idempotencyKey,
      circuitKey,
      processingDate,
      endpoint,
      method,
      requestData,
      enableIdempotency = true,
      enableCircuitBreaker = true,
      enableTemporal = false,
    } = options;

    // Build the execution pipeline
    let executionPipeline: () => Promise<T> = operation;

    // Layer 1: Temporal Determinism (innermost)
    if (enableTemporal) {
      const originalPipeline = executionPipeline;
      executionPipeline = async () => {
        const result = await this.temporal.executeDeterministic(
          async () => await originalPipeline(),
          processingDate,
        );
        return result.result;
      };
    }

    // Layer 2: Circuit Breaker
    if (enableCircuitBreaker && circuitKey) {
      const originalPipeline = executionPipeline;
      executionPipeline = async () => {
        return await this.circuitBreaker.execute(circuitKey, originalPipeline);
      };
    }

    // Layer 3: Idempotency (outermost)
    if (enableIdempotency && idempotencyKey) {
      const context: TemporalContext = {
        idempotencyKey,
        processingDate: processingDate || this.getCurrentProcessingDate(),
        logicalTimestamp: Date.now(),
      };

      const originalPipeline = executionPipeline;
      executionPipeline = async () => {
        return await this.idempotency.executeIdempotent(
          originalPipeline,
          context,
          requestData,
          endpoint,
          method,
        );
      };
    }

    // Execute with metrics
    return await this.metrics.timeOperation(
      `adaptive_operation_${endpoint.replace(/\//g, '_')}`,
      executionPipeline,
      {
        endpoint,
        method,
      },
    );
  }

  /**
   * Analyze request and determine optimal adaptive strategy
   * Implements intelligent adaptation logic from Adaptive.md
   */
  async analyzeAndAdapt(request: {
    endpoint: string;
    method: string;
    data?: any;
    headers?: any;
  }): Promise<{
    strategy: 'fragile' | 'robust' | 'adaptive';
    recommendations: string[];
    features: {
      idempotency: boolean;
      circuitBreaker: boolean;
      temporalDeterminism: boolean;
    };
  }> {
    const { endpoint, method, data, headers } = request;

    // Analyze request patterns
    const isFinancial = endpoint.includes('payment') || endpoint.includes('transaction');
    const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
    const hasIdempotencyKey = headers?.['idempotency-key'];

    // Determine strategy
    let strategy: 'fragile' | 'robust' | 'adaptive' = 'robust';
    const recommendations: string[] = [];
    const features = {
      idempotency: false,
      circuitBreaker: true,
      temporalDeterminism: false,
    };

    // Financial operations should be fragile (fail fast)
    if (isFinancial) {
      strategy = 'fragile';
      recommendations.push('Using fragile strategy for financial operation');
      features.temporalDeterminism = true;
      features.idempotency = true;
    }

    // Mutations should use idempotency
    if (isMutation) {
      features.idempotency = true;
      if (!hasIdempotencyKey) {
        recommendations.push(
          'Consider adding Idempotency-Key header for this mutation operation',
        );
      }
    }

    // High-value operations should use adaptive strategy
    if (endpoint.includes('ip-assets') || endpoint.includes('hedera')) {
      strategy = 'adaptive';
      features.temporalDeterminism = true;
      recommendations.push('Using adaptive strategy for high-value operation');
    }

    return {
      strategy,
      recommendations,
      features,
    };
  }

  /**
   * Get comprehensive system health
   */
  async getSystemHealth(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    components: Record<string, any>;
    metrics: any;
  }> {
    const circuits = this.circuitBreaker.getAllCircuitStatistics();
    const idempotencyStats = await this.idempotency.getStatistics();
    const temporalStats = this.temporal.getStatistics();

    // Check if any circuits are open
    const openCircuits = Array.from(circuits.values()).filter(
      (c) => c.state === 'open',
    ).length;

    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    if (openCircuits > 0) {
      status = openCircuits > 3 ? 'unhealthy' : 'degraded';
    }

    return {
      status,
      components: {
        circuitBreaker: {
          totalCircuits: circuits.size,
          openCircuits,
          status: openCircuits === 0 ? 'healthy' : openCircuits > 3 ? 'unhealthy' : 'degraded',
        },
        idempotency: {
          totalRecords: idempotencyStats.totalRecords,
          successRate: idempotencyStats.successRate,
          status: idempotencyStats.successRate > 0.95 ? 'healthy' : 'degraded',
        },
        temporal: {
          logicalClock: temporalStats.currentLogicalClock,
          totalExecutions: temporalStats.totalExecutions,
          status: 'healthy',
        },
      },
      metrics: {
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Get current processing date
   */
  private getCurrentProcessingDate(): string {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }

  /**
   * Adaptive validation strategy selector
   * Based on concepts from Adaptive.md
   */
  selectValidationStrategy(context: {
    endpoint: string;
    riskLevel: 'low' | 'medium' | 'high';
    operationType: 'read' | 'write' | 'delete';
  }): 'fragile' | 'robust' | 'adaptive' {
    const { endpoint, riskLevel, operationType } = context;

    // High-risk operations should be fragile (fail fast)
    if (riskLevel === 'high' || operationType === 'delete') {
      return 'fragile';
    }

    // Read operations can be more robust
    if (operationType === 'read' && riskLevel === 'low') {
      return 'robust';
    }

    // Everything else uses adaptive strategy
    return 'adaptive';
  }
}
