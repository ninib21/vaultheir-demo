/**
 * Predictable Robustness Middleware for NestJS
 * Integrates AI-Agent enhanced validation and error handling
 */

import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RobustnessAgent, AgentConfig } from '../../api_standards/agent_integration/robustness-agent';
import { BaseValidationSchema, SchemaDefinition } from '../../api_standards/validation_schemas/base-schema';
import { IntelligentErrorHandler, ErrorContext } from '../../api_standards/error_handling/intelligent-error-handler';

@Injectable()
export class RobustnessMiddleware implements NestMiddleware {
  private agent: RobustnessAgent;
  private errorHandler: IntelligentErrorHandler;
  private schemas: Map<string, BaseValidationSchema> = new Map();

  constructor() {
    const agentConfig: AgentConfig = {
      fieldCorrection: true,
      intentRecognition: true,
      suggestionGeneration: true,
      autoCorrection: false, // Don't auto-correct, just suggest
      learningEnabled: true,
    };

    this.agent = new RobustnessAgent(agentConfig);
    this.errorHandler = new IntelligentErrorHandler();
    this.initializeSchemas();
  }

  use(req: Request, res: Response, next: NextFunction) {
    // Skip for GET requests without body
    if (req.method === 'GET' && !req.body) {
      return next();
    }

    // Process request asynchronously
    this.processRequest(req, res, next).catch((error) => {
      console.error('Robustness middleware error:', error);
      next(error);
    });
  }

  private async processRequest(req: Request, res: Response, next: NextFunction) {
    const endpoint = req.path;
    const method = req.method;

    // Get schema for endpoint
    const schema = this.schemas.get(`${method}:${endpoint}`);
    if (!schema) {
      // No schema defined, proceed
      return next();
    }

    // Create error context
    const context: ErrorContext = {
      endpoint,
      method,
      requestBody: req.body,
      queryParams: req.query,
      headers: req.headers,
      userAgent: req.get('user-agent'),
      timestamp: new Date().toISOString(),
    };

    // Step 1: Pre-validation analysis by AI Agent
    const analysis = await this.agent.analyzeRequestPattern(req.body, endpoint);

    // Step 2: Apply field corrections if needed
    if (analysis.suggestedCorrections.length > 0) {
      // Log corrections but don't auto-apply (developer-friendly)
      console.log('Field name suggestions:', analysis.suggestedCorrections);
    }

    // Step 3: Apply intelligent defaults
    const dataWithDefaults = this.agent.applyIntelligentDefaults(req.body || {}, endpoint);
    req.body = dataWithDefaults;

    // Step 4: Enhanced validation
    const validationResult = schema.validate(req.body);

    // Step 5: Enhance validation with AI insights
    const enhancedResult = await this.agent.enhanceValidation(validationResult, req.body, context);

    // Step 6: Handle validation errors
    if (!enhancedResult.isValid) {
      const errorResponse = await this.agent.enrichErrors(enhancedResult, context);

      // Return developer-friendly error response
      throw new HttpException(
        {
          ...errorResponse,
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST
      );
    }

    // Step 7: Use corrected data if available
    if (enhancedResult.correctedData) {
      req.body = enhancedResult.correctedData;
    }

    // Proceed to next middleware
    next();
  }

  /**
   * Register validation schema for endpoint
   */
  registerSchema(endpoint: string, method: string, schemaDef: SchemaDefinition) {
    const key = `${method}:${endpoint}`;
    const schema = new BaseValidationSchema(schemaDef);
    this.schemas.set(key, schema);
  }

  /**
   * Initialize default schemas
   */
  private initializeSchemas() {
    // IP Assets schema
    this.registerSchema('/api/ip-assets', 'POST', {
      endpoint: '/api/ip-assets',
      method: 'POST',
      strictRequired: ['name', 'type'],
      flexibleOptional: ['description', 'userId'],
      agentEnhanced: {
        fieldCorrection: true,
        intentRecognition: true,
        suggestionGeneration: true,
      },
      validationRules: [
        {
          field: 'name',
          type: 'string',
          required: true,
          min: 1,
          max: 255,
          errorMessage: 'Name must be between 1 and 255 characters',
        },
        {
          field: 'type',
          type: 'enum',
          required: true,
          enum: ['patent', 'trademark', 'copyright', 'trade-secret'],
          errorMessage: "Type must be one of: 'patent', 'trademark', 'copyright', 'trade-secret'",
        },
        {
          field: 'description',
          type: 'string',
          required: false,
          max: 5000,
        },
      ],
    });

    // Pricing calculation schema
    this.registerSchema('/api/pricing/calculate', 'POST', {
      endpoint: '/api/pricing/calculate',
      method: 'POST',
      strictRequired: ['tier', 'assets'],
      flexibleOptional: ['billing_cycle'],
      agentEnhanced: {
        fieldCorrection: true,
        intentRecognition: true,
        suggestionGeneration: true,
      },
      validationRules: [
        {
          field: 'tier',
          type: 'enum',
          required: true,
          enum: ['starter', 'professional', 'enterprise'],
          errorMessage: "Tier must be one of: 'starter', 'professional', 'enterprise'",
        },
        {
          field: 'assets',
          type: 'number',
          required: true,
          min: 0,
          errorMessage: 'Assets must be a non-negative number',
        },
        {
          field: 'billing_cycle',
          type: 'enum',
          required: false,
          enum: ['monthly', 'annual'],
        },
      ],
    });
  }
}

