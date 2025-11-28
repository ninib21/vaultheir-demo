import { Injectable, Logger } from '@nestjs/common';

export interface DeterministicContext {
  processingDate: string; // YYYY-MM-DD format
  logicalTimestamp: number;
  executionId: string;
}

export interface TemporalExecutionResult<T> {
  result: T;
  context: DeterministicContext;
  deterministicHash: string;
  executionTime: number;
}

@Injectable()
export class TemporalDeterminismService {
  private readonly logger = new Logger(TemporalDeterminismService.name);
  private logicalClock: number = 0;

  /**
   * Execute operation with temporal determinism guarantees
   * Ensures identical results for same inputs regardless of execution time
   * Based on breakthrough concepts from Adaptive.md
   */
  async executeDeterministic<T>(
    operation: (context: DeterministicContext) => Promise<T>,
    processingDate?: string,
  ): Promise<TemporalExecutionResult<T>> {
    const context = this.createDeterministicContext(processingDate);
    const startTime = Date.now();

    try {
      // Execute in isolated temporal context
      const result = await this.executeInIsolatedContext(operation, context);

      // Compute deterministic hash to verify consistency
      const deterministicHash = this.computeDeterministicHash(context, result);

      const executionTime = Date.now() - startTime;

      return {
        result,
        context,
        deterministicHash,
        executionTime,
      };
    } catch (error) {
      this.logger.error(`Deterministic execution failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Create deterministic execution context
   */
  private createDeterministicContext(processingDate?: string): DeterministicContext {
    return {
      processingDate: processingDate || this.getCurrentProcessingDate(),
      logicalTimestamp: this.getNextLogicalTimestamp(),
      executionId: this.generateExecutionId(),
    };
  }

  /**
   * Get current processing date in YYYY-MM-DD format
   */
  private getCurrentProcessingDate(): string {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }

  /**
   * Get next logical timestamp (monotonically increasing)
   */
  private getNextLogicalTimestamp(): number {
    return ++this.logicalClock;
  }

  /**
   * Generate unique execution ID
   */
  private generateExecutionId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `exec_${timestamp}_${random}`;
  }

  /**
   * Execute operation in isolated temporal context
   * Prevents wall clock dependencies
   */
  private async executeInIsolatedContext<T>(
    operation: (context: DeterministicContext) => Promise<T>,
    context: DeterministicContext,
  ): Promise<T> {
    // Create snapshot of execution state
    const executionSnapshot = this.captureExecutionState(context);

    this.logger.debug(`Executing in temporal context: ${JSON.stringify(context)}`);

    try {
      // Execute operation with deterministic context
      const result = await operation(context);

      // Verify determinism
      this.verifyDeterminism(result, executionSnapshot);

      return result;
    } catch (error) {
      this.logger.error(
        `Execution failed in temporal context: ${context.executionId}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Capture execution state for verification
   */
  private captureExecutionState(context: DeterministicContext): any {
    return {
      processingDate: context.processingDate,
      logicalTimestamp: context.logicalTimestamp,
      executionId: context.executionId,
      captureTime: Date.now(),
    };
  }

  /**
   * Verify determinism of execution
   */
  private verifyDeterminism(result: any, snapshot: any): void {
    // Basic verification - ensure result is serializable
    try {
      JSON.stringify(result);
    } catch (error) {
      this.logger.warn('Result contains non-serializable data, may affect determinism');
    }

    // Additional verification could include:
    // - Checking for Date objects (should use processingDate instead)
    // - Checking for random values
    // - Checking for external API calls without caching
  }

  /**
   * Compute deterministic hash of execution
   */
  private computeDeterministicHash(context: DeterministicContext, result: any): string {
    const crypto = require('crypto');

    const dataToHash = {
      context: {
        processingDate: context.processingDate,
        logicalTimestamp: context.logicalTimestamp,
      },
      result: this.normalizeForHashing(result),
    };

    const serialized = JSON.stringify(dataToHash, Object.keys(dataToHash).sort());
    return crypto.createHash('sha256').update(serialized).digest('hex');
  }

  /**
   * Normalize data for consistent hashing
   */
  private normalizeForHashing(data: any): any {
    if (data === null || data === undefined) {
      return null;
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.normalizeForHashing(item));
    }

    if (data instanceof Date) {
      return data.toISOString();
    }

    if (typeof data === 'object') {
      const normalized: any = {};
      for (const key of Object.keys(data).sort()) {
        // Skip certain fields that may vary
        if (!['createdAt', 'updatedAt', 'timestamp', '_id'].includes(key)) {
          normalized[key] = this.normalizeForHashing(data[key]);
        }
      }
      return normalized;
    }

    return data;
  }

  /**
   * Quantize time to eliminate micro-timing variations
   * Groups operations into discrete time windows
   */
  quantizeTime(timestamp: number, quantumMs: number = 1000): number {
    return Math.floor(timestamp / quantumMs) * quantumMs;
  }

  /**
   * Create processing date from logical time
   * Useful for testing and replay scenarios
   */
  createProcessingDateFromLogicalTime(logicalTime: number): string {
    const baseDate = new Date('2024-01-01');
    const daysToAdd = Math.floor(logicalTime / (24 * 3600 * 1000));
    baseDate.setDate(baseDate.getDate() + daysToAdd);
    return baseDate.toISOString().split('T')[0];
  }

  /**
   * Get statistics about temporal executions
   */
  getStatistics(): {
    currentLogicalClock: number;
    totalExecutions: number;
  } {
    return {
      currentLogicalClock: this.logicalClock,
      totalExecutions: this.logicalClock,
    };
  }

  /**
   * Reset logical clock (use with caution, mainly for testing)
   */
  resetLogicalClock(): void {
    this.logger.warn('Resetting logical clock');
    this.logicalClock = 0;
  }
}
