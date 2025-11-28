/**
 * Data Pipeline Core Framework
 * Robust pipelines that don't break - validation, determinism, schema evolution, monitoring, testing, idempotency
 */

export interface PipelineConfig {
  name: string;
  version: string;
  idempotencyKey?: string;
  processingDate?: string; // Explicit processing date for idempotency
  retryPolicy?: RetryPolicy;
  validationRules?: ValidationRule[];
  schemaVersion?: string;
  monitoringEnabled?: boolean;
}

export interface RetryPolicy {
  maxRetries: number;
  backoffStrategy: 'exponential' | 'linear' | 'fixed';
  initialDelay: number;
  maxDelay: number;
}

export interface ValidationRule {
  field: string;
  validator: (value: any) => boolean;
  errorMessage: string;
  required: boolean;
}

export interface PipelineResult<T = any> {
  success: boolean;
  data?: T;
  errors: PipelineError[];
  warnings: string[];
  metadata: PipelineMetadata;
}

export interface PipelineError {
  stage: string;
  message: string;
  code: string;
  data?: any;
  timestamp: string;
  recoverable: boolean;
}

export interface PipelineMetadata {
  pipelineName: string;
  version: string;
  processingDate: string;
  executionId: string;
  duration: number;
  recordsProcessed: number;
  recordsSucceeded: number;
  recordsFailed: number;
  schemaVersion: string;
}

export interface SchemaEvolution {
  fromVersion: string;
  toVersion: string;
  migration: (data: any) => any;
  backwardCompatible: boolean;
}

/**
 * Base Pipeline Class
 * Implements core pipeline functionality with robustness guarantees
 */
export abstract class BasePipeline<TInput = any, TOutput = any> {
  protected config: PipelineConfig;
  protected schemaEvolutions: Map<string, SchemaEvolution> = new Map();
  protected monitoring: PipelineMonitoring;

  constructor(config: PipelineConfig) {
    this.config = {
      monitoringEnabled: true,
      ...config,
    };
    this.monitoring = new PipelineMonitoring(config.name);
  }

  /**
   * Execute pipeline with full robustness guarantees
   */
  async execute(input: TInput, processingDate?: string): Promise<PipelineResult<TOutput>> {
    const executionId = this.generateExecutionId();
    const startTime = Date.now();
    const actualProcessingDate = processingDate || this.config.processingDate || new Date().toISOString();

    const result: PipelineResult<TOutput> = {
      success: false,
      errors: [],
      warnings: [],
      metadata: {
        pipelineName: this.config.name,
        version: this.config.version,
        processingDate: actualProcessingDate,
        executionId,
        duration: 0,
        recordsProcessed: 0,
        recordsSucceeded: 0,
        recordsFailed: 0,
        schemaVersion: this.config.schemaVersion || '1.0.0',
      },
    };

    try {
      // Stage 1: Idempotency Check
      if (this.config.idempotencyKey) {
        const idempotencyResult = await this.checkIdempotency(executionId, actualProcessingDate);
        if (idempotencyResult.alreadyProcessed) {
          result.success = true;
          result.data = idempotencyResult.result;
          result.warnings.push('Request was already processed (idempotent)');
          return result;
        }
      }

      // Stage 2: Schema Validation & Evolution
      const schemaResult = await this.validateAndEvolveSchema(input);
      if (!schemaResult.valid) {
        result.errors.push(...schemaResult.errors);
        result.metadata.duration = Date.now() - startTime;
        return result;
      }
      const evolvedInput = schemaResult.evolvedData || input;

      // Stage 3: Input Validation
      const validationResult = this.validateInput(evolvedInput);
      if (!validationResult.valid) {
        result.errors.push(...validationResult.errors);
        result.metadata.duration = Date.now() - startTime;
        return result;
      }

      // Stage 4: Deterministic Processing
      const processingResult = await this.processDeterministically(evolvedInput, actualProcessingDate);
      if (!processingResult.success) {
        result.errors.push(...processingResult.errors);
        result.metadata.duration = Date.now() - startTime;
        return result;
      }

      // Stage 5: Output Validation
      const outputValidation = this.validateOutput(processingResult.data!);
      if (!outputValidation.valid) {
        result.errors.push(...outputValidation.errors);
        result.metadata.duration = Date.now() - startTime;
        return result;
      }

      // Stage 6: Record Idempotency
      if (this.config.idempotencyKey) {
        await this.recordIdempotency(executionId, actualProcessingDate, processingResult.data!);
      }

      // Success
      result.success = true;
      result.data = processingResult.data;
      result.warnings.push(...processingResult.warnings);
      result.metadata.recordsProcessed = 1;
      result.metadata.recordsSucceeded = 1;
      result.metadata.duration = Date.now() - startTime;

      // Monitoring
      if (this.config.monitoringEnabled) {
        await this.monitoring.recordSuccess(result.metadata);
      }

      return result;
    } catch (error: any) {
      const pipelineError: PipelineError = {
        stage: 'execution',
        message: error.message || 'Unknown error',
        code: 'EXECUTION_ERROR',
        timestamp: new Date().toISOString(),
        recoverable: false,
      };

      result.errors.push(pipelineError);
      result.metadata.duration = Date.now() - startTime;
      result.metadata.recordsFailed = 1;

      if (this.config.monitoringEnabled) {
        await this.monitoring.recordError(pipelineError, result.metadata);
      }

      return result;
    }
  }

  /**
   * Check idempotency - ensure same request processed only once
   */
  protected async checkIdempotency(
    executionId: string,
    processingDate: string
  ): Promise<{ alreadyProcessed: boolean; result?: TOutput }> {
    // In production, this would check a database/cache
    // For now, return not processed
    return { alreadyProcessed: false };
  }

  /**
   * Record idempotency result
   */
  protected async recordIdempotency(
    executionId: string,
    processingDate: string,
    result: TOutput
  ): Promise<void> {
    // In production, this would store in database/cache
    // Implementation depends on storage backend
  }

  /**
   * Validate and evolve schema
   */
  protected async validateAndEvolveSchema(input: any): Promise<{
    valid: boolean;
    errors: PipelineError[];
    evolvedData?: any;
  }> {
    const errors: PipelineError[] = [];

    // Check if schema evolution is needed
    const inputSchemaVersion = input.schemaVersion || '1.0.0';
    const currentSchemaVersion = this.config.schemaVersion || '1.0.0';

    if (inputSchemaVersion !== currentSchemaVersion) {
      const evolution = this.schemaEvolutions.get(`${inputSchemaVersion}->${currentSchemaVersion}`);
      if (evolution) {
        try {
          const evolvedData = evolution.migration(input);
          return { valid: true, errors: [], evolvedData };
        } catch (error: any) {
          errors.push({
            stage: 'schema_evolution',
            message: `Schema evolution failed: ${error.message}`,
            code: 'SCHEMA_EVOLUTION_ERROR',
            timestamp: new Date().toISOString(),
            recoverable: !evolution.backwardCompatible,
          });
        }
      } else if (!this.isBackwardCompatible(inputSchemaVersion, currentSchemaVersion)) {
        errors.push({
          stage: 'schema_validation',
          message: `Schema version mismatch: ${inputSchemaVersion} -> ${currentSchemaVersion}. Migration not available.`,
          code: 'SCHEMA_VERSION_MISMATCH',
          timestamp: new Date().toISOString(),
          recoverable: false,
        });
      }
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Validate input data
   */
  protected validateInput(input: TInput): { valid: boolean; errors: PipelineError[] } {
    const errors: PipelineError[] = [];

    if (!this.config.validationRules) {
      return { valid: true, errors };
    }

    for (const rule of this.config.validationRules) {
      const value = (input as any)[rule.field];

      if (rule.required && (value === undefined || value === null)) {
        errors.push({
          stage: 'input_validation',
          message: rule.errorMessage || `Required field '${rule.field}' is missing`,
          code: 'REQUIRED_FIELD_MISSING',
          timestamp: new Date().toISOString(),
          recoverable: false,
        });
        continue;
      }

      if (value !== undefined && value !== null && !rule.validator(value)) {
        errors.push({
          stage: 'input_validation',
          message: rule.errorMessage || `Validation failed for field '${rule.field}'`,
          code: 'VALIDATION_FAILED',
          data: { field: rule.field, value },
          timestamp: new Date().toISOString(),
          recoverable: false,
        });
      }
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Process data deterministically
   * Must produce same output for same input + processing date
   */
  protected abstract processDeterministically(
    input: TInput,
    processingDate: string
  ): Promise<{ success: boolean; data?: TOutput; errors: PipelineError[]; warnings: string[] }>;

  /**
   * Validate output data
   */
  protected validateOutput(output: TOutput): { valid: boolean; errors: PipelineError[] } {
    // Override in subclasses for specific output validation
    return { valid: true, errors: [] };
  }

  /**
   * Check backward compatibility
   */
  protected isBackwardCompatible(fromVersion: string, toVersion: string): boolean {
    // Simple version comparison - can be enhanced
    return fromVersion <= toVersion;
  }

  /**
   * Generate execution ID
   */
  protected generateExecutionId(): string {
    return `${this.config.name}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  }

  /**
   * Register schema evolution
   */
  registerSchemaEvolution(evolution: SchemaEvolution): void {
    const key = `${evolution.fromVersion}->${evolution.toVersion}`;
    this.schemaEvolutions.set(key, evolution);
  }
}

/**
 * Pipeline Monitoring
 */
export class PipelineMonitoring {
  private pipelineName: string;
  private metrics: Map<string, any> = new Map();

  constructor(pipelineName: string) {
    this.pipelineName = pipelineName;
  }

  async recordSuccess(metadata: PipelineMetadata): Promise<void> {
    // In production, send to monitoring system (Prometheus, DataDog, etc.)
    console.log(`[Pipeline Monitoring] ${this.pipelineName} - Success`, metadata);
  }

  async recordError(error: PipelineError, metadata: PipelineMetadata): Promise<void> {
    // In production, send to error tracking (Sentry, etc.)
    console.error(`[Pipeline Monitoring] ${this.pipelineName} - Error`, { error, metadata });
  }

  getMetrics(): Map<string, any> {
    return this.metrics;
  }
}

