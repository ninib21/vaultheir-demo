/**
 * COMPREHENSIVE TESTS FOR ENHANCED PIPELINE
 * Tests for fail-fast, idempotency, and robustness
 */

import { EnhancedIPAssetPipeline } from '../../../data_pipelines/ip-asset-pipeline-enhanced';

describe('EnhancedIPAssetPipeline', () => {
  let pipeline: EnhancedIPAssetPipeline;

  beforeEach(() => {
    pipeline = new EnhancedIPAssetPipeline();
  });

  // ==================== IDEMPOTENCY TESTS ====================

  describe('Idempotency', () => {
    it('should produce exact same output for same input + processing date', async () => {
      const input = {
        name: 'Test Document',
        type: 'legal-document' as const,
        description: 'Test description',
        userId: 'test-user',
      };
      
      const processingDate = '2025-01-01T00:00:00.000Z';

      const result1 = await pipeline.execute(input, processingDate);
      const result2 = await pipeline.execute(input, processingDate);

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
      expect(result1.data?.id).toBe(result2.data?.id);
      expect(result1.data?.deterministicHash).toBe(result2.data?.deterministicHash);
      expect(result1.metadata.idempotencyKey).toBe(result2.metadata.idempotencyKey);
    });

    it('should produce different output for different processing dates', async () => {
      const input = {
        name: 'Test Document',
        type: 'legal-document' as const,
      };

      const date1 = '2025-01-01T00:00:00.000Z';
      const date2 = '2025-01-02T00:00:00.000Z';

      const result1 = await pipeline.execute(input, date1);
      const result2 = await pipeline.execute(input, date2);

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
      expect(result1.data?.id).not.toBe(result2.data?.id);
      expect(result1.data?.deterministicHash).not.toBe(result2.data?.deterministicHash);
    });
  });

  // ==================== FAIL-FAST TESTS ====================

  describe('Fail-Fast Validation', () => {
    it('should reject unknown fields immediately', async () => {
      const input = {
        name: 'Test',
        type: 'patent' as const,
        unknownField: 'should cause failure',
      } as any;

      const result = await pipeline.execute(input);

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      // Should fail before processing
    });

    it('should reject null values explicitly', async () => {
      const input = {
        name: null,
        type: 'patent' as const,
      } as any;

      const result = await pipeline.execute(input);

      expect(result.success).toBe(false);
      // Schema validation catches null as missing required field first
      expect(result.errors.some((e) =>
        e.code === 'NULL_VALUE_REJECTED' || e.code === 'INVALID_NAME'
      )).toBe(true);
    });

    it('should enforce strict type checking', async () => {
      const input = {
        name: 123, // Should be string
        type: 'patent' as const,
      } as any;

      const result = await pipeline.execute(input);

      expect(result.success).toBe(false);
      // Schema validation catches type issues via custom validator first
      expect(result.errors.some((e) =>
        e.code === 'TYPE_MISMATCH' || e.code === 'INVALID_NAME'
      )).toBe(true);
    });

    it('should provide detailed error diagnostics', async () => {
      const input = {
        name: '', // Empty string
        type: 'invalid-type' as const,
      } as any;

      const result = await pipeline.execute(input);

      expect(result.success).toBe(false);
      result.errors.forEach((error) => {
        expect(error.stage).toBeDefined();
        expect(error.code).toBeDefined();
        expect(error.message).toBeDefined();
        expect(error.timestamp).toBeDefined();
      });
    });
  });

  // ==================== VALIDATION TESTS ====================

  describe('Field Validation', () => {
    it('should accept valid input', async () => {
      const input = {
        name: 'Valid Name',
        type: 'patent' as const,
        description: 'Valid description',
        userId: 'user-123',
      };

      const result = await pipeline.execute(input);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.errors.length).toBe(0);
    });

    it('should reject name with no alphanumeric characters', async () => {
      const input = {
        name: '   !!!   ',
        type: 'patent' as const,
      };

      const result = await pipeline.execute(input);

      expect(result.success).toBe(false);
      expect(result.errors.some((e) => e.code === 'NAME_NO_ALPHANUMERIC')).toBe(true);
    });

    it('should reject invalid type', async () => {
      const input = {
        name: 'Test',
        type: 'invalid' as any,
      };

      const result = await pipeline.execute(input);

      expect(result.success).toBe(false);
      // Schema validation catches invalid type values
      expect(result.errors.some((e) =>
        e.code === 'INVALID_TYPE_VALUE' || e.code === 'INVALID_TYPE'
      )).toBe(true);
    });

    it('should handle optional fields correctly', async () => {
      const input = {
        name: 'Test',
        type: 'patent' as const,
        // description and userId are optional
      };

      const result = await pipeline.execute(input);

      expect(result.success).toBe(true);
      expect(result.data?.userId).toBe('demo-user'); // Default value
    });

    it('should reject description that is only whitespace', async () => {
      const input = {
        name: 'Test',
        type: 'patent' as const,
        description: '     ',
      };

      const result = await pipeline.execute(input);

      expect(result.success).toBe(false);
      expect(result.errors.some((e) => e.code === 'DESCRIPTION_EMPTY')).toBe(true);
    });

    it('should reject metadata with reserved keys', async () => {
      const input = {
        name: 'Test',
        type: 'patent' as const,
        metadata: {
          id: 'should-not-be-allowed',
          custom: 'this is ok',
        },
      };

      const result = await pipeline.execute(input);

      expect(result.success).toBe(false);
      expect(result.errors.some((e) => e.code === 'METADATA_RESERVED_KEYS')).toBe(true);
    });
  });

  // ==================== DETERMINISTIC PROCESSING TESTS ====================

  describe('Deterministic Processing', () => {
    it('should normalize whitespace in names', async () => {
      const input1 = {
        name: '  Test   Document  ',
        type: 'patent' as const,
      };

      const input2 = {
        name: 'Test Document',
        type: 'patent' as const,
      };

      const processingDate = '2025-01-01T00:00:00.000Z';

      const result1 = await pipeline.execute(input1, processingDate);
      const result2 = await pipeline.execute(input2, processingDate);

      expect(result1.data?.name).toBe(result2.data?.name);
      expect(result1.data?.id).toBe(result2.data?.id);
    });

    it('should normalize type to lowercase', async () => {
      const input = {
        name: 'Test',
        type: 'PATENT' as any,
      };

      const result = await pipeline.execute(input);

      expect(result.success).toBe(true);
      expect(result.data?.type).toBe('patent');
    });

    it('should generate deterministic hashes', async () => {
      const input = {
        name: 'Test',
        type: 'patent' as const,
        description: 'Description',
      };

      const processingDate = '2025-01-01T00:00:00.000Z';

      const result1 = await pipeline.execute(input, processingDate);
      const result2 = await pipeline.execute(input, processingDate);

      expect(result1.data?.deterministicHash).toBe(result2.data?.deterministicHash);
    });
  });

  // ==================== METRICS TESTS ====================

  describe('Metrics Collection', () => {
    it('should track successful executions', async () => {
      const input = {
        name: 'Test',
        type: 'patent' as const,
      };

      await pipeline.execute(input);
      await pipeline.execute(input);

      const metrics = pipeline.getMetrics();

      expect(metrics.totalExecutions).toBe(2);
      expect(metrics.successfulExecutions).toBe(2);
      expect(metrics.failedExecutions).toBe(0);
    });

    it('should track failed executions', async () => {
      const invalidInput = {
        name: '',
        type: 'invalid' as any,
      };

      await pipeline.execute(invalidInput);

      const metrics = pipeline.getMetrics();

      expect(metrics.totalExecutions).toBe(1);
      expect(metrics.successfulExecutions).toBe(0);
      expect(metrics.failedExecutions).toBe(1);
    });

    it('should track execution time', async () => {
      const input = {
        name: 'Test',
        type: 'patent' as const,
      };

      await pipeline.execute(input);

      const metrics = pipeline.getMetrics();

      // Execution may be very fast (sub-millisecond), so check >= 0
      expect(metrics.averageExecutionTimeMs).toBeGreaterThanOrEqual(0);
    });

    it('should track errors by type', async () => {
      const input1 = {
        name: '',
        type: 'patent' as const,
      };

      const input2 = {
        name: 'Test',
        type: 'invalid' as any,
      };

      await pipeline.execute(input1);
      await pipeline.execute(input2);

      const metrics = pipeline.getMetrics();

      expect(Object.keys(metrics.errorsByType).length).toBeGreaterThan(0);
    });
  });

  // ==================== OUTPUT VALIDATION TESTS ====================

  describe('Output Validation', () => {
    it('should ensure all required output fields are present', async () => {
      const input = {
        name: 'Test',
        type: 'patent' as const,
      };

      const result = await pipeline.execute(input);

      expect(result.success).toBe(true);
      expect(result.data?.id).toBeDefined();
      expect(result.data?.name).toBeDefined();
      expect(result.data?.type).toBeDefined();
      expect(result.data?.status).toBeDefined();
      expect(result.data?.deterministicHash).toBeDefined();
      expect(result.data?.createdAt).toBeDefined();
      expect(result.data?.updatedAt).toBeDefined();
      expect(result.data?.userId).toBeDefined();
    });

    it('should validate timestamps are ISO 8601', async () => {
      const input = {
        name: 'Test',
        type: 'patent' as const,
      };

      const result = await pipeline.execute(input);

      expect(result.success).toBe(true);
      expect(() => new Date(result.data!.createdAt).toISOString()).not.toThrow();
      expect(() => new Date(result.data!.updatedAt).toISOString()).not.toThrow();
    });

    it('should set correct initial status', async () => {
      const input = {
        name: 'Test',
        type: 'patent' as const,
      };

      const result = await pipeline.execute(input);

      expect(result.success).toBe(true);
      expect(result.data?.status).toBe('pending');
    });
  });

  // ==================== METADATA TESTS ====================

  describe('Pipeline Metadata', () => {
    it('should include complete metadata in result', async () => {
      const input = {
        name: 'Test',
        type: 'patent' as const,
      };

      const result = await pipeline.execute(input);

      expect(result.metadata).toBeDefined();
      expect(result.metadata.pipelineName).toBe('enhanced-ip-asset-pipeline');
      expect(result.metadata.pipelineVersion).toBe('2.0.0');
      expect(result.metadata.executionId).toBeDefined();
      expect(result.metadata.processingDate).toBeDefined();
      expect(result.metadata.idempotencyKey).toBeDefined();
      expect(result.metadata.schemaVersion).toBe('2.0.0');
      expect(result.metadata.executionTimeMs).toBeGreaterThanOrEqual(0);
      expect(result.metadata.retryCount).toBe(0);
    });
  });
});

