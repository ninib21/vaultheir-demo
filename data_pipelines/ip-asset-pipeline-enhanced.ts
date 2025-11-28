/**
 * ENHANCED IP ASSET PIPELINE - PRODUCTION GRADE
 * 
 * Features:
 * - FAIL FAST with detailed diagnostics
 * - FULLY IDEMPOTENT using explicit processing date
 * - STRICT type enforcement
 * - NO ASSUMPTIONS about unexpected data
 * - Full monitoring and metrics
 */

import { createHash } from 'crypto';
import {
  EnhancedPipeline,
  PipelineConfig,
  PipelineError,
  ValidationRule,
} from './pipeline-core-enhanced';

export interface IPAssetInput {
  name: string;
  type: 'patent' | 'trademark' | 'copyright' | 'trade-secret' | 'legal-document';
  description?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export interface IPAssetOutput {
  id: string;
  name: string;
  type: string;
  description?: string;
  userId: string;
  status: 'pending' | 'notarized' | 'error';
  hederaTransactionId?: string;
  deterministicHash: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

export class EnhancedIPAssetPipeline extends EnhancedPipeline<IPAssetInput, IPAssetOutput> {
  constructor() {
    const config: PipelineConfig = {
      name: 'enhanced-ip-asset-pipeline',
      version: '2.0.0',
      idempotencyKey: 'ip-asset-{name}-{type}-{userId}',
      schemaVersion: '2.0.0',
      monitoringEnabled: true,
      
      // STRICT validation rules with type enforcement
      validationRules: [
        {
          field: 'name',
          validator: (value) => 
            typeof value === 'string' && 
            value.trim().length > 0 && 
            value.trim().length <= 255,
          errorMessage: 'Name must be a non-empty string with max 255 characters',
          required: true,
          errorCode: 'INVALID_NAME',
          expectedType: 'string',
          expectedFormat: '1-255 characters, trimmed',
          examples: ['My Digital Will 2025', 'Family Trust Document'],
        },
        {
          field: 'type',
          validator: (value) =>
            ['patent', 'trademark', 'copyright', 'trade-secret', 'legal-document'].includes(
              String(value).toLowerCase()
            ),
          errorMessage: 
            "Type must be one of: 'patent', 'trademark', 'copyright', 'trade-secret', 'legal-document'",
          required: true,
          errorCode: 'INVALID_TYPE',
          expectedType: 'string',
          expectedFormat: 'lowercase enum value',
          examples: ['patent', 'trademark', 'copyright', 'legal-document'],
        },
        {
          field: 'description',
          validator: (value) =>
            value === undefined || 
            (typeof value === 'string' && value.length <= 5000),
          errorMessage: 'Description must be a string with max 5000 characters',
          required: false,
          errorCode: 'INVALID_DESCRIPTION',
          expectedType: 'string',
          expectedFormat: '0-5000 characters',
        },
        {
          field: 'userId',
          validator: (value) =>
            value === undefined || 
            (typeof value === 'string' && value.length > 0 && value.length <= 100),
          errorMessage: 'UserId must be a string with max 100 characters',
          required: false,
          errorCode: 'INVALID_USER_ID',
          expectedType: 'string',
          expectedFormat: '1-100 characters',
        },
        {
          field: 'metadata',
          validator: (value) =>
            value === undefined || 
            (typeof value === 'object' && value !== null && !Array.isArray(value)),
          errorMessage: 'Metadata must be a plain object (not array, not null)',
          required: false,
          errorCode: 'INVALID_METADATA',
          expectedType: 'object',
          expectedFormat: 'plain object with key-value pairs',
        },
      ],
      
      retryPolicy: {
        maxRetries: 3,
        backoffStrategy: 'exponential',
        initialDelay: 1000,
        maxDelay: 10000,
      },
      
      // FAIL FAST configuration
      failFast: {
        unknownFieldsBehavior: 'reject', // Crash on unknown fields
        typeEnforcementStrict: true, // Strict type checking
        nullHandling: 'reject', // Reject null values explicitly
      },
    };

    super(config);
  }

  /**
   * DETERMINISTIC PROCESSING
   * Same input + processing date = exact same output
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
      // Step 1: Normalize and sanitize (deterministic operations)
      const normalizedName = this.normalizeName(input.name);
      const normalizedType = input.type.toLowerCase() as IPAssetInput['type'];
      const normalizedDescription = input.description?.trim();
      const normalizedUserId = input.userId?.trim() || 'demo-user';

      // Step 2: Business rule validation (FAIL FAST on violations)
      const businessValidation = this.validateBusinessRules({
        ...input,
        name: normalizedName,
        type: normalizedType,
      });

      if (!businessValidation.valid) {
        return { success: false, errors: businessValidation.errors, warnings };
      }

      // Step 3: Generate DETERMINISTIC ID (based on input + processing date)
      const deterministicId = this.generateDeterministicId(
        normalizedName,
        normalizedType,
        normalizedUserId,
        processingDate
      );

      // Step 4: Generate deterministic content hash
      const deterministicHash = this.generateContentHash(
        normalizedName,
        normalizedType,
        normalizedDescription,
        normalizedUserId,
        processingDate
      );

      // Step 5: Create output (deterministic)
      const output: IPAssetOutput = {
        id: deterministicId,
        name: normalizedName,
        type: normalizedType,
        description: normalizedDescription,
        userId: normalizedUserId,
        status: 'pending',
        deterministicHash,
        createdAt: processingDate,
        updatedAt: processingDate,
        metadata: input.metadata,
      };

      // Step 6: Validate output integrity
      const integrityCheck = this.validateOutputIntegrity(output);
      if (!integrityCheck.valid) {
        return { success: false, errors: integrityCheck.errors, warnings };
      }

      return { success: true, data: output, errors: [], warnings };
      
    } catch (error: any) {
      // FAIL FAST: Don't try to recover from unexpected errors
      errors.push({
        stage: 'deterministic_processing',
        message: `PROCESSING CRASH: ${error.message}`,
        code: 'PROCESSING_CRITICAL_ERROR',
        timestamp: new Date().toISOString(),
        recoverable: false,
        stackTrace: error.stack,
      });
      return { success: false, errors, warnings };
    }
  }

  /**
   * Normalize name (deterministic)
   */
  private normalizeName(name: string): string {
    // Trim, normalize whitespace, ensure consistent casing for comparison
    return name.trim().replace(/\s+/g, ' ');
  }

  /**
   * Validate business rules with FAIL FAST approach
   */
  private validateBusinessRules(input: IPAssetInput): {
    valid: boolean;
    errors: PipelineError[];
  } {
    const errors: PipelineError[] = [];

    // Rule 1: Name cannot be only whitespace or special characters
    if (!/[a-zA-Z0-9]/.test(input.name)) {
      errors.push({
        stage: 'business_validation',
        message: `Name "${input.name}" contains no alphanumeric characters. ` +
          `Names must contain at least one letter or number.`,
        code: 'NAME_NO_ALPHANUMERIC',
        timestamp: new Date().toISOString(),
        recoverable: false,
        field: 'name',
        value: input.name,
        expected: 'string with at least one alphanumeric character',
      });
    }

    // Rule 2: Type must be from exact enum (case-insensitive)
    const validTypes = ['patent', 'trademark', 'copyright', 'trade-secret', 'legal-document'];
    if (!validTypes.includes(input.type.toLowerCase())) {
      errors.push({
        stage: 'business_validation',
        message: `Invalid type: "${input.type}". Must be exactly one of: ${validTypes.join(', ')}`,
        code: 'INVALID_TYPE_VALUE',
        timestamp: new Date().toISOString(),
        recoverable: false,
        field: 'type',
        value: input.type,
        expected: validTypes,
      });
    }

    // Rule 3: Description cannot be only whitespace if provided
    if (input.description !== undefined && input.description.trim().length === 0) {
      errors.push({
        stage: 'business_validation',
        message: 'Description provided but contains only whitespace. ' +
          'Either provide a meaningful description or omit the field.',
        code: 'DESCRIPTION_EMPTY',
        timestamp: new Date().toISOString(),
        recoverable: false,
        field: 'description',
        value: input.description,
      });
    }

    // Rule 4: Metadata must not contain reserved keys
    if (input.metadata) {
      const reservedKeys = ['id', 'createdAt', 'updatedAt', 'deterministicHash'];
      const conflictingKeys = Object.keys(input.metadata).filter((key) =>
        reservedKeys.includes(key)
      );

      if (conflictingKeys.length > 0) {
        errors.push({
          stage: 'business_validation',
          message: `Metadata contains reserved keys: [${conflictingKeys.join(', ')}]. ` +
            `Reserved keys are: [${reservedKeys.join(', ')}]`,
          code: 'METADATA_RESERVED_KEYS',
          timestamp: new Date().toISOString(),
          recoverable: false,
          field: 'metadata',
          value: conflictingKeys,
          expected: 'metadata without reserved keys',
        });
      }
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Generate DETERMINISTIC ID
   * Same inputs + processing date = exact same ID
   */
  private generateDeterministicId(
    name: string,
    type: string,
    userId: string,
    processingDate: string
  ): string {
    const data = `${name}|${type}|${userId}|${processingDate}`;
    const hash = createHash('sha256').update(data).digest('hex');
    return `ip-${hash.substring(0, 16)}`;
  }

  /**
   * Generate deterministic content hash
   */
  private generateContentHash(
    name: string,
    type: string,
    description: string | undefined,
    userId: string,
    processingDate: string
  ): string {
    const content = JSON.stringify({
      name,
      type,
      description: description || '',
      userId,
      processingDate,
    });
    return createHash('sha256').update(content).digest('hex');
  }

  /**
   * Validate output integrity
   */
  private validateOutputIntegrity(output: IPAssetOutput): {
    valid: boolean;
    errors: PipelineError[];
  } {
    const errors: PipelineError[] = [];

    // Verify all required fields are present
    if (!output.id) {
      errors.push({
        stage: 'output_integrity',
        message: 'CRITICAL: Output is missing required field "id"',
        code: 'OUTPUT_MISSING_ID',
        timestamp: new Date().toISOString(),
        recoverable: false,
      });
    }

    if (!output.deterministicHash) {
      errors.push({
        stage: 'output_integrity',
        message: 'CRITICAL: Output is missing deterministicHash',
        code: 'OUTPUT_MISSING_HASH',
        timestamp: new Date().toISOString(),
        recoverable: false,
      });
    }

    // Verify timestamps are valid ISO 8601
    try {
      new Date(output.createdAt).toISOString();
      new Date(output.updatedAt).toISOString();
    } catch {
      errors.push({
        stage: 'output_integrity',
        message: 'CRITICAL: Invalid timestamp format in output',
        code: 'OUTPUT_INVALID_TIMESTAMP',
        timestamp: new Date().toISOString(),
        recoverable: false,
      });
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Validate output (called by base class)
   */
  protected validateOutput(output: IPAssetOutput): {
    valid: boolean;
    errors: PipelineError[];
  } {
    const errors: PipelineError[] = [];

    // Validate required fields
    if (!output.id || output.id.length === 0) {
      errors.push({
        stage: 'output_validation',
        message: 'Output must have a non-empty id',
        code: 'OUTPUT_MISSING_ID',
        timestamp: new Date().toISOString(),
        recoverable: false,
      });
    }

    if (!output.name || output.name.trim().length === 0) {
      errors.push({
        stage: 'output_validation',
        message: 'Output must have a non-empty name',
        code: 'OUTPUT_MISSING_NAME',
        timestamp: new Date().toISOString(),
        recoverable: false,
      });
    }

    // Validate status is from allowed set
    const validStatuses = ['pending', 'notarized', 'error'];
    if (!validStatuses.includes(output.status)) {
      errors.push({
        stage: 'output_validation',
        message: `Invalid output status: "${output.status}". Must be one of: ${validStatuses.join(', ')}`,
        code: 'OUTPUT_INVALID_STATUS',
        timestamp: new Date().toISOString(),
        recoverable: false,
        field: 'status',
        value: output.status,
        expected: validStatuses,
      });
    }

    // Validate deterministic hash is present
    if (!output.deterministicHash) {
      errors.push({
        stage: 'output_validation',
        message: 'Output must have a deterministicHash',
        code: 'OUTPUT_MISSING_HASH',
        timestamp: new Date().toISOString(),
        recoverable: false,
      });
    }

    return { valid: errors.length === 0, errors };
  }
}

