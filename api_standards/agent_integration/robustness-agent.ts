/**
 * AI-Agent Enhanced Robustness Middleware
 * Provides intelligent request analysis and validation enhancement
 */

import { ValidationResult } from '../validation_schemas/base-schema';
import { IntelligentErrorHandler, ErrorContext, EnhancedErrorResponse } from '../error_handling/intelligent-error-handler';

export interface RequestAnalysis {
  intent: string;
  confidence: number;
  suggestedCorrections: FieldCorrection[];
  potentialIssues: string[];
  recommendedDefaults: Record<string, any>;
}

export interface FieldCorrection {
  original: string;
  suggested: string;
  confidence: number;
  reason: string;
}

export interface AgentConfig {
  fieldCorrection: boolean;
  intentRecognition: boolean;
  suggestionGeneration: boolean;
  autoCorrection: boolean;
  learningEnabled: boolean;
}

export class RobustnessAgent {
  private errorHandler: IntelligentErrorHandler;
  private config: AgentConfig;
  private fieldMappings: Map<string, string[]>;

  constructor(config: AgentConfig) {
    this.config = config;
    this.errorHandler = new IntelligentErrorHandler();
    this.fieldMappings = new Map();
    this.initializeFieldMappings();
  }

  /**
   * Analyze request pattern and intent
   */
  async analyzeRequestPattern(request: any, endpoint: string): Promise<RequestAnalysis> {
    const analysis: RequestAnalysis = {
      intent: this.detectIntent(request, endpoint),
      confidence: 0.85,
      suggestedCorrections: [],
      potentialIssues: [],
      recommendedDefaults: {},
    };

    // Field name correction
    if (this.config.fieldCorrection) {
      analysis.suggestedCorrections = this.detectFieldNameCorrections(request);
    }

    // Intent recognition
    if (this.config.intentRecognition) {
      analysis.intent = this.detectIntent(request, endpoint);
    }

    // Detect potential issues
    analysis.potentialIssues = this.detectPotentialIssues(request, endpoint);

    // Recommend defaults
    if (this.config.suggestionGeneration) {
      analysis.recommendedDefaults = this.recommendDefaults(request, endpoint);
    }

    return analysis;
  }

  /**
   * Enhance validation with AI agent insights
   */
  async enhanceValidation(
    validationResult: ValidationResult,
    request: any,
    context: ErrorContext
  ): Promise<ValidationResult> {
    if (!this.config.suggestionGeneration) {
      return validationResult;
    }

    // Add intelligent suggestions to errors
    const enhancedErrors = validationResult.errors.map((error) => {
      const suggestion = this.generateFixSuggestion(error, request, context);
      return {
        ...error,
        suggestion: suggestion || error.suggestion,
      };
    });

    return {
      ...validationResult,
      errors: enhancedErrors,
      suggestions: this.generateOverallSuggestions(validationResult, request, context),
    };
  }

  /**
   * Enrich errors with AI-generated guidance
   */
  async enrichErrors(
    validationResult: ValidationResult,
    context: ErrorContext
  ): Promise<EnhancedErrorResponse> {
    return this.errorHandler.generateErrorResponse(validationResult, context);
  }

  /**
   * Apply intelligent defaults to request data
   */
  applyIntelligentDefaults(data: any, endpoint: string): any {
    const defaults: Record<string, any> = {
      billing_cycle: 'monthly',
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    const endpointDefaults: Record<string, Record<string, any>> = {
      '/api/ip-assets': {
        status: 'pending',
        type: 'patent',
      },
      '/api/pricing/calculate': {
        billing_cycle: 'monthly',
      },
    };

    const mergedDefaults = {
      ...defaults,
      ...(endpointDefaults[endpoint] || {}),
    };

    const result = { ...data };
    for (const [key, value] of Object.entries(mergedDefaults)) {
      if (!(key in result) || result[key] === null || result[key] === undefined) {
        result[key] = value;
      }
    }

    return result;
  }

  /**
   * Detect field name corrections
   */
  private detectFieldNameCorrections(request: any): FieldCorrection[] {
    const corrections: FieldCorrection[] = [];

    for (const [correct, variants] of this.fieldMappings.entries()) {
      for (const variant of variants) {
        if (variant in request && !(correct in request)) {
          corrections.push({
            original: variant,
            suggested: correct,
            confidence: 0.9,
            reason: `Common field name variation detected. Use '${correct}' instead of '${variant}'`,
          });
        }
      }
    }

    return corrections;
  }

  /**
   * Detect user intent from request
   */
  private detectIntent(request: any, endpoint: string): string {
    // Simple intent detection based on endpoint and data
    if (endpoint.includes('/notarize')) {
      return 'notarize_ip_asset';
    }
    if (endpoint.includes('/calculate')) {
      return 'calculate_pricing';
    }
    if (endpoint.includes('/roi')) {
      return 'calculate_roi';
    }
    if (endpoint.includes('/ip-assets') && request.method === 'POST') {
      return 'create_ip_asset';
    }
    return 'unknown';
  }

  /**
   * Detect potential issues before validation
   */
  private detectPotentialIssues(request: any, endpoint: string): string[] {
    const issues: string[] = [];

    // Check for common mistakes
    if (request.billing_cycle && !['monthly', 'annual'].includes(request.billing_cycle)) {
      issues.push("billing_cycle should be 'monthly' or 'annual'");
    }

    if (request.tier && !['starter', 'professional', 'enterprise'].includes(request.tier?.toLowerCase())) {
      issues.push("tier should be 'starter', 'professional', or 'enterprise'");
    }

    if (request.type && !['patent', 'trademark', 'copyright', 'trade-secret'].includes(request.type?.toLowerCase())) {
      issues.push("type should be 'patent', 'trademark', 'copyright', or 'trade-secret'");
    }

    return issues;
  }

  /**
   * Recommend sensible defaults
   */
  private recommendDefaults(request: any, endpoint: string): Record<string, any> {
    const defaults: Record<string, any> = {};

    if (endpoint.includes('/ip-assets') && !request.status) {
      defaults.status = 'pending';
    }

    if (endpoint.includes('/pricing') && !request.billing_cycle) {
      defaults.billing_cycle = 'monthly';
    }

    return defaults;
  }

  /**
   * Generate fix suggestion for specific error
   */
  private generateFixSuggestion(error: any, request: any, context: ErrorContext): string | undefined {
    switch (error.code) {
      case 'REQUIRED_FIELD_MISSING':
        return `Add the '${error.field}' field to your request. Example: { "${error.field}": "value" }`;
      case 'TYPE_MISMATCH':
        return `Change '${error.field}' to the correct type. Current: ${typeof request[error.field]}, Expected: ${error.field}`;
      case 'INVALID_ENUM_VALUE':
        return `Use one of the allowed values for '${error.field}': ${error.enum?.join(', ')}`;
      default:
        return error.suggestion;
    }
  }

  /**
   * Generate overall suggestions
   */
  private generateOverallSuggestions(
    validationResult: ValidationResult,
    request: any,
    context: ErrorContext
  ): string[] {
    const suggestions: string[] = [];

    if (validationResult.errors.length > 0) {
      suggestions.push('Review the error details below and correct the issues');
    }

    if (validationResult.warnings.length > 0) {
      suggestions.push('Consider addressing the warnings to improve your request');
    }

    return suggestions;
  }

  /**
   * Initialize field name mappings
   */
  private initializeFieldMappings(): void {
    this.fieldMappings.set('first_name', ['firstName', 'firstname', 'FirstName']);
    this.fieldMappings.set('last_name', ['lastName', 'lastname', 'LastName']);
    this.fieldMappings.set('email', ['eMail', 'Email', 'e-mail']);
    this.fieldMappings.set('ip_asset', ['IPAsset', 'ipAsset', 'ip-asset']);
    this.fieldMappings.set('ip_assets', ['IPAssets', 'ipAssets', 'ip-assets']);
    this.fieldMappings.set('user_id', ['userId', 'userID', 'user-id']);
    this.fieldMappings.set('billing_cycle', ['billingCycle', 'billing-cycle']);
    this.fieldMappings.set('created_at', ['createdAt', 'created-at', 'created']);
    this.fieldMappings.set('updated_at', ['updatedAt', 'updated-at', 'updated']);
  }
}

