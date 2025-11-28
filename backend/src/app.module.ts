import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HederaModule } from './hedera/hedera.module';
import { PricingModule } from './pricing/pricing.module';
import { AdaptiveModule } from './adaptive/adaptive.module';
import { AdaptiveMiddleware } from './adaptive/middleware/adaptive.middleware';
import { PerformanceInterceptor } from './common/performance.interceptor';
import { BenchmarkModule } from './benchmark/benchmark.module';

/**
 * VaultHeir Application Module - Demo Configuration
 *
 * Features:
 * - SQLite database for demo (no external DB required)
 * - In-memory caching
 * - Rate limiting with tiered access
 * - Scheduled tasks and background jobs
 * - HTTP client for external integrations
 * - Performance monitoring
 */
@Module({
  imports: [
    // ═══════════════════════════════════════════════════════════════════════════
    // CONFIGURATION
    // ═══════════════════════════════════════════════════════════════════════════
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      cache: true,
      expandVariables: true,
    }),

    // ═══════════════════════════════════════════════════════════════════════════
    // RATE LIMITING - Multi-tier throttling
    // ═══════════════════════════════════════════════════════════════════════════
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            name: 'short',
            ttl: 1000, // 1 second
            limit: 10, // 10 requests per second
          },
          {
            name: 'medium',
            ttl: 60000, // 1 minute
            limit: 100, // 100 requests per minute
          },
          {
            name: 'long',
            ttl: 3600000, // 1 hour
            limit: 1000, // 1000 requests per hour
          },
        ],
        skipIf: () => config.get('NODE_ENV') === 'test',
        errorMessage: 'Rate limit exceeded. Please slow down your requests.',
      }),
    }),

    // ═══════════════════════════════════════════════════════════════════════════
    // DATABASE - SQLite for Demo (No external DB required)
    // ═══════════════════════════════════════════════════════════════════════════
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isDemo = config.get('DEMO_MODE', 'true') === 'true';

        if (isDemo || !config.get('DATABASE_URL')) {
          // Demo mode: Use sql.js (in-memory)
          return {
            type: 'sqljs',
            autoSave: false,
            autoLoadEntities: true,
            synchronize: true,
            logging: false,
          };
        }

        // Production mode: Use PostgreSQL
        return {
          type: 'postgres',
          url: config.get('DATABASE_URL'),
          autoLoadEntities: true,
          synchronize: false,
          logging: false,
          ssl: { rejectUnauthorized: false },
        };
      },
    }),

    // ═══════════════════════════════════════════════════════════════════════════
    // CACHING - In-memory for demo
    // ═══════════════════════════════════════════════════════════════════════════
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get('CACHE_TTL', 300000), // 5 minutes default
        max: config.get('CACHE_MAX_ITEMS', 1000),
        store: 'memory',
      }),
    }),

    // ═══════════════════════════════════════════════════════════════════════════
    // SCHEDULING - Background jobs and tasks
    // ═══════════════════════════════════════════════════════════════════════════
    ScheduleModule.forRoot(),

    // ═══════════════════════════════════════════════════════════════════════════
    // HTTP CLIENT - External API integrations
    // ═══════════════════════════════════════════════════════════════════════════
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        timeout: config.get('HTTP_TIMEOUT', 30000),
        maxRedirects: 5,
        headers: {
          'User-Agent': 'VaultHeir-API/1.0',
        },
      }),
    }),

    // ═══════════════════════════════════════════════════════════════════════════
    // FEATURE MODULES
    // ═══════════════════════════════════════════════════════════════════════════
    HederaModule,
    PricingModule,
    AdaptiveModule,
    BenchmarkModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global rate limiter
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // Performance monitoring interceptor
    {
      provide: APP_INTERCEPTOR,
      useClass: PerformanceInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply adaptive middleware globally for all routes
    consumer.apply(AdaptiveMiddleware).forRoutes('*');
  }
}
