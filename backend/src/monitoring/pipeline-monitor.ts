/**
 * PIPELINE MONITORING SERVICE
 * Real-time monitoring, alerting, and analytics for data pipelines
 */

import { Injectable } from '@nestjs/common';
import { PipelineMetrics, PipelineError } from '../../../data_pipelines/pipeline-core-enhanced';

export interface MonitoringEvent {
  timestamp: string;
  pipelineName: string;
  eventType: 'execution' | 'error' | 'warning' | 'metric';
  severity: 'low' | 'medium' | 'high' | 'critical';
  data: any;
}

export interface AlertRule {
  name: string;
  condition: (metrics: PipelineMetrics) => boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  notificationChannels: ('email' | 'slack' | 'pagerduty')[];
}

@Injectable()
export class PipelineMonitoringService {
  private events: MonitoringEvent[] = [];
  private alertRules: AlertRule[] = [];
  private metricsCache: Map<string, PipelineMetrics> = new Map();

  constructor() {
    this.initializeDefaultAlertRules();
  }

  /**
   * Log pipeline execution
   */
  logExecution(
    pipelineName: string,
    executionId: string,
    success: boolean,
    duration: number,
    errors: PipelineError[]
  ): void {
    const event: MonitoringEvent = {
      timestamp: new Date().toISOString(),
      pipelineName,
      eventType: success ? 'execution' : 'error',
      severity: success ? 'low' : this.determineSeverity(errors),
      data: {
        executionId,
        success,
        duration,
        errorCount: errors.length,
        errors: errors.map((e) => ({
          stage: e.stage,
          code: e.code,
          message: e.message,
        })),
      },
    };

    this.events.push(event);
    this.checkAlerts(pipelineName);

    // Keep only last 1000 events
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }
  }

  /**
   * Update pipeline metrics
   */
  updateMetrics(pipelineName: string, metrics: PipelineMetrics): void {
    this.metricsCache.set(pipelineName, metrics);
    this.checkAlerts(pipelineName);
  }

  /**
   * Get metrics for a pipeline
   */
  getMetrics(pipelineName: string): PipelineMetrics | undefined {
    return this.metricsCache.get(pipelineName);
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): Record<string, PipelineMetrics> {
    const allMetrics: Record<string, PipelineMetrics> = {};
    this.metricsCache.forEach((metrics, pipelineName) => {
      allMetrics[pipelineName] = metrics;
    });
    return allMetrics;
  }

  /**
   * Get recent events
   */
  getRecentEvents(limit: number = 100): MonitoringEvent[] {
    return this.events.slice(-limit);
  }

  /**
   * Get events for specific pipeline
   */
  getPipelineEvents(pipelineName: string, limit: number = 100): MonitoringEvent[] {
    return this.events
      .filter((e) => e.pipelineName === pipelineName)
      .slice(-limit);
  }

  /**
   * Initialize default alert rules
   */
  private initializeDefaultAlertRules(): void {
    this.alertRules = [
      {
        name: 'high_failure_rate',
        condition: (metrics) => {
          const failureRate = metrics.failedExecutions / metrics.totalExecutions;
          return failureRate > 0.1; // 10% failure rate
        },
        severity: 'high',
        message: 'Pipeline failure rate exceeds 10%',
        notificationChannels: ['email', 'slack'],
      },
      {
        name: 'slow_execution',
        condition: (metrics) => {
          return metrics.averageExecutionTimeMs > 5000; // 5 seconds
        },
        severity: 'medium',
        message: 'Pipeline average execution time exceeds 5 seconds',
        notificationChannels: ['email'],
      },
      {
        name: 'no_executions',
        condition: (metrics) => {
          return metrics.totalExecutions === 0;
        },
        severity: 'low',
        message: 'Pipeline has no executions recorded',
        notificationChannels: ['slack'],
      },
    ];
  }

  /**
   * Check alert conditions
   */
  private checkAlerts(pipelineName: string): void {
    const metrics = this.metricsCache.get(pipelineName);
    if (!metrics) return;

    for (const rule of this.alertRules) {
      try {
        if (rule.condition(metrics)) {
          this.triggerAlert(pipelineName, rule);
        }
      } catch (error) {
        console.error(`Alert rule "${rule.name}" failed:`, error);
      }
    }
  }

  /**
   * Trigger alert
   */
  private triggerAlert(pipelineName: string, rule: AlertRule): void {
    const event: MonitoringEvent = {
      timestamp: new Date().toISOString(),
      pipelineName,
      eventType: 'warning',
      severity: rule.severity,
      data: {
        ruleName: rule.name,
        message: rule.message,
        metrics: this.metricsCache.get(pipelineName),
      },
    };

    this.events.push(event);

    // Log alert (in production, send to notification channels)
    console.warn(`[ALERT] ${pipelineName}: ${rule.message}`);
    
    // TODO: Implement actual notification sending
    // this.sendNotifications(rule.notificationChannels, event);
  }

  /**
   * Determine severity from errors
   */
  private determineSeverity(errors: PipelineError[]): 'low' | 'medium' | 'high' | 'critical' {
    if (errors.length === 0) return 'low';
    
    const hasNonRecoverable = errors.some((e) => !e.recoverable);
    const errorCount = errors.length;

    if (hasNonRecoverable && errorCount > 5) return 'critical';
    if (hasNonRecoverable) return 'high';
    if (errorCount > 3) return 'medium';
    return 'low';
  }

  /**
   * Generate monitoring dashboard data
   */
  getDashboardData(): {
    overview: {
      totalPipelines: number;
      totalExecutions: number;
      overallSuccessRate: number;
      averageExecutionTime: number;
    };
    pipelines: Array<{
      name: string;
      metrics: PipelineMetrics;
      healthStatus: 'healthy' | 'degraded' | 'critical';
    }>;
    recentEvents: MonitoringEvent[];
    activeAlerts: MonitoringEvent[];
  } {
    const pipelines = Array.from(this.metricsCache.entries()).map(([name, metrics]) => ({
      name,
      metrics,
      healthStatus: this.determineHealthStatus(metrics),
    }));

    const totalExecutions = pipelines.reduce((sum, p) => sum + p.metrics.totalExecutions, 0);
    const totalSuccessful = pipelines.reduce((sum, p) => sum + p.metrics.successfulExecutions, 0);
    const avgExecutionTime = pipelines.reduce((sum, p) => sum + p.metrics.averageExecutionTimeMs, 0) / 
      (pipelines.length || 1);

    return {
      overview: {
        totalPipelines: pipelines.length,
        totalExecutions,
        overallSuccessRate: totalExecutions > 0 ? (totalSuccessful / totalExecutions) * 100 : 0,
        averageExecutionTime: avgExecutionTime,
      },
      pipelines,
      recentEvents: this.getRecentEvents(50),
      activeAlerts: this.events.filter((e) => 
        e.eventType === 'warning' && 
        new Date(e.timestamp).getTime() > Date.now() - 3600000 // Last hour
      ),
    };
  }

  /**
   * Determine health status from metrics
   */
  private determineHealthStatus(metrics: PipelineMetrics): 'healthy' | 'degraded' | 'critical' {
    if (metrics.totalExecutions === 0) return 'degraded';
    
    const successRate = metrics.successfulExecutions / metrics.totalExecutions;
    
    if (successRate >= 0.95) return 'healthy';
    if (successRate >= 0.8) return 'degraded';
    return 'critical';
  }
}

