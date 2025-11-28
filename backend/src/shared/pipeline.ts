/**
 * Enhanced Pipeline - Standalone version for Railway deployment
 */

export interface PipelineMetrics {
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageExecutionTimeMs: number;
  errorsByType: Record<string, number>;
}

export interface PipelineError {
  stage: string;
  code: string;
  message: string;
  field?: string;
  value?: any;
  expected?: string;
  timestamp: string;
  recoverable: boolean;
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

export class EnhancedIPAssetPipeline {
  private metrics: PipelineMetrics = {
    totalExecutions: 0,
    successfulExecutions: 0,
    failedExecutions: 0,
    averageExecutionTimeMs: 0,
    errorsByType: {},
  };

  async execute(input: any, processingDate?: string): Promise<PipelineResult<any>> {
    const startTime = Date.now();
    this.metrics.totalExecutions++;

    const now = processingDate || new Date().toISOString();
    const executionId = `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Basic validation
    const errors: PipelineError[] = [];

    if (!input.name || typeof input.name !== 'string' || input.name.trim() === '') {
      errors.push({
        stage: 'validation',
        code: 'INVALID_NAME',
        message: 'Name is required and must be a non-empty string',
        field: 'name',
        value: input.name,
        expected: 'string',
        timestamp: now,
        recoverable: false,
      });
    }

    const validTypes = ['patent', 'trademark', 'copyright', 'trade-secret', 'legal-document'];
    const normalizedType = input.type?.toLowerCase();
    if (!validTypes.includes(normalizedType)) {
      errors.push({
        stage: 'validation',
        code: 'INVALID_TYPE',
        message: `Type must be one of: ${validTypes.join(', ')}`,
        field: 'type',
        value: input.type,
        expected: validTypes.join(' | '),
        timestamp: now,
        recoverable: false,
      });
    }

    if (errors.length > 0) {
      this.metrics.failedExecutions++;
      return {
        success: false,
        errors,
        warnings: [],
        metadata: {
          pipelineName: 'enhanced-ip-asset-pipeline',
          pipelineVersion: '2.0.0',
          executionId,
          processingDate: now,
          idempotencyKey: `${JSON.stringify(input)}-${now}`,
          schemaVersion: '2.0.0',
          executionTimeMs: Date.now() - startTime,
          retryCount: 0,
        },
      };
    }

    // Generate deterministic ID
    const hash = Buffer.from(JSON.stringify({ ...input, processingDate: now })).toString('base64').slice(0, 16);

    const result = {
      id: `asset-${hash}`,
      name: input.name.trim(),
      type: normalizedType,
      description: input.description || '',
      status: 'pending',
      userId: input.userId || 'demo-user',
      deterministicHash: hash,
      createdAt: now,
      updatedAt: now,
      hederaTransactionId: null,
    };

    this.metrics.successfulExecutions++;
    const executionTime = Date.now() - startTime;
    this.metrics.averageExecutionTimeMs =
      (this.metrics.averageExecutionTimeMs * (this.metrics.successfulExecutions - 1) + executionTime) /
      this.metrics.successfulExecutions;

    return {
      success: true,
      data: result,
      errors: [],
      warnings: [],
      metadata: {
        pipelineName: 'enhanced-ip-asset-pipeline',
        pipelineVersion: '2.0.0',
        executionId,
        processingDate: now,
        idempotencyKey: `${JSON.stringify(input)}-${now}`,
        schemaVersion: '2.0.0',
        executionTimeMs: executionTime,
        retryCount: 0,
      },
    };
  }

  getMetrics(): PipelineMetrics {
    return { ...this.metrics };
  }
}
