/**
 * AI-ENHANCED ROBUSTNESS MIDDLEWARE - TERMINAL VELOCITY APIs
 * 
 * Philosophy:
 * - FORGIVING with structure (unknown fields, field order)
 * - STRICT with semantics and validation
 * - AI-enhanced error messages with actionable suggestions
 * - Intent recognition and field correction
 * - Predictable robustness for developer-friendly APIs
 */

import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export interface AIRobustnessConfig {
  enableFieldCorrection: boolean;
  enableIntentRecognition: boolean;
  enableSuggestionGeneration: boolean;
  strictSemantics: boolean;
  unknownFieldHandling: 'ignore' | 'warn' | 'log';
}

export interface FieldCorrectionRule {
  commonMistakes: string[];
  correctField: string;
  examples: any[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  receivedValue?: any;
  expectedType?: string;
  suggestions?: string[];
  documentation?: string;
  examples?: any[];
}

/**
 * AI-Enhanced Robustness Middleware
 * Implements "Predictable Robustness" pattern
 */
@Injectable()
export class AIRobustnessMiddleware implements NestMiddleware {
  private config: AIRobustnessConfig = {
    enableFieldCorrection: true,
    enableIntentRecognition: true,
    enableSuggestionGeneration: true,
    strictSemantics: true,
    unknownFieldHandling: 'log',
  };

  // AI-powered field correction mappings
  private fieldCorrectionMap: Record<string, FieldCorrectionRule> = {
    name: {
      commonMistakes: ['Name', 'NAME', 'asset_name', 'assetName', 'title', 'label'],
      correctField: 'name',
      examples: ['My Digital Will', 'Family Trust Document'],
    },
    type: {
      commonMistakes: ['Type', 'TYPE', 'asset_type', 'assetType', 'category', 'kind'],
      correctField: 'type',
      examples: ['patent', 'trademark', 'copyright', 'legal-document'],
    },
    description: {
      commonMistakes: ['Description', 'DESCRIPTION', 'desc', 'info', 'details', 'summary'],
      correctField: 'description',
      examples: ['A comprehensive estate planning document'],
    },
    userId: {
      commonMistakes: ['UserId', 'USERID', 'user_id', 'user', 'uid', 'owner_id', 'ownerId'],
      correctField: 'userId',
      examples: ['user-123', 'demo-user'],
    },
  };

  use(req: Request, res: Response, next: NextFunction) {
    try {
      // Step 1: Log request for monitoring
      this.logRequest(req);

      // Step 2: AI-enhanced request analysis
      const analysisResult = this.analyzeRequest(req);

      if (analysisResult.needsCorrection) {
        // Step 3: Apply intelligent field corrections
        req.body = this.applyFieldCorrections(req.body, analysisResult.corrections);
        
        // Add warning headers about corrections made
        res.setHeader('X-Field-Corrections-Applied', 'true');
        res.setHeader(
          'X-Corrected-Fields', 
          JSON.stringify(analysisResult.corrections.map(c => c.from))
        );
      }

      // Step 4: Handle unknown fields gracefully
      if (analysisResult.unknownFields.length > 0) {
        this.handleUnknownFields(req, res, analysisResult.unknownFields);
      }

      // Step 5: Enhance request with AI metadata
      (req as any).aiRobustnessMetadata = {
        correctionApplied: analysisResult.needsCorrection,
        corrections: analysisResult.corrections,
        unknownFields: analysisResult.unknownFields,
        processingDate: new Date().toISOString(),
      };

      next();
    } catch (error) {
      next(error);
    }
  }

  /**
   * AI-powered request analysis
   */
  private analyzeRequest(req: Request): {
    needsCorrection: boolean;
    corrections: Array<{ from: string; to: string; confidence: number }>;
    unknownFields: string[];
  } {
    const corrections: Array<{ from: string; to: string; confidence: number }> = [];
    const unknownFields: string[] = [];
    const bodyFields = Object.keys(req.body || {});

    bodyFields.forEach((field) => {
      // Check if field needs correction
      const correction = this.findFieldCorrection(field);
      
      if (correction) {
        corrections.push(correction);
      } else {
        // Check if this is a known field
        const isKnownField = this.isKnownField(field);
        if (!isKnownField) {
          unknownFields.push(field);
        }
      }
    });

    return {
      needsCorrection: corrections.length > 0,
      corrections,
      unknownFields,
    };
  }

  /**
   * Find field correction using AI-powered matching
   */
  private findFieldCorrection(field: string): { from: string; to: string; confidence: number } | null {
    // Exact match check first
    for (const [correctField, rule] of Object.entries(this.fieldCorrectionMap)) {
      if (rule.commonMistakes.includes(field)) {
        return {
          from: field,
          to: correctField,
          confidence: 1.0, // Exact match
        };
      }
    }

    // Fuzzy matching (Levenshtein distance)
    for (const [correctField, rule] of Object.entries(this.fieldCorrectionMap)) {
      const distance = this.levenshteinDistance(field.toLowerCase(), correctField.toLowerCase());
      
      // If very close match (1-2 character difference)
      if (distance <= 2 && distance > 0) {
        return {
          from: field,
          to: correctField,
          confidence: 1.0 - (distance * 0.2), // 80-100% confidence
        };
      }
    }

    return null;
  }

  /**
   * Apply field corrections to request body
   */
  private applyFieldCorrections(
    body: any,
    corrections: Array<{ from: string; to: string; confidence: number }>
  ): any {
    const correctedBody = { ...body };

    corrections.forEach((correction) => {
      if (correction.confidence >= 0.8) {
        // High confidence: apply correction
        correctedBody[correction.to] = correctedBody[correction.from];
        delete correctedBody[correction.from];
      }
    });

    return correctedBody;
  }

  /**
   * Handle unknown fields gracefully
   */
  private handleUnknownFields(req: Request, res: Response, unknownFields: string[]) {
    if (this.config.unknownFieldHandling === 'warn') {
      res.setHeader('X-Unknown-Fields', JSON.stringify(unknownFields));
      res.setHeader('X-Unknown-Fields-Warning', 'Request contains fields that are not recognized');
    } else if (this.config.unknownFieldHandling === 'log') {
      console.warn(`[AIRobustness] Unknown fields in request to ${req.path}:`, unknownFields);
    }
    // 'ignore' does nothing
  }

  /**
   * Check if field is known
   */
  private isKnownField(field: string): boolean {
    const knownFields = Object.keys(this.fieldCorrectionMap);
    return knownFields.includes(field);
  }

  /**
   * Levenshtein distance for fuzzy matching
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * Log request for monitoring
   */
  private logRequest(req: Request) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[AIRobustness] ${req.method} ${req.path}`);
    }
  }
}

/**
 * AI-Enhanced Error Formatter
 * Provides actionable, developer-friendly error messages
 */
export class AIEnhancedErrorFormatter {
  /**
   * Format validation errors with AI-enhanced suggestions
   */
  static formatValidationError(errors: ValidationError[]): {
    message: string;
    code: string;
    errors: Array<{
      field: string;
      message: string;
      receivedValue?: any;
      expectedType?: string;
      suggestions: string[];
      examples: any[];
      documentation?: string;
    }>;
    help: {
      quickFix: string;
      documentation: string;
      commonMistakes: string[];
    };
  } {
    const formattedErrors = errors.map((error) => {
      const suggestions = this.generateSuggestions(error);
      const examples = this.getExamples(error.field);

      return {
        field: error.field,
        message: error.message,
        receivedValue: error.receivedValue,
        expectedType: error.expectedType,
        suggestions,
        examples,
        documentation: this.getDocumentationLink(error.field),
      };
    });

    return {
      message: 'Request validation failed. Please review the errors below and try again.',
      code: 'VALIDATION_ERROR',
      errors: formattedErrors,
      help: {
        quickFix: this.generateQuickFix(errors),
        documentation: 'https://docs.vaultheir.com/api/reference',
        commonMistakes: this.getCommonMistakes(errors),
      },
    };
  }

  /**
   * Generate AI-powered suggestions
   */
  private static generateSuggestions(error: ValidationError): string[] {
    const suggestions: string[] = [];

    // Type-specific suggestions
    if (error.code === 'INVALID_TYPE') {
      suggestions.push(`Try using one of: 'patent', 'trademark', 'copyright', 'legal-document'`);
      suggestions.push(`Ensure the type is lowercase and exactly matches one of the allowed values`);
    }

    if (error.code === 'REQUIRED_FIELD_MISSING') {
      suggestions.push(`Add the "${error.field}" field to your request body`);
      suggestions.push(`Ensure the field name is spelled correctly (case-sensitive)`);
    }

    if (error.code === 'INVALID_NAME') {
      suggestions.push(`Provide a name between 1-255 characters`);
      suggestions.push(`Ensure the name contains at least one alphanumeric character`);
    }

    // Generic suggestions
    suggestions.push(`Check the API documentation for field requirements`);
    suggestions.push(`Verify your request body structure matches the schema`);

    return suggestions;
  }

  /**
   * Get field-specific examples
   */
  private static getExamples(field: string): any[] {
    const exampleMap: Record<string, any[]> = {
      name: ['My Digital Will 2025', 'Family Trust Document', 'Estate Planning Binder'],
      type: ['patent', 'trademark', 'copyright', 'legal-document'],
      description: ['A comprehensive estate planning document for my family'],
      userId: ['user-123', 'demo-user'],
    };

    return exampleMap[field] || [];
  }

  /**
   * Get documentation link for field
   */
  private static getDocumentationLink(field: string): string {
    return `https://docs.vaultheir.com/api/fields/${field}`;
  }

  /**
   * Generate quick fix suggestion
   */
  private static generateQuickFix(errors: ValidationError[]): string {
    if (errors.length === 1) {
      const error = errors[0];
      return `Fix the "${error.field}" field: ${error.message}`;
    }

    return `Fix ${errors.length} validation errors: ${errors.map((e) => e.field).join(', ')}`;
  }

  /**
   * Get common mistakes for these error types
   */
  private static getCommonMistakes(errors: ValidationError[]): string[] {
    const mistakes = [
      'Using incorrect field names (e.g., "Name" instead of "name")',
      'Missing required fields in request body',
      'Sending wrong data types (e.g., number instead of string)',
      'Including null values instead of omitting optional fields',
    ];

    return mistakes;
  }
}

