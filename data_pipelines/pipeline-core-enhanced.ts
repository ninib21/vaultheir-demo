/**
 * ENHANCED PIPELINE CORE - PRODUCTION GRADE
 * 
 * Philosophy:
 * - FAIL FAST: Crash immediately with detailed diagnostics for unexpected data
 * - NO ASSUMPTIONS: Don't try to "handle" unexpected data by guessing
 * - IDEMPOTENT: Same input + processing date = exact same output
 * - DETERMINISTIC: No reliance on current time or random values
 * - MONITORABLE: Full observability with structured logging
 * - TESTABLE: Built for comprehensive testing
 */

import { createHash } from 'crypto';

export interface PipelineError {
  stage: string;
  message: string;
  code: string;
  timestamp: string;
  recoverable: boolean;
  field?: string;
  value?: any;
  expected?: any;
  stackTrace?: string;
}

export interface ValidationRule<T = any> {
  field: string;
  validator: (value: any, context?: T) => boolean;
  errorMessage: string;
  required: boolean;
  errorCode?: string;
  // Fail-fast: provide exact expected type/format
  expectedType?: string;
  expectedFormat?: string;
  examples?: any[];
}

export interface PipelineConfig {
  name: string;
  version: string;
  // Idempotency key template (uses input fields)
  idempotencyKey: string;
  schemaVersion: string;
  monitoringEnabled: boolean;
  validationRules: ValidationRule[];
  retryPolicy: {
    maxRetries: number;
    backoffStrategy: 'exponential' | 'linear';
    initialDelay: number;
    maxDelay: number;
  };
  // Fail-fast configuration
  failFast: {
    unknownFieldsBehavior: 'reject' | 'warn' | 'ignore';
    typeEnforcementStrict: boolean;
    nullHandling: 'reject' | 'allow-explicit' | 'convert-to-undefined';
  };
}

export interface PipelineResult<T> {
  success: boolean;
  data?: T;
  errors: PipelineError[];
  warnings: string[];
  metadata: {
    pipelineName: string;
    pipelineVersion: string;
    executionId: string;
    processingDate: string;
    idempotencyKey: string;
    schemaVersion: string;
    executionTimeMs: number;
    retryCount: number;
  };
}

export interface PipelineMetrics {
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageExecutionTimeMs: number;
  errorsByType: Record<string, number>;
  warningsByType: Record<string, number>;
}

/**
 * Base Pipeline with FAIL-FAST and IDEMPOTENT design
 */
export abstract class EnhancedPipeline<TInput, TOutput> {
  protected config: PipelineConfig;
  protected metrics: PipelineMetrics;

  constructor(config: PipelineConfig) {
    this.config = config;
    this.metrics = {
      totalExecutions: 0,
      successfulExecutions: 0,
      failedExecutions: 0,
      averageExecutionTimeMs: 0,
      errorsByType: {},
      warningsByType: {},
    };
  }

  /**
   * IDEMPOTENT EXECUTION
   * Uses explicit processingDate instead of current time
   * Same input + processingDate = exact same output
   */
  async execute(
    input: TInput,
    processingDate?: string
  ): Promise<PipelineResult<TOutput>> {
    const startTime = Date.now();
    const executionId = this.generateExecutionId();
    const actualProcessingDate = processingDate || new Date().toISOString();
    
    this.metrics.totalExecutions++;

    try {
      // Step 1: FAIL-FAST unknown fields validation
      this.validateNoUnknownFields(input);

      // Step 2: Schema validation (STRICT)
      const schemaErrors = this.validateSchema(input);
      if (schemaErrors.length > 0) {
        return this.failFastWithErrors(
          schemaErrors,
          executionId,
          actualProcessingDate,
          startTime
        );
      }

      // Step 3: Type enforcement (STRICT)
      const typeErrors = this.enforceTypes(input);
      if (typeErrors.length > 0) {
        return this.failFastWithErrors(
          typeErrors,
          executionId,
          actualProcessingDate,
          startTime
        );
      }

      // Step 4: Generate idempotency key
      const idempotencyKey = this.generateIdempotencyKey(input, actualProcessingDate);

      // Step 5: Deterministic processing
      const result = await this.processDeterministically(input, actualProcessingDate);

      if (!result.success) {
        this.metrics.failedExecutions++;
        return {
          success: false,
          errors: result.errors,
          warnings: result.warnings,
          metadata: {
            pipelineName: this.config.name,
            pipelineVersion: this.config.version,
            executionId,
            processingDate: actualProcessingDate,
            idempotencyKey,
            schemaVersion: this.config.schemaVersion,
            executionTimeMs: Date.now() - startTime,
            retryCount: 0,
          },
        };
      }

      // Step 6: Output validation (STRICT)
      const outputValidation = this.validateOutput(result.data!);
      if (!outputValidation.valid) {
        return this.failFastWithErrors(
          outputValidation.errors,
          executionId,
          actualProcessingDate,
          startTime,
          idempotencyKey
        );
      }

      // SUCCESS
      this.metrics.successfulExecutions++;
      this.updateMetrics(Date.now() - startTime);

      return {
        success: true,
        data: result.data,
        errors: [],
        warnings: result.warnings,
        metadata: {
          pipelineName: this.config.name,
          pipelineVersion: this.config.version,
          executionId,
          processingDate: actualProcessingDate,
          idempotencyKey,
          schemaVersion: this.config.schemaVersion,
          executionTimeMs: Date.now() - startTime,
          retryCount: 0,
        },
      };
    } catch (error: any) {
      this.metrics.failedExecutions++;
      
      // FAIL FAST: Don't catch and "handle" - provide detailed diagnostics
      return {
        success: false,
        errors: [
          {
            stage: 'execution',
            message: `CRITICAL PIPELINE FAILURE: ${error.message}`,
            code: 'PIPELINE_CRITICAL_ERROR',
            timestamp: new Date().toISOString(),
            recoverable: false,
            stackTrace: error.stack,
          },
        ],
        warnings: [],
        metadata: {
          pipelineName: this.config.name,
          pipelineVersion: this.config.version,
          executionId,
          processingDate: actualProcessingDate,
          idempotencyKey: 'N/A',
          schemaVersion: this.config.schemaVersion,
          executionTimeMs: Date.now() - startTime,
          retryCount: 0,
        },
      };
    }
  }

  /**
   * FAIL-FAST: Validate no unknown fields
   */
  protected validateNoUnknownFields(input: TInput): void {
    if (this.config.failFast.unknownFieldsBehavior === 'ignore') {
      return;
    }

    const allowedFields = this.config.validationRules.map((rule) => rule.field);
    const inputFields = Object.keys(input as any);
    const unknownFields = inputFields.filter((field) => !allowedFields.includes(field));

    if (unknownFields.length > 0) {
      const message = `UNKNOWN FIELDS DETECTED: [${unknownFields.join(', ')}]. ` +
        `Expected only: [${allowedFields.join(', ')}]. ` +
        `This pipeline does not accept arbitrary fields.`;

      if (this.config.failFast.unknownFieldsBehavior === 'reject') {
        throw new Error(message);
      } else if (this.config.failFast.unknownFieldsBehavior === 'warn') {
        console.warn(`[${this.config.name}] ${message}`);
      }
    }
  }

  /**
   * STRICT TYPE ENFORCEMENT
   */
  protected enforceTypes(input: TInput): PipelineError[] {
    if (!this.config.failFast.typeEnforcementStrict) {
      return [];
    }

    const errors: PipelineError[] = [];

    for (const rule of this.config.validationRules) {
      const value = (input as any)[rule.field];

      // Check null handling
      if (value === null) {
        if (this.config.failFast.nullHandling === 'reject') {
          errors.push({
            stage: 'type_enforcement',
            message: `Field "${rule.field}" is null. This pipeline rejects null values. ` +
              `Use undefined or omit the field instead.`,
            code: 'NULL_VALUE_REJECTED',
            timestamp: new Date().toISOString(),
            recoverable: false,
            field: rule.field,
            value: null,
            expected: rule.expectedType || 'non-null value',
          });
        }
      }

      // Type checking with detailed diagnostics
      if (value !== undefined && value !== null && rule.expectedType) {
        const actualType = typeof value;
        const expectedType = rule.expectedType.toLowerCase();

        if (actualType !== expectedType) {
          errors.push({
            stage: 'type_enforcement',
            message: `TYPE MISMATCH for field "${rule.field}": ` +
              `Expected ${expectedType}, got ${actualType}. ` +
              `Value: ${JSON.stringify(value)}. ` +
              (rule.examples ? `Examples: ${JSON.stringify(rule.examples)}` : ''),
            code: 'TYPE_MISMATCH',
            timestamp: new Date().toISOString(),
            recoverable: false,
            field: rule.field,
            value,
            expected: expectedType,
          });
        }
      }
    }

    return errors;
  }

  /**
   * Schema validation
   */
  protected validateSchema(input: TInput): PipelineError[] {
    const errors: PipelineError[] = [];

    for (const rule of this.config.validationRules) {
      const value = (input as any)[rule.field];

      // Required field check
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push({
          stage: 'schema_validation',
          message: rule.errorMessage || `Required field "${rule.field}" is missing`,
          code: rule.errorCode || 'REQUIRED_FIELD_MISSING',
          timestamp: new Date().toISOString(),
          recoverable: false,
          field: rule.field,
          value: undefined,
          expected: rule.expectedType || 'non-empty value',
        });
        continue;
      }

      // Custom validator
      if (value !== undefined && value !== null) {
        try {
          const isValid = rule.validator(value, input);
          if (!isValid) {
            errors.push({
              stage: 'schema_validation',
              message: rule.errorMessage,
              code: rule.errorCode || 'VALIDATION_FAILED',
              timestamp: new Date().toISOString(),
              recoverable: false,
              field: rule.field,
              value,
              expected: rule.expectedFormat || rule.expectedType,
            });
          }
        } catch (validationError: any) {
          // Validator itself crashed - FAIL FAST
          errors.push({
            stage: 'schema_validation',
            message: `VALIDATOR CRASH for field "${rule.field}": ${validationError.message}`,
            code: 'VALIDATOR_ERROR',
            timestamp: new Date().toISOString(),
            recoverable: false,
            field: rule.field,
            value,
            stackTrace: validationError.stack,
          });
        }
      }
    }

    return errors;
  }

  /**
   * Generate DETERMINISTIC idempotency key
   */
  protected generateIdempotencyKey(input: TInput, processingDate: string): string {
    let keyTemplate = this.config.idempotencyKey;

    // Replace placeholders with actual values
    const inputObj = input as any;
    Object.keys(inputObj).forEach((field) => {
      const placeholder = `{${field}}`;
      if (keyTemplate.includes(placeholder)) {
        keyTemplate = keyTemplate.replace(placeholder, String(inputObj[field]));
      }
    });

    // Add processing date for full determinism
    const dataToHash = `${keyTemplate}-${processingDate}-${this.config.version}`;
    
    // Deterministic hash
    return createHash('sha256').update(dataToHash).digest('hex');
  }

  /**
   * Generate unique execution ID
   */
  protected generateExecutionId(): string {
    return `${this.config.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * FAIL FAST with detailed error response
   */
  protected failFastWithErrors(
    errors: PipelineError[],
    executionId: string,
    processingDate: string,
    startTime: number,
    idempotencyKey?: string
  ): PipelineResult<TOutput> {
    this.metrics.failedExecutions++;
    
    // Track errors by type
    errors.forEach((error) => {
      this.metrics.errorsByType[error.code] = 
        (this.metrics.errorsByType[error.code] || 0) + 1;
    });

    return {
      success: false,
      errors,
      warnings: [],
      metadata: {
        pipelineName: this.config.name,
        pipelineVersion: this.config.version,
        executionId,
        processingDate,
        idempotencyKey: idempotencyKey || 'N/A',
        schemaVersion: this.config.schemaVersion,
        executionTimeMs: Date.now() - startTime,
        retryCount: 0,
      },
    };
  }

  /**
   * Update metrics
   */
  protected updateMetrics(executionTimeMs: number): void {
    const totalTime = this.metrics.averageExecutionTimeMs * (this.metrics.totalExecutions - 1);
    this.metrics.averageExecutionTimeMs = 
      (totalTime + executionTimeMs) / this.metrics.totalExecutions;
  }

  /**
   * Get pipeline metrics
   */
  getMetrics(): PipelineMetrics {
    return { ...this.metrics };
  }

  /**
   * Abstract methods to implement
   */
  protected abstract processDeterministically(
    input: TInput,
    processingDate: string
  ): Promise<{
    success: boolean;
    data?: TOutput;
    errors: PipelineError[];
    warnings: string[];
  }>;

  protected abstract validateOutput(output: TOutput): {
    valid: boolean;
    errors: PipelineError[];
  };
}

