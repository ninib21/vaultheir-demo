/**
 * IP Asset Data Pipeline
 * Robust pipeline for processing IP asset data with full validation and idempotency
 */

import {
  BasePipeline,
  PipelineConfig,
  PipelineResult,
  PipelineError,
  ValidationRule,
} from './pipeline-core';

export interface IPAssetInput {
  name: string;
  type: 'patent' | 'trademark' | 'copyright' | 'trade-secret';
  description?: string;
  userId?: string;
  schemaVersion?: string;
}

export interface IPAssetOutput {
  id: string;
  name: string;
  type: string;
  description?: string;
  status: 'pending' | 'notarized' | 'error';
  hederaTransactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export class IPAssetPipeline extends BasePipeline<IPAssetInput, IPAssetOutput> {
  constructor() {
    const config: PipelineConfig = {
      name: 'ip-asset-pipeline',
      version: '1.0.0',
      idempotencyKey: 'ip-asset-{name}-{type}-{userId}',
      schemaVersion: '1.0.0',
      monitoringEnabled: true,
      validationRules: [
        {
          field: 'name',
          validator: (value) => typeof value === 'string' && value.length > 0 && value.length <= 255,
          errorMessage: 'Name must be a non-empty string with max 255 characters',
          required: true,
        },
        {
          field: 'type',
          validator: (value) =>
            ['patent', 'trademark', 'copyright', 'trade-secret'].includes(value?.toLowerCase()),
          errorMessage: "Type must be one of: 'patent', 'trademark', 'copyright', 'trade-secret'",
          required: true,
        },
        {
          field: 'description',
          validator: (value) => value === undefined || (typeof value === 'string' && value.length <= 5000),
          errorMessage: 'Description must be a string with max 5000 characters',
          required: false,
        },
      ],
      retryPolicy: {
        maxRetries: 3,
        backoffStrategy: 'exponential',
        initialDelay: 1000,
        maxDelay: 10000,
      },
    };

    super(config);
  }

  /**
   * Process IP asset deterministically
   */
  protected async processDeterministically(
    input: IPAssetInput,
    processingDate: string
  ): Promise<{
    success: boolean;
    data?: IPAssetOutput;
    errors: PipelineError[];
    warnings: string[];
  }> {
    const errors: PipelineError[] = [];
    const warnings: string[] = [];

    try {
      // Deterministic ID generation based on input + processing date
      const id = this.generateDeterministicId(input, processingDate);

      // Normalize type
      const normalizedType = input.type.toLowerCase() as IPAssetInput['type'];

      // Create output
      const output: IPAssetOutput = {
        id,
        name: input.name.trim(),
        type: normalizedType,
        description: input.description?.trim(),
        status: 'pending',
        createdAt: processingDate,
        updatedAt: processingDate,
      };

      // Validate business rules
      const businessValidation = this.validateBusinessRules(input);
      if (!businessValidation.valid) {
        errors.push(...businessValidation.errors);
        return { success: false, errors, warnings };
      }

      return { success: true, data: output, errors, warnings };
    } catch (error: any) {
      errors.push({
        stage: 'processing',
        message: error.message || 'Processing failed',
        code: 'PROCESSING_ERROR',
        timestamp: new Date().toISOString(),
        recoverable: false,
      });
      return { success: false, errors, warnings };
    }
  }

  /**
   * Validate business rules
   */
  private validateBusinessRules(input: IPAssetInput): {
    valid: boolean;
    errors: PipelineError[];
  } {
    const errors: PipelineError[] = [];

    // Business rule: Name cannot be only whitespace
    if (input.name.trim().length === 0) {
      errors.push({
        stage: 'business_validation',
        message: 'Name cannot be empty or only whitespace',
        code: 'INVALID_NAME',
        timestamp: new Date().toISOString(),
        recoverable: false,
      });
    }

    // Business rule: Type must be valid
    const validTypes = ['patent', 'trademark', 'copyright', 'trade-secret'];
    if (!validTypes.includes(input.type.toLowerCase())) {
      errors.push({
        stage: 'business_validation',
        message: `Invalid type: ${input.type}. Must be one of: ${validTypes.join(', ')}`,
        code: 'INVALID_TYPE',
        timestamp: new Date().toISOString(),
        recoverable: false,
      });
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Generate deterministic ID
   */
  private generateDeterministicId(input: IPAssetInput, processingDate: string): string {
    // Deterministic ID based on input + processing date
    const data = `${input.name}-${input.type}-${input.userId || 'default'}-${processingDate}`;
    // Simple hash (in production, use crypto.createHash)
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `ip-${Math.abs(hash).toString(36)}`;
  }

  /**
   * Validate output
   */
  protected validateOutput(output: IPAssetOutput): { valid: boolean; errors: PipelineError[] } {
    const errors: PipelineError[] = [];

    if (!output.id) {
      errors.push({
        stage: 'output_validation',
        message: 'Output must have an id',
        code: 'MISSING_ID',
        timestamp: new Date().toISOString(),
        recoverable: false,
      });
    }

    if (!output.name) {
      errors.push({
        stage: 'output_validation',
        message: 'Output must have a name',
        code: 'MISSING_NAME',
        timestamp: new Date().toISOString(),
        recoverable: false,
      });
    }

    if (!['pending', 'notarized', 'error'].includes(output.status)) {
      errors.push({
        stage: 'output_validation',
        message: `Invalid status: ${output.status}`,
        code: 'INVALID_STATUS',
        timestamp: new Date().toISOString(),
        recoverable: false,
      });
    }

    return { valid: errors.length === 0, errors };
  }
}

