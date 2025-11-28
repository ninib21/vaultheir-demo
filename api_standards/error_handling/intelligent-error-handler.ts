/**
 * Intelligent Error Handler for VaultHeir™ APIs
 * Provides AI-enhanced error responses with actionable guidance
 */

import { ValidationError, ValidationResult } from '../validation_schemas/base-schema';

export interface ErrorContext {
  endpoint: string;
  method: string;
  requestBody?: any;
  queryParams?: any;
  headers?: any;
  userAgent?: string;
  timestamp: string;
}

export interface EnhancedErrorResponse {
  code: string;
  message: string;
  details: EnhancedErrorDetail[];
  suggestions?: string[];
  documentation?: string;
  migration_help?: MigrationGuidance;
  request_id?: string;
  timestamp: string;
}

export interface EnhancedErrorDetail {
  field: string;
  issue: string;
  current_value?: any;
  expected_format?: string;
  fix_suggestion: string;
  documentation_link?: string;
}

export interface MigrationGuidance {
  deprecated_field?: string;
  replacement_field?: string;
  migration_steps?: string[];
  example?: any;
}

export class IntelligentErrorHandler {
  private errorPatterns: Map<string, (error: ValidationError, context: ErrorContext) => EnhancedErrorDetail>;

  constructor() {
    this.errorPatterns = new Map();
    this.initializeErrorPatterns();
  }

  /**
   * Generate intelligent error response with actionable fixes
   */
  generateErrorResponse(
    validationResult: ValidationResult,
    context: ErrorContext
  ): EnhancedErrorResponse {
    const baseResponse: EnhancedErrorResponse = {
      code: 'VALIDATION_ERROR',
      message: 'Your request contained some issues that need attention',
      details: [],
      timestamp: new Date().toISOString(),
    };

    // Enhance each error with intelligent analysis
    for (const error of validationResult.errors) {
      const enhancedDetail = this.enhanceError(error, context);
      baseResponse.details.push(enhancedDetail);
    }

    // Generate overall suggestions
    baseResponse.suggestions = this.generateSuggestions(validationResult, context);

    // Add documentation links
    baseResponse.documentation = this.getDocumentationLink(context.endpoint);

    // Detect migration needs
    const migration = this.detectMigrationNeeds(validationResult.errors, context);
    if (migration) {
      baseResponse.migration_help = migration;
    }

    return baseResponse;
  }

  /**
   * Enhance individual error with intelligent analysis
   */
  private enhanceError(error: ValidationError, context: ErrorContext): EnhancedErrorDetail {
    const patternHandler = this.errorPatterns.get(error.code);
    if (patternHandler) {
      return patternHandler(error, context);
    }

    // Default enhancement
    return {
      field: error.field,
      issue: error.message,
      fix_suggestion: error.suggestion || 'Please review the field and try again',
      documentation_link: error.documentation,
    };
  }

  /**
   * Generate actionable suggestions based on errors
   */
  private generateSuggestions(validationResult: ValidationResult, context: ErrorContext): string[] {
    const suggestions: string[] = [];

    // Check for common patterns
    const requiredErrors = validationResult.errors.filter((e) => e.code === 'REQUIRED_FIELD_MISSING');
    if (requiredErrors.length > 0) {
      suggestions.push(
        `Missing required fields: ${requiredErrors.map((e) => e.field).join(', ')}. Please include these fields in your request.`
      );
    }

    const typeErrors = validationResult.errors.filter((e) => e.code === 'TYPE_MISMATCH');
    if (typeErrors.length > 0) {
      suggestions.push(
        `Type mismatches detected. Check the data types for: ${typeErrors.map((e) => e.field).join(', ')}`
      );
    }

    // Field name correction suggestions
    const fieldCorrections = this.detectFieldNameCorrections(validationResult, context);
    if (fieldCorrections.length > 0) {
      suggestions.push(
        `Did you mean: ${fieldCorrections.map((c) => `${c.wrong} → ${c.correct}`).join(', ')}?`
      );
    }

    return suggestions;
  }

  /**
   * Detect potential field name corrections
   */
  private detectFieldNameCorrections(
    validationResult: ValidationResult,
    context: ErrorContext
  ): Array<{ wrong: string; correct: string }> {
    const corrections: Array<{ wrong: string; correct: string }> = [];
    const commonMappings: Record<string, string[]> = {
      first_name: ['firstName', 'firstname', 'first_name'],
      email: ['eMail', 'Email', 'e-mail'],
      ip_asset: ['IPAsset', 'ipAsset', 'ip-asset'],
      user_id: ['userId', 'userID', 'user-id'],
    };

    for (const error of validationResult.errors) {
      if (error.code === 'REQUIRED_FIELD_MISSING' || error.code === 'TYPE_MISMATCH') {
        for (const [correct, variants] of Object.entries(commonMappings)) {
          if (variants.includes(error.field)) {
            corrections.push({ wrong: error.field, correct });
            break;
          }
        }
      }
    }

    return corrections;
  }

  /**
   * Detect migration needs for deprecated fields
   */
  private detectMigrationNeeds(
    errors: ValidationError[],
    context: ErrorContext
  ): MigrationGuidance | undefined {
    // Check for deprecated field patterns
    const deprecatedFields: Record<string, string> = {
      old_field_name: 'new_field_name',
    };

    for (const error of errors) {
      if (deprecatedFields[error.field]) {
        return {
          deprecated_field: error.field,
          replacement_field: deprecatedFields[error.field],
          migration_steps: [
            `Replace '${error.field}' with '${deprecatedFields[error.field]}'`,
            'Update your API client to use the new field name',
            'The old field will be removed in a future version',
          ],
          example: {
            [deprecatedFields[error.field]]: 'example_value',
          },
        };
      }
    }

    return undefined;
  }

  /**
   * Get documentation link for endpoint
   */
  private getDocumentationLink(endpoint: string): string {
    return `https://docs.vaultheir.com/api${endpoint}`;
  }

  /**
   * Initialize error pattern handlers
   */
  private initializeErrorPatterns(): void {
    // Required field missing
    this.errorPatterns.set('REQUIRED_FIELD_MISSING', (error, context) => ({
      field: error.field,
      issue: `The field '${error.field}' is required but was not provided`,
      fix_suggestion: `Add '${error.field}' to your request body or query parameters`,
      documentation_link: `${this.getDocumentationLink(context.endpoint)}#${error.field}`,
    }));

    // Type mismatch
    this.errorPatterns.set('TYPE_MISMATCH', (error, context) => {
      const suggestion = error.suggestion || `Ensure '${error.field}' is the correct data type`;
      return {
        field: error.field,
        issue: `The field '${error.field}' has an incorrect data type`,
        current_value: context.requestBody?.[error.field],
        fix_suggestion: suggestion,
        documentation_link: `${this.getDocumentationLink(context.endpoint)}#${error.field}`,
      };
    });

    // Range violation
    this.errorPatterns.set('MIN_VALUE_VIOLATION', (error, context) => ({
      field: error.field,
      issue: `The value for '${error.field}' is too small`,
      current_value: context.requestBody?.[error.field],
      fix_suggestion: error.suggestion || `Use a value that meets the minimum requirement`,
    }));

    this.errorPatterns.set('MAX_VALUE_VIOLATION', (error, context) => ({
      field: error.field,
      issue: `The value for '${error.field}' is too large`,
      current_value: context.requestBody?.[error.field],
      fix_suggestion: error.suggestion || `Use a value that meets the maximum requirement`,
    }));

    // Pattern mismatch
    this.errorPatterns.set('PATTERN_MISMATCH', (error, context) => ({
      field: error.field,
      issue: `The format of '${error.field}' is incorrect`,
      current_value: context.requestBody?.[error.field],
      expected_format: error.suggestion,
      fix_suggestion: `Ensure '${error.field}' matches the required format`,
    }));
  }
}

