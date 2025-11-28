import { Injectable, Logger } from '@nestjs/common';

export interface MetricPoint {
  timestamp: number;
  value: number;
  labels?: Record<string, string>;
}

export interface Histogram {
  count: number;
  sum: number;
  buckets: Map<number, number>;
}

export interface MetricsSummary {
  counters: Map<string, number>;
  gauges: Map<string, number>;
  histograms: Map<string, Histogram>;
  timestamps: Map<string, number>;
}

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);

  // Metrics storage
  private counters: Map<string, number> = new Map();
  private gauges: Map<string, number> = new Map();
  private histograms: Map<string, Histogram> = new Map();
  private timestamps: Map<string, number> = new Map();

  // Configuration
  private readonly histogramBuckets = [1, 5, 10, 50, 100, 500, 1000, 5000, 10000];

  /**
   * Increment a counter metric
   */
  incrementCounter(name: string, value: number = 1, labels?: Record<string, string>): void {
    const key = this.buildMetricKey(name, labels);
    const current = this.counters.get(key) || 0;
    this.counters.set(key, current + value);
    this.updateTimestamp(key);
  }

  /**
   * Set a gauge metric
   */
  setGauge(name: string, value: number, labels?: Record<string, string>): void {
    const key = this.buildMetricKey(name, labels);
    this.gauges.set(key, value);
    this.updateTimestamp(key);
  }

  /**
   * Record a value in a histogram
   */
  recordHistogram(name: string, value: number, labels?: Record<string, string>): void {
    const key = this.buildMetricKey(name, labels);

    if (!this.histograms.has(key)) {
      this.histograms.set(key, {
        count: 0,
        sum: 0,
        buckets: new Map(this.histogramBuckets.map((b) => [b, 0])),
      });
    }

    const histogram = this.histograms.get(key);
    histogram.count++;
    histogram.sum += value;

    // Update buckets
    for (const bucket of this.histogramBuckets) {
      if (value <= bucket) {
        histogram.buckets.set(bucket, histogram.buckets.get(bucket) + 1);
      }
    }

    this.updateTimestamp(key);
  }

  /**
   * Record timing (convenience method for histogram)
   */
  recordTiming(name: string, durationMs: number, labels?: Record<string, string>): void {
    this.recordHistogram(`${name}_duration_ms`, durationMs, labels);
  }

  /**
   * Time an async operation
   */
  async timeOperation<T>(
    name: string,
    operation: () => Promise<T>,
    labels?: Record<string, string>,
  ): Promise<T> {
    const startTime = Date.now();

    try {
      const result = await operation();
      const duration = Date.now() - startTime;

      this.recordTiming(name, duration, { ...labels, status: 'success' });
      this.incrementCounter(`${name}_total`, 1, { ...labels, status: 'success' });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      this.recordTiming(name, duration, { ...labels, status: 'error' });
      this.incrementCounter(`${name}_total`, 1, { ...labels, status: 'error' });

      throw error;
    }
  }

  /**
   * Get all metrics in Prometheus format
   */
  getPrometheusMetrics(): string {
    const lines: string[] = [];

    // Counters
    for (const [key, value] of this.counters.entries()) {
      const { name, labels } = this.parseMetricKey(key);
      const labelsStr = this.formatLabels(labels);
      lines.push(`# TYPE ${name} counter`);
      lines.push(`${name}${labelsStr} ${value}`);
    }

    // Gauges
    for (const [key, value] of this.gauges.entries()) {
      const { name, labels } = this.parseMetricKey(key);
      const labelsStr = this.formatLabels(labels);
      lines.push(`# TYPE ${name} gauge`);
      lines.push(`${name}${labelsStr} ${value}`);
    }

    // Histograms
    for (const [key, histogram] of this.histograms.entries()) {
      const { name, labels } = this.parseMetricKey(key);
      const labelsStr = this.formatLabels(labels);

      lines.push(`# TYPE ${name} histogram`);
      lines.push(`${name}_count${labelsStr} ${histogram.count}`);
      lines.push(`${name}_sum${labelsStr} ${histogram.sum}`);

      for (const [bucket, count] of histogram.buckets.entries()) {
        const bucketLabels = { ...labels, le: bucket.toString() };
        const bucketLabelsStr = this.formatLabels(bucketLabels);
        lines.push(`${name}_bucket${bucketLabelsStr} ${count}`);
      }

      const infLabels = { ...labels, le: '+Inf' };
      const infLabelsStr = this.formatLabels(infLabels);
      lines.push(`${name}_bucket${infLabelsStr} ${histogram.count}`);
    }

    return lines.join('\n') + '\n';
  }

  /**
   * Get all metrics as JSON
   */
  getAllMetrics(): MetricsSummary {
    return {
      counters: new Map(this.counters),
      gauges: new Map(this.gauges),
      histograms: new Map(this.histograms),
      timestamps: new Map(this.timestamps),
    };
  }

  /**
   * Get specific metric statistics
   */
  getMetricStatistics(name: string, labels?: Record<string, string>): any {
    const key = this.buildMetricKey(name, labels);

    if (this.counters.has(key)) {
      return {
        type: 'counter',
        value: this.counters.get(key),
        timestamp: this.timestamps.get(key),
      };
    }

    if (this.gauges.has(key)) {
      return {
        type: 'gauge',
        value: this.gauges.get(key),
        timestamp: this.timestamps.get(key),
      };
    }

    if (this.histograms.has(key)) {
      const histogram = this.histograms.get(key);
      return {
        type: 'histogram',
        count: histogram.count,
        sum: histogram.sum,
        mean: histogram.count > 0 ? histogram.sum / histogram.count : 0,
        buckets: Array.from(histogram.buckets.entries()),
        timestamp: this.timestamps.get(key),
      };
    }

    return null;
  }

  /**
   * Reset all metrics
   */
  resetAllMetrics(): void {
    this.logger.warn('Resetting all metrics');
    this.counters.clear();
    this.gauges.clear();
    this.histograms.clear();
    this.timestamps.clear();
  }

  /**
   * Reset specific metric
   */
  resetMetric(name: string, labels?: Record<string, string>): void {
    const key = this.buildMetricKey(name, labels);
    this.counters.delete(key);
    this.gauges.delete(key);
    this.histograms.delete(key);
    this.timestamps.delete(key);
  }

  /**
   * Build metric key from name and labels
   */
  private buildMetricKey(name: string, labels?: Record<string, string>): string {
    if (!labels || Object.keys(labels).length === 0) {
      return name;
    }

    const labelStr = Object.entries(labels)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}="${v}"`)
      .join(',');

    return `${name}{${labelStr}}`;
  }

  /**
   * Parse metric key back to name and labels
   */
  private parseMetricKey(key: string): { name: string; labels: Record<string, string> } {
    const match = key.match(/^([^{]+)(?:\{(.+)\})?$/);

    if (!match) {
      return { name: key, labels: {} };
    }

    const name = match[1];
    const labelsStr = match[2];

    if (!labelsStr) {
      return { name, labels: {} };
    }

    const labels: Record<string, string> = {};
    const labelPairs = labelsStr.split(',');

    for (const pair of labelPairs) {
      const [key, value] = pair.split('=');
      labels[key] = value.replace(/"/g, '');
    }

    return { name, labels };
  }

  /**
   * Format labels for Prometheus format
   */
  private formatLabels(labels: Record<string, string>): string {
    if (!labels || Object.keys(labels).length === 0) {
      return '';
    }

    const labelStr = Object.entries(labels)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}="${v}"`)
      .join(',');

    return `{${labelStr}}`;
  }

  /**
   * Update timestamp for metric
   */
  private updateTimestamp(key: string): void {
    this.timestamps.set(key, Date.now());
  }
}
