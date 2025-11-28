import { Injectable, NestMiddleware, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CircuitBreakerService } from '../services/circuit-breaker.service';
import { MetricsService } from '../services/metrics.service';
import { IdempotencyService, TemporalContext } from '../services/idempotency.service';

/**
 * Adaptive AI-Enhanced Middleware
 * Implements production-grade adaptive patterns from Adaptive_AI-Enhanced_API_PR.md
 */
@Injectable()
export class AdaptiveMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AdaptiveMiddleware.name);

  constructor(
    private readonly circuitBreaker: CircuitBreakerService,
    private readonly metrics: MetricsService,
    private readonly idempotency: IdempotencyService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const endpoint = req.path;
    const method = req.method;

    // Skip middleware for certain paths
    if (this.shouldSkip(endpoint)) {
      return next();
    }

    try {
      // Phase 1: Check idempotency for POST/PUT/PATCH requests
      if (['POST', 'PUT', 'PATCH'].includes(method)) {
        const idempotencyKey = req.headers['idempotency-key'] as string;

        if (idempotencyKey) {
          this.logger.debug(`Idempotency key detected: ${idempotencyKey}`);

          const context: TemporalContext = {
            idempotencyKey,
            processingDate: this.getCurrentProcessingDate(),
            logicalTimestamp: Date.now(),
          };

          // Attach context to request for later use
          (req as any).temporalContext = context;
        }
      }

      // Phase 2: Check circuit breaker
      const circuitKey = `${method}:${endpoint}`;
      const isOpen = await this.circuitBreaker.isCircuitOpen(circuitKey);

      if (isOpen) {
        this.metrics.incrementCounter('circuit_breaker_rejections', 1, {
          endpoint,
          method,
        });

        throw new HttpException(
          {
            code: 'CIRCUIT_OPEN',
            message: 'Service temporarily unavailable. Circuit breaker is open.',
            endpoint,
            suggestion: 'Please try again in a few moments',
          },
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      // Phase 3: Record request metrics
      this.metrics.incrementCounter('api_requests_total', 1, {
        endpoint,
        method,
      });

      // Wrap response to capture metrics
      const originalSend = res.send.bind(res);
      res.send = (body: any) => {
        const duration = Date.now() - startTime;
        const status = res.statusCode.toString();

        // Record metrics
        this.metrics.recordTiming('api_request_duration', duration, {
          endpoint,
          method,
          status,
        });

        this.metrics.incrementCounter('api_requests_total', 1, {
          endpoint,
          method,
          status,
        });

        // Update circuit breaker
        if (res.statusCode >= 500) {
          this.circuitBreaker
            .execute(circuitKey, async () => {
              throw new Error('Server error');
            })
            .catch(() => {
              // Intentionally empty - just recording failure
            });
        }

        this.logger.debug(`Request completed: ${method} ${endpoint} [${status}] in ${duration}ms`);

        return originalSend(body);
      };

      next();
    } catch (error) {
      const duration = Date.now() - startTime;

      // Record error metrics
      this.metrics.incrementCounter('api_errors_total', 1, {
        endpoint,
        method,
        error: error.constructor.name,
      });

      this.metrics.recordTiming('api_request_duration', duration, {
        endpoint,
        method,
        status: 'error',
      });

      this.logger.error(`Request failed: ${method} ${endpoint}`, error.stack);

      next(error);
    }
  }

  /**
   * Determine if middleware should be skipped for this endpoint
   */
  private shouldSkip(endpoint: string): boolean {
    const skipPatterns = [
      '/health',
      '/metrics',
      '/api/adaptive/metrics',
      '/api/adaptive/health',
    ];

    return skipPatterns.some((pattern) => endpoint.includes(pattern));
  }

  /**
   * Get current processing date in YYYY-MM-DD format
   */
  private getCurrentProcessingDate(): string {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }
}
