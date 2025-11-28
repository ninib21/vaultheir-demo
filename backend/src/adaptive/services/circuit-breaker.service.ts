import { Injectable, Logger } from '@nestjs/common';

export interface CircuitBreakerConfig {
  failureThreshold: number; // Number of failures before opening circuit
  successThreshold: number; // Number of successes to close circuit
  timeout: number; // Time in ms before attempting to half-open circuit
  monitoringPeriod: number; // Time window for counting failures
}

export enum CircuitState {
  CLOSED = 'closed', // Normal operation
  OPEN = 'open', // Circuit is open, rejecting requests
  HALF_OPEN = 'half_open', // Testing if service is healthy again
}

export interface CircuitStats {
  failures: number;
  successes: number;
  lastFailureTime: number;
  lastSuccessTime: number;
  consecutiveFailures: number;
  consecutiveSuccesses: number;
}

@Injectable()
export class CircuitBreakerService {
  private readonly logger = new Logger(CircuitBreakerService.name);
  private circuits: Map<string, CircuitState> = new Map();
  private stats: Map<string, CircuitStats> = new Map();
  private readonly defaultConfig: CircuitBreakerConfig = {
    failureThreshold: 5,
    successThreshold: 2,
    timeout: 60000, // 1 minute
    monitoringPeriod: 300000, // 5 minutes
  };

  /**
   * Execute operation with circuit breaker protection
   */
  async execute<T>(
    circuitKey: string,
    operation: () => Promise<T>,
    config: Partial<CircuitBreakerConfig> = {},
  ): Promise<T> {
    const finalConfig = { ...this.defaultConfig, ...config };

    // Check circuit state
    const state = await this.getCircuitState(circuitKey, finalConfig);

    if (state === CircuitState.OPEN) {
      throw new Error(`Circuit breaker is OPEN for: ${circuitKey}`);
    }

    try {
      const result = await operation();
      await this.recordSuccess(circuitKey, finalConfig);
      return result;
    } catch (error) {
      await this.recordFailure(circuitKey, finalConfig);
      throw error;
    }
  }

  /**
   * Check if circuit is open for a specific key
   */
  async isCircuitOpen(circuitKey: string, config: Partial<CircuitBreakerConfig> = {}): Promise<boolean> {
    const finalConfig = { ...this.defaultConfig, ...config };
    const state = await this.getCircuitState(circuitKey, finalConfig);
    return state === CircuitState.OPEN;
  }

  /**
   * Get current circuit state
   */
  private async getCircuitState(
    circuitKey: string,
    config: CircuitBreakerConfig,
  ): Promise<CircuitState> {
    const currentState = this.circuits.get(circuitKey) || CircuitState.CLOSED;
    const stats = this.getStats(circuitKey);
    const now = Date.now();

    switch (currentState) {
      case CircuitState.CLOSED:
        // Check if we should open the circuit
        if (
          stats.consecutiveFailures >= config.failureThreshold &&
          now - stats.lastFailureTime < config.monitoringPeriod
        ) {
          this.logger.warn(`Opening circuit for: ${circuitKey}`);
          this.circuits.set(circuitKey, CircuitState.OPEN);
          return CircuitState.OPEN;
        }
        return CircuitState.CLOSED;

      case CircuitState.OPEN:
        // Check if we should attempt to half-open
        if (now - stats.lastFailureTime >= config.timeout) {
          this.logger.log(`Half-opening circuit for: ${circuitKey}`);
          this.circuits.set(circuitKey, CircuitState.HALF_OPEN);
          return CircuitState.HALF_OPEN;
        }
        return CircuitState.OPEN;

      case CircuitState.HALF_OPEN:
        // In half-open state, allow request to test
        return CircuitState.HALF_OPEN;

      default:
        return CircuitState.CLOSED;
    }
  }

  /**
   * Record successful operation
   */
  private async recordSuccess(
    circuitKey: string,
    config: CircuitBreakerConfig,
  ): Promise<void> {
    const stats = this.getStats(circuitKey);
    const currentState = this.circuits.get(circuitKey) || CircuitState.CLOSED;

    stats.successes++;
    stats.consecutiveSuccesses++;
    stats.consecutiveFailures = 0;
    stats.lastSuccessTime = Date.now();

    // If in half-open state and we have enough successes, close the circuit
    if (
      currentState === CircuitState.HALF_OPEN &&
      stats.consecutiveSuccesses >= config.successThreshold
    ) {
      this.logger.log(`Closing circuit for: ${circuitKey}`);
      this.circuits.set(circuitKey, CircuitState.CLOSED);
      stats.consecutiveSuccesses = 0;
      stats.consecutiveFailures = 0;
    }

    this.stats.set(circuitKey, stats);
  }

  /**
   * Record failed operation
   */
  private async recordFailure(
    circuitKey: string,
    config: CircuitBreakerConfig,
  ): Promise<void> {
    const stats = this.getStats(circuitKey);
    const currentState = this.circuits.get(circuitKey) || CircuitState.CLOSED;

    stats.failures++;
    stats.consecutiveFailures++;
    stats.consecutiveSuccesses = 0;
    stats.lastFailureTime = Date.now();

    // If in half-open state and we have a failure, immediately open again
    if (currentState === CircuitState.HALF_OPEN) {
      this.logger.warn(`Re-opening circuit after half-open failure: ${circuitKey}`);
      this.circuits.set(circuitKey, CircuitState.OPEN);
    }

    this.stats.set(circuitKey, stats);
  }

  /**
   * Get or initialize stats for a circuit
   */
  private getStats(circuitKey: string): CircuitStats {
    if (!this.stats.has(circuitKey)) {
      this.stats.set(circuitKey, {
        failures: 0,
        successes: 0,
        lastFailureTime: 0,
        lastSuccessTime: 0,
        consecutiveFailures: 0,
        consecutiveSuccesses: 0,
      });
    }
    return this.stats.get(circuitKey);
  }

  /**
   * Get circuit statistics
   */
  getCircuitStatistics(circuitKey: string): {
    state: CircuitState;
    stats: CircuitStats;
    errorRate: number;
  } {
    const state = this.circuits.get(circuitKey) || CircuitState.CLOSED;
    const stats = this.getStats(circuitKey);
    const total = stats.failures + stats.successes;
    const errorRate = total > 0 ? stats.failures / total : 0;

    return { state, stats, errorRate };
  }

  /**
   * Get all circuit statistics
   */
  getAllCircuitStatistics(): Map<
    string,
    {
      state: CircuitState;
      stats: CircuitStats;
      errorRate: number;
    }
  > {
    const allStats = new Map();

    for (const circuitKey of this.stats.keys()) {
      allStats.set(circuitKey, this.getCircuitStatistics(circuitKey));
    }

    return allStats;
  }

  /**
   * Manually reset a circuit
   */
  resetCircuit(circuitKey: string): void {
    this.logger.log(`Manually resetting circuit: ${circuitKey}`);
    this.circuits.set(circuitKey, CircuitState.CLOSED);
    this.stats.set(circuitKey, {
      failures: 0,
      successes: 0,
      lastFailureTime: 0,
      lastSuccessTime: 0,
      consecutiveFailures: 0,
      consecutiveSuccesses: 0,
    });
  }

  /**
   * Clean up old circuit data
   */
  cleanup(maxAge: number = 3600000): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, stats] of this.stats.entries()) {
      const lastActivity = Math.max(stats.lastFailureTime, stats.lastSuccessTime);
      if (now - lastActivity > maxAge) {
        keysToDelete.push(key);
      }
    }

    for (const key of keysToDelete) {
      this.stats.delete(key);
      this.circuits.delete(key);
      this.logger.debug(`Cleaned up circuit: ${key}`);
    }
  }
}
