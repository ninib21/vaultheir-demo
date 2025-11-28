import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

/**
 * Performance Monitoring Interceptor
 *
 * Features:
 * - Request/response timing
 * - Memory usage tracking
 * - Slow query detection
 * - Error rate monitoring
 * - Prometheus-compatible metrics
 */

interface PerformanceMetrics {
  totalRequests: number;
  totalResponseTime: number;
  errorCount: number;
  slowRequests: number;
  requestsByEndpoint: Map<string, EndpointMetrics>;
}

interface EndpointMetrics {
  count: number;
  totalTime: number;
  minTime: number;
  maxTime: number;
  errorCount: number;
  p50: number[];
  p95: number[];
  p99: number[];
}

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  private readonly logger = new Logger('Performance');
  private metrics: PerformanceMetrics = {
    totalRequests: 0,
    totalResponseTime: 0,
    errorCount: 0,
    slowRequests: 0,
    requestsByEndpoint: new Map(),
  };

  private readonly SLOW_THRESHOLD_MS = 1000; // 1 second
  private readonly SAMPLE_SIZE = 1000;

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const startTime = Date.now();
    const startMemory = process.memoryUsage().heapUsed;

    const endpoint = `${request.method}:${request.route?.path || request.url}`;
    const requestId = request.requestId || 'unknown';

    return next.handle().pipe(
      tap((data) => {
        const duration = Date.now() - startTime;
        const memoryDelta = process.memoryUsage().heapUsed - startMemory;

        this.recordMetrics(endpoint, duration, false);
        this.setResponseHeaders(response, duration, requestId);

        if (duration > this.SLOW_THRESHOLD_MS) {
          this.metrics.slowRequests++;
          this.logger.warn(
            `Slow request detected: ${endpoint} took ${duration}ms (threshold: ${this.SLOW_THRESHOLD_MS}ms)`
          );
        }

        if (process.env.NODE_ENV === 'development') {
          this.logger.debug(
            `${endpoint} completed in ${duration}ms | Memory: ${this.formatBytes(memoryDelta)}`
          );
        }
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        this.recordMetrics(endpoint, duration, true);
        this.metrics.errorCount++;

        this.logger.error(
          `Request failed: ${endpoint} after ${duration}ms | Error: ${error.message}`
        );

        throw error;
      })
    );
  }

  private recordMetrics(endpoint: string, duration: number, isError: boolean): void {
    this.metrics.totalRequests++;
    this.metrics.totalResponseTime += duration;

    if (!this.metrics.requestsByEndpoint.has(endpoint)) {
      this.metrics.requestsByEndpoint.set(endpoint, {
        count: 0,
        totalTime: 0,
        minTime: Infinity,
        maxTime: 0,
        errorCount: 0,
        p50: [],
        p95: [],
        p99: [],
      });
    }

    const endpointMetrics = this.metrics.requestsByEndpoint.get(endpoint)!;
    endpointMetrics.count++;
    endpointMetrics.totalTime += duration;
    endpointMetrics.minTime = Math.min(endpointMetrics.minTime, duration);
    endpointMetrics.maxTime = Math.max(endpointMetrics.maxTime, duration);

    if (isError) {
      endpointMetrics.errorCount++;
    }

    // Keep sliding window for percentile calculations
    this.addToPercentileWindow(endpointMetrics.p50, duration);
    this.addToPercentileWindow(endpointMetrics.p95, duration);
    this.addToPercentileWindow(endpointMetrics.p99, duration);
  }

  private addToPercentileWindow(window: number[], value: number): void {
    window.push(value);
    if (window.length > this.SAMPLE_SIZE) {
      window.shift();
    }
  }

  private setResponseHeaders(response: any, duration: number, requestId: string): void {
    response.setHeader('X-Response-Time', `${duration}ms`);
    response.setHeader('X-Request-ID', requestId);
    response.setHeader('X-Server-Timestamp', new Date().toISOString());
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
    const sign = bytes < 0 ? '-' : '+';
    return `${sign}${parseFloat((Math.abs(bytes) / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  /**
   * Get comprehensive performance metrics
   */
  getMetrics(): Record<string, any> {
    const avgResponseTime =
      this.metrics.totalRequests > 0
        ? this.metrics.totalResponseTime / this.metrics.totalRequests
        : 0;

    const endpointStats: Record<string, any> = {};
    this.metrics.requestsByEndpoint.forEach((metrics, endpoint) => {
      endpointStats[endpoint] = {
        count: metrics.count,
        avgTime: metrics.count > 0 ? metrics.totalTime / metrics.count : 0,
        minTime: metrics.minTime === Infinity ? 0 : metrics.minTime,
        maxTime: metrics.maxTime,
        errorCount: metrics.errorCount,
        errorRate: metrics.count > 0 ? (metrics.errorCount / metrics.count) * 100 : 0,
        p50: this.calculatePercentile(metrics.p50, 50),
        p95: this.calculatePercentile(metrics.p95, 95),
        p99: this.calculatePercentile(metrics.p99, 99),
      };
    });

    return {
      summary: {
        totalRequests: this.metrics.totalRequests,
        avgResponseTime: Math.round(avgResponseTime * 100) / 100,
        errorCount: this.metrics.errorCount,
        errorRate:
          this.metrics.totalRequests > 0
            ? Math.round((this.metrics.errorCount / this.metrics.totalRequests) * 10000) / 100
            : 0,
        slowRequests: this.metrics.slowRequests,
        slowRequestRate:
          this.metrics.totalRequests > 0
            ? Math.round((this.metrics.slowRequests / this.metrics.totalRequests) * 10000) / 100
            : 0,
      },
      endpoints: endpointStats,
      memory: {
        heapUsed: process.memoryUsage().heapUsed,
        heapTotal: process.memoryUsage().heapTotal,
        external: process.memoryUsage().external,
        rss: process.memoryUsage().rss,
      },
      uptime: process.uptime(),
    };
  }

  /**
   * Get Prometheus-formatted metrics
   */
  getPrometheusMetrics(): string {
    const lines: string[] = [];

    // Total requests
    lines.push('# HELP vaultheir_http_requests_total Total HTTP requests');
    lines.push('# TYPE vaultheir_http_requests_total counter');
    lines.push(`vaultheir_http_requests_total ${this.metrics.totalRequests}`);

    // Error count
    lines.push('# HELP vaultheir_http_errors_total Total HTTP errors');
    lines.push('# TYPE vaultheir_http_errors_total counter');
    lines.push(`vaultheir_http_errors_total ${this.metrics.errorCount}`);

    // Response time
    lines.push('# HELP vaultheir_http_response_time_ms HTTP response time in milliseconds');
    lines.push('# TYPE vaultheir_http_response_time_ms gauge');
    const avgTime =
      this.metrics.totalRequests > 0
        ? this.metrics.totalResponseTime / this.metrics.totalRequests
        : 0;
    lines.push(`vaultheir_http_response_time_ms ${avgTime}`);

    // Per-endpoint metrics
    this.metrics.requestsByEndpoint.forEach((metrics, endpoint) => {
      const safeEndpoint = endpoint.replace(/[^a-zA-Z0-9_]/g, '_');
      lines.push(`vaultheir_endpoint_requests_total{endpoint="${safeEndpoint}"} ${metrics.count}`);
      lines.push(`vaultheir_endpoint_errors_total{endpoint="${safeEndpoint}"} ${metrics.errorCount}`);
      lines.push(
        `vaultheir_endpoint_response_time_ms{endpoint="${safeEndpoint}"} ${metrics.count > 0 ? metrics.totalTime / metrics.count : 0}`
      );
    });

    // Memory metrics
    const mem = process.memoryUsage();
    lines.push('# HELP vaultheir_memory_heap_used_bytes Heap memory used');
    lines.push('# TYPE vaultheir_memory_heap_used_bytes gauge');
    lines.push(`vaultheir_memory_heap_used_bytes ${mem.heapUsed}`);

    lines.push('# HELP vaultheir_memory_heap_total_bytes Total heap memory');
    lines.push('# TYPE vaultheir_memory_heap_total_bytes gauge');
    lines.push(`vaultheir_memory_heap_total_bytes ${mem.heapTotal}`);

    return lines.join('\n');
  }

  private calculatePercentile(samples: number[], percentile: number): number {
    if (samples.length === 0) return 0;

    const sorted = [...samples].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  }

  /**
   * Reset all metrics (useful for testing)
   */
  resetMetrics(): void {
    this.metrics = {
      totalRequests: 0,
      totalResponseTime: 0,
      errorCount: 0,
      slowRequests: 0,
      requestsByEndpoint: new Map(),
    };
  }
}

// Export singleton instance for direct access
export const performanceInterceptor = new PerformanceInterceptor();
