import { Controller, Get, Post, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { BenchmarkService } from './benchmark.service';

/**
 * Benchmark Controller - Performance Monitoring API
 *
 * Provides endpoints for:
 * - System health monitoring
 * - Performance benchmarking
 * - SLA compliance tracking
 * - Dashboard data aggregation
 */
@ApiTags('Benchmark')
@Controller('benchmark')
@SkipThrottle()
export class BenchmarkController {
  private readonly logger = new Logger('BenchmarkController');

  constructor(private readonly benchmarkService: BenchmarkService) {}

  /**
   * Get current system health status
   */
  @Get('health')
  @ApiOperation({
    summary: 'Get system health',
    description: 'Returns current system health including CPU, memory, and event loop metrics',
  })
  @ApiResponse({
    status: 200,
    description: 'System health data',
    schema: {
      example: {
        status: 'healthy',
        uptime: 3600,
        cpu: { usage: 15.5, loadAverage: [1.2, 0.8, 0.6] },
        memory: { used: 50000000, total: 100000000, percentage: 50 },
        eventLoop: { latency: 1.5, utilizationPercentage: 15 },
      },
    },
  })
  getHealth() {
    return this.benchmarkService.getSystemHealth();
  }

  /**
   * Get SLA compliance metrics
   */
  @Get('sla')
  @ApiOperation({
    summary: 'Get SLA metrics',
    description: 'Returns SLA compliance metrics including availability, response times, and error rates',
  })
  @ApiResponse({
    status: 200,
    description: 'SLA metrics',
    schema: {
      example: {
        availabilityPercentage: 99.99,
        avgResponseTimeMs: 45.5,
        p99ResponseTimeMs: 250,
        errorRate: 0.01,
        uptimeSeconds: 86400,
        slaCompliant: true,
        violations: [],
      },
    },
  })
  getSLA() {
    return this.benchmarkService.getSLAMetrics();
  }

  /**
   * Get all benchmark results
   */
  @Get('results')
  @ApiOperation({
    summary: 'Get benchmark results',
    description: 'Returns all stored benchmark results organized by benchmark name',
  })
  @ApiResponse({
    status: 200,
    description: 'Benchmark results',
  })
  getBenchmarkResults() {
    return this.benchmarkService.getBenchmarkResults();
  }

  /**
   * Get comprehensive dashboard data
   */
  @Get('dashboard')
  @ApiOperation({
    summary: 'Get dashboard data',
    description: 'Returns comprehensive dashboard data including health, SLA, benchmarks, and trends',
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard data',
  })
  getDashboard() {
    return this.benchmarkService.getDashboardData();
  }

  /**
   * Run standard benchmark suite
   */
  @Post('run')
  @ApiOperation({
    summary: 'Run benchmarks',
    description: 'Executes the standard benchmark suite and returns results',
  })
  @ApiResponse({
    status: 200,
    description: 'Benchmark execution results',
  })
  async runBenchmarks() {
    this.logger.log('Running standard benchmark suite...');
    const results = await this.benchmarkService.runStandardBenchmarks();
    return {
      message: 'Benchmarks completed',
      results,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Run custom benchmark
   */
  @Post('run/custom')
  @ApiOperation({
    summary: 'Run custom benchmark',
    description: 'Run a custom operation benchmark with specified iterations',
  })
  @ApiQuery({ name: 'name', required: true, description: 'Benchmark name' })
  @ApiQuery({ name: 'iterations', required: false, description: 'Number of iterations (default: 100)' })
  @ApiQuery({ name: 'type', required: true, description: 'Benchmark type: cpu, memory, json, hash' })
  @ApiResponse({
    status: 200,
    description: 'Custom benchmark results',
  })
  async runCustomBenchmark(
    @Query('name') name: string,
    @Query('iterations') iterations: string = '100',
    @Query('type') type: string
  ) {
    const iterationCount = parseInt(iterations, 10) || 100;

    let operation: () => any;

    switch (type) {
      case 'cpu':
        operation = () => {
          let sum = 0;
          for (let i = 0; i < 1000; i++) {
            sum += Math.sqrt(i) * Math.sin(i);
          }
          return sum;
        };
        break;
      case 'memory':
        operation = () => {
          return new Array(1000).fill(0).map((_, i) => ({ id: i }));
        };
        break;
      case 'json':
        operation = () => {
          const obj = { data: Array(50).fill({ id: 1, name: 'test' }) };
          return JSON.parse(JSON.stringify(obj));
        };
        break;
      case 'hash':
        operation = () => {
          const crypto = require('crypto');
          return crypto.createHash('sha256').update(`data-${Date.now()}`).digest('hex');
        };
        break;
      default:
        return { error: 'Invalid benchmark type. Use: cpu, memory, json, hash' };
    }

    const result = await this.benchmarkService.runBenchmark(name, operation, iterationCount);

    return {
      message: `Custom benchmark "${name}" completed`,
      result,
    };
  }

  /**
   * Get performance summary
   */
  @Get('summary')
  @ApiOperation({
    summary: 'Get performance summary',
    description: 'Returns a concise summary of system performance',
  })
  @ApiResponse({
    status: 200,
    description: 'Performance summary',
  })
  getSummary() {
    const health = this.benchmarkService.getSystemHealth();
    const sla = this.benchmarkService.getSLAMetrics();

    return {
      status: health.status,
      slaCompliant: sla.slaCompliant,
      metrics: {
        uptime: `${Math.round(health.uptime / 3600)} hours`,
        memoryUsage: `${health.memory.percentage}%`,
        avgResponseTime: `${sla.avgResponseTimeMs}ms`,
        errorRate: `${sla.errorRate}%`,
        p99ResponseTime: `${sla.p99ResponseTimeMs}ms`,
      },
      alerts: sla.violations,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Prometheus metrics endpoint
   */
  @Get('prometheus')
  @ApiOperation({
    summary: 'Get Prometheus metrics',
    description: 'Returns metrics in Prometheus format for scraping',
  })
  @ApiResponse({
    status: 200,
    description: 'Prometheus-formatted metrics',
    content: {
      'text/plain': {
        schema: { type: 'string' },
      },
    },
  })
  getPrometheusMetrics() {
    const health = this.benchmarkService.getSystemHealth();
    const sla = this.benchmarkService.getSLAMetrics();

    const lines: string[] = [];

    // System health metrics
    lines.push('# HELP vaultheir_system_status System health status (1=healthy, 0.5=degraded, 0=critical)');
    lines.push('# TYPE vaultheir_system_status gauge');
    const statusValue = health.status === 'healthy' ? 1 : health.status === 'degraded' ? 0.5 : 0;
    lines.push(`vaultheir_system_status ${statusValue}`);

    // Uptime
    lines.push('# HELP vaultheir_uptime_seconds Server uptime in seconds');
    lines.push('# TYPE vaultheir_uptime_seconds counter');
    lines.push(`vaultheir_uptime_seconds ${health.uptime}`);

    // Memory
    lines.push('# HELP vaultheir_memory_usage_percent Memory usage percentage');
    lines.push('# TYPE vaultheir_memory_usage_percent gauge');
    lines.push(`vaultheir_memory_usage_percent ${health.memory.percentage}`);

    // Response time
    lines.push('# HELP vaultheir_response_time_avg_ms Average response time in ms');
    lines.push('# TYPE vaultheir_response_time_avg_ms gauge');
    lines.push(`vaultheir_response_time_avg_ms ${sla.avgResponseTimeMs}`);

    lines.push('# HELP vaultheir_response_time_p99_ms P99 response time in ms');
    lines.push('# TYPE vaultheir_response_time_p99_ms gauge');
    lines.push(`vaultheir_response_time_p99_ms ${sla.p99ResponseTimeMs}`);

    // Error rate
    lines.push('# HELP vaultheir_error_rate Error rate percentage');
    lines.push('# TYPE vaultheir_error_rate gauge');
    lines.push(`vaultheir_error_rate ${sla.errorRate}`);

    // SLA compliance
    lines.push('# HELP vaultheir_sla_compliant SLA compliance status (1=compliant, 0=violation)');
    lines.push('# TYPE vaultheir_sla_compliant gauge');
    lines.push(`vaultheir_sla_compliant ${sla.slaCompliant ? 1 : 0}`);

    return lines.join('\n');
  }
}
