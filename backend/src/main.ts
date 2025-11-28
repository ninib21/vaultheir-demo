import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { RobustnessMiddleware } from './common/robustness.middleware';
import helmet from 'helmet';
import * as compression from 'compression';

/**
 * VaultHeir Backend Bootstrap - Production Grade
 * Features:
 * - Security hardening (Helmet, CORS, rate limiting)
 * - Performance optimization (compression, caching)
 * - API documentation (Swagger/OpenAPI)
 * - Enhanced validation with AI-powered suggestions
 * - Comprehensive logging and monitoring
 */
async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    bufferLogs: true,
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SECURITY HARDENING
  // ═══════════════════════════════════════════════════════════════════════════

  // Helmet - Security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", process.env.FRONTEND_URL || 'http://localhost:3000'],
        fontSrc: ["'self'", 'https:', 'data:'],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));

  // CORS with strict origin validation
  const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'https://vaultheir.com',
    'https://www.vaultheir.com',
    'https://app.vaultheir.com',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        logger.warn(`Blocked CORS request from: ${origin}`);
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'Idempotency-Key',
      'X-Request-ID',
      'X-Correlation-ID',
    ],
    exposedHeaders: [
      'X-Request-ID',
      'X-Correlation-ID',
      'X-RateLimit-Limit',
      'X-RateLimit-Remaining',
      'X-RateLimit-Reset',
    ],
    maxAge: 86400, // 24 hours
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // PERFORMANCE OPTIMIZATION
  // ═══════════════════════════════════════════════════════════════════════════

  // Compression for all responses
  app.use(compression({
    threshold: 1024, // Only compress responses > 1KB
    level: 6, // Balanced compression level
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    },
  }));

  // Apply robustness middleware globally
  const robustnessMiddleware = new RobustnessMiddleware();
  app.use(robustnessMiddleware.use.bind(robustnessMiddleware));

  // Request ID middleware for tracing
  app.use((req: any, res: any, next: any) => {
    const requestId = req.headers['x-request-id'] ||
      `vh-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    req.requestId = requestId;
    res.setHeader('X-Request-ID', requestId);
    next();
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // VALIDATION PIPELINE
  // ═══════════════════════════════════════════════════════════════════════════

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      stopAtFirstError: false,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.map((error) => {
          const constraints = error.constraints || {};
          const constraintKeys = Object.keys(constraints);

          return {
            field: error.property,
            message: Object.values(constraints).join(', '),
            value: error.value,
            constraints: constraintKeys,
            suggestions: generateFieldSuggestions(error.property, constraintKeys),
          };
        });

        return new BadRequestException({
          code: 'VALIDATION_ERROR',
          message: 'Your request contained some issues that need attention',
          details: formattedErrors,
          timestamp: new Date().toISOString(),
          help: {
            documentation: 'https://docs.vaultheir.com/api/validation',
            support: 'support@vaultheir.com',
          },
        });
      },
    })
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // API DOCUMENTATION (SWAGGER/OPENAPI)
  // ═══════════════════════════════════════════════════════════════════════════

  const swaggerConfig = new DocumentBuilder()
    .setTitle('VaultHeir API')
    .setDescription(`
      ## VaultHeir - Revolutionary IP & Estate Management Platform

      This API provides secure blockchain-powered notarization, IP asset management,
      and estate planning services with enterprise-grade security and reliability.

      ### Features:
      - **Blockchain Notarization**: Immutable proof of existence via Hedera Hashgraph
      - **IP Asset Management**: Create, track, and protect intellectual property
      - **Adaptive Framework**: Idempotency, circuit breakers, temporal determinism
      - **AI-Enhanced Validation**: Smart error messages with suggestions

      ### Authentication:
      All endpoints require authentication via Bearer token unless marked as public.

      ### Rate Limiting:
      - Standard: 100 requests per minute
      - Premium: 1000 requests per minute
      - Enterprise: Unlimited
    `)
    .setVersion('1.0.0')
    .setContact('VaultHeir Support', 'https://vaultheir.com', 'support@vaultheir.com')
    .setLicense('Proprietary', 'https://vaultheir.com/license')
    .addBearerAuth()
    .addApiKey({ type: 'apiKey', name: 'X-API-Key', in: 'header' }, 'api-key')
    .addTag('Health', 'System health and status endpoints')
    .addTag('IP Assets', 'Intellectual property asset management')
    .addTag('Hedera', 'Blockchain notarization services')
    .addTag('Pricing', 'Pricing and ROI calculations')
    .addTag('Adaptive', 'Adaptive framework monitoring and control')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
    },
    customSiteTitle: 'VaultHeir API Documentation',
    customCss: `
      .swagger-ui .topbar { background-color: #1a1a1a; }
      .swagger-ui .topbar .download-url-wrapper { display: none; }
    `,
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // ═══════════════════════════════════════════════════════════════════════════
  // GRACEFUL SHUTDOWN
  // ═══════════════════════════════════════════════════════════════════════════

  app.enableShutdownHooks();

  // ═══════════════════════════════════════════════════════════════════════════
  // START SERVER
  // ═══════════════════════════════════════════════════════════════════════════

  const port = process.env.PORT || 4000;
  await app.listen(port);

  logger.log(`═══════════════════════════════════════════════════════════════════`);
  logger.log(`   VaultHeir Backend API - Production Ready`);
  logger.log(`═══════════════════════════════════════════════════════════════════`);
  logger.log(`   Server:        http://localhost:${port}/api`);
  logger.log(`   Documentation: http://localhost:${port}/api/docs`);
  logger.log(`   Health:        http://localhost:${port}/api/health`);
  logger.log(`   Metrics:       http://localhost:${port}/api/adaptive/metrics`);
  logger.log(`═══════════════════════════════════════════════════════════════════`);
  logger.log(`   Security:      Helmet, CORS, Rate Limiting ACTIVE`);
  logger.log(`   Performance:   Compression, Caching ENABLED`);
  logger.log(`   Monitoring:    Circuit Breakers, Idempotency ENGINE ONLINE`);
  logger.log(`═══════════════════════════════════════════════════════════════════`);
}

/**
 * Generate helpful suggestions based on validation errors
 */
function generateFieldSuggestions(field: string, constraints: string[]): string[] {
  const suggestions: string[] = [];

  const fieldSuggestions: Record<string, string[]> = {
    name: [
      'Name should be 1-255 characters',
      'Avoid special characters except hyphens and underscores',
      'Example: "My Patent Application 2024"',
    ],
    type: [
      'Valid types: patent, trademark, copyright, trade-secret, legal-document',
      'Type is case-insensitive',
    ],
    description: [
      'Description is optional but recommended',
      'Maximum 5000 characters',
      'Provide clear details about your IP asset',
    ],
    userId: [
      'User ID should be a valid UUID format',
      'Example: "550e8400-e29b-41d4-a716-446655440000"',
    ],
    email: [
      'Provide a valid email address',
      'Example: "user@example.com"',
    ],
  };

  if (fieldSuggestions[field]) {
    suggestions.push(...fieldSuggestions[field]);
  }

  if (constraints.includes('isNotEmpty')) {
    suggestions.push(`${field} cannot be empty`);
  }
  if (constraints.includes('isString')) {
    suggestions.push(`${field} must be a text value`);
  }
  if (constraints.includes('isNumber')) {
    suggestions.push(`${field} must be a numeric value`);
  }

  return suggestions;
}

bootstrap();
