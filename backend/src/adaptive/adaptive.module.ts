import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdaptiveController } from './adaptive.controller';
import { AdaptiveService } from './adaptive.service';
import { IdempotencyService } from './services/idempotency.service';
import { CircuitBreakerService } from './services/circuit-breaker.service';
import { TemporalDeterminismService } from './services/temporal-determinism.service';
import { MetricsService } from './services/metrics.service';
import { AdaptiveMiddleware } from './middleware/adaptive.middleware';
import { IdempotencyRecord } from './entities/idempotency-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IdempotencyRecord])],
  controllers: [AdaptiveController],
  providers: [
    AdaptiveService,
    IdempotencyService,
    CircuitBreakerService,
    TemporalDeterminismService,
    MetricsService,
    AdaptiveMiddleware,
  ],
  exports: [
    AdaptiveService,
    IdempotencyService,
    CircuitBreakerService,
    TemporalDeterminismService,
    MetricsService,
    AdaptiveMiddleware,
  ],
})
export class AdaptiveModule {}
