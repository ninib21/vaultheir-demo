import { Controller, Get, Post, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { AdaptiveService } from './adaptive.service';
import { CircuitBreakerService } from './services/circuit-breaker.service';
import { MetricsService } from './services/metrics.service';
import { IdempotencyService } from './services/idempotency.service';
import { TemporalDeterminismService } from './services/temporal-determinism.service';

@Controller('api/adaptive')
export class AdaptiveController {
  constructor(
    private readonly adaptiveService: AdaptiveService,
    private readonly circuitBreaker: CircuitBreakerService,
    private readonly metrics: MetricsService,
    private readonly idempotency: IdempotencyService,
    private readonly temporal: TemporalDeterminismService,
  ) {}

  /**
   * Health check endpoint
   */
  @Get('health')
  @HttpCode(HttpStatus.OK)
  async getHealth() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'adaptive-ai-enhanced-api',
      version: '1.0.0',
    };
  }

  /**
   * Get Prometheus metrics
   */
  @Get('metrics')
  @HttpCode(HttpStatus.OK)
  async getMetrics() {
    return this.metrics.getPrometheusMetrics();
  }

  /**
   * Get metrics in JSON format
   */
  @Get('metrics/json')
  @HttpCode(HttpStatus.OK)
  async getMetricsJson() {
    const metrics = this.metrics.getAllMetrics();

    return {
      counters: Object.fromEntries(metrics.counters),
      gauges: Object.fromEntries(metrics.gauges),
      histograms: Object.fromEntries(
        Array.from(metrics.histograms.entries()).map(([key, value]) => [
          key,
          {
            count: value.count,
            sum: value.sum,
            mean: value.count > 0 ? value.sum / value.count : 0,
            buckets: Object.fromEntries(value.buckets),
          },
        ]),
      ),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get circuit breaker status
   */
  @Get('circuits')
  @HttpCode(HttpStatus.OK)
  async getCircuits() {
    const allCircuits = this.circuitBreaker.getAllCircuitStatistics();

    return {
      circuits: Object.fromEntries(allCircuits),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get specific circuit breaker status
   */
  @Get('circuits/:key')
  @HttpCode(HttpStatus.OK)
  async getCircuit(@Param('key') key: string) {
    const stats = this.circuitBreaker.getCircuitStatistics(key);

    return {
      circuit: key,
      ...stats,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Reset a circuit breaker
   */
  @Post('circuits/:key/reset')
  @HttpCode(HttpStatus.OK)
  async resetCircuit(@Param('key') key: string) {
    this.circuitBreaker.resetCircuit(key);

    return {
      message: `Circuit ${key} has been reset`,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get idempotency statistics
   */
  @Get('idempotency/stats')
  @HttpCode(HttpStatus.OK)
  async getIdempotencyStats() {
    const stats = await this.idempotency.getStatistics();

    return {
      ...stats,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get temporal determinism statistics
   */
  @Get('temporal/stats')
  @HttpCode(HttpStatus.OK)
  async getTemporalStats() {
    const stats = this.temporal.getStatistics();

    return {
      ...stats,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get comprehensive system status
   */
  @Get('status')
  @HttpCode(HttpStatus.OK)
  async getSystemStatus() {
    const [circuits, idempotencyStats, temporalStats, metricsJson] = await Promise.all([
      this.getCircuits(),
      this.getIdempotencyStats(),
      this.getTemporalStats(),
      this.getMetricsJson(),
    ]);

    return {
      health: 'healthy',
      circuits: circuits.circuits,
      idempotency: idempotencyStats,
      temporal: temporalStats,
      metrics: {
        totalRequests:
          metricsJson.counters['api_requests_total'] || 0,
        totalErrors: metricsJson.counters['api_errors_total'] || 0,
        circuitBreakerRejections:
          metricsJson.counters['circuit_breaker_rejections'] || 0,
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Test idempotency with a sample operation
   */
  @Post('test/idempotency')
  @HttpCode(HttpStatus.OK)
  async testIdempotency(@Body() body: any) {
    const { idempotencyKey, processingDate, data } = body;

    if (!idempotencyKey) {
      return {
        error: 'idempotencyKey is required',
      };
    }

    const context = {
      idempotencyKey,
      processingDate: processingDate || new Date().toISOString().split('T')[0],
      logicalTimestamp: Date.now(),
    };

    const result = await this.idempotency.executeIdempotent(
      async () => {
        // Simulate some work
        return {
          processed: true,
          data,
          processedAt: new Date().toISOString(),
          random: Math.random(), // This should be the same on repeated calls
        };
      },
      context,
      data,
      '/api/adaptive/test/idempotency',
      'POST',
    );

    return {
      result,
      idempotencyKey,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Test circuit breaker
   */
  @Post('test/circuit-breaker')
  @HttpCode(HttpStatus.OK)
  async testCircuitBreaker(@Body() body: any) {
    const { circuitKey, shouldFail } = body;

    if (!circuitKey) {
      return {
        error: 'circuitKey is required',
      };
    }

    try {
      const result = await this.circuitBreaker.execute(circuitKey, async () => {
        if (shouldFail) {
          throw new Error('Simulated failure');
        }
        return { success: true, data: 'Operation completed' };
      });

      return {
        result,
        circuitKey,
        status: 'success',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        error: error.message,
        circuitKey,
        status: 'failed',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Test temporal determinism
   */
  @Post('test/temporal')
  @HttpCode(HttpStatus.OK)
  async testTemporal(@Body() body: any) {
    const { processingDate, data } = body;

    const result = await this.temporal.executeDeterministic(async (context) => {
      return {
        processed: true,
        data,
        context,
        timestamp: new Date().toISOString(),
      };
    }, processingDate);

    return {
      ...result,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Clean up expired idempotency records
   */
  @Post('maintenance/cleanup')
  @HttpCode(HttpStatus.OK)
  async cleanupExpiredRecords() {
    const deleted = await this.idempotency.cleanupExpiredRecords();

    return {
      message: `Cleaned up ${deleted} expired records`,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get adaptive features configuration
   */
  @Get('config')
  @HttpCode(HttpStatus.OK)
  async getConfig() {
    return {
      features: {
        idempotency: {
          enabled: true,
          cacheTTL: 3600,
          retention: 30,
        },
        circuitBreaker: {
          enabled: true,
          failureThreshold: 5,
          successThreshold: 2,
          timeout: 60000,
        },
        temporalDeterminism: {
          enabled: true,
          quantumMs: 1000,
        },
        metrics: {
          enabled: true,
          prometheusEndpoint: '/api/adaptive/metrics',
        },
      },
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }
}
