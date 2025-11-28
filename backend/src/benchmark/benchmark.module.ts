import { Module } from '@nestjs/common';
import { BenchmarkController } from './benchmark.controller';
import { BenchmarkService } from './benchmark.service';

/**
 * Benchmark Module
 *
 * Provides comprehensive performance benchmarking,
 * load testing capabilities, and system health monitoring.
 */
@Module({
  controllers: [BenchmarkController],
  providers: [BenchmarkService],
  exports: [BenchmarkService],
})
export class BenchmarkModule {}
