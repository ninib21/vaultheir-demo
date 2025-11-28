'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';

interface SystemStatus {
  health: string;
  circuits: Record<string, any>;
  idempotency: {
    totalRecords: number;
    successRate: number;
    cacheHitRate: number;
  };
  temporal: {
    currentLogicalClock: number;
    totalExecutions: number;
  };
  metrics: {
    totalRequests: number;
    totalErrors: number;
    circuitBreakerRejections: number;
  };
}

export default function AdaptiveDashboard() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/adaptive/status');
      if (!response.ok) {
        throw new Error('Failed to fetch status');
      }
      const data = await response.json();
      setStatus(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      <main className="container mx-auto px-4 py-24">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Adaptive AI Dashboard
            </h1>
            <p className="text-xl text-gray-400">
              Real-time monitoring of AI-enhanced API infrastructure
            </p>
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
              <p className="mt-4 text-gray-400">Loading dashboard...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-950 border border-red-800 rounded-lg p-6 mb-8">
              <h3 className="text-red-400 font-semibold mb-2">Error</h3>
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {status && (
            <div className="space-y-8">
              {/* System Health */}
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-xl p-8">
                <h2 className="text-2xl font-bold mb-6 text-white">System Health</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-black/50 rounded-lg p-6 border border-zinc-800">
                    <div className="text-sm text-gray-400 mb-2">Overall Status</div>
                    <div className={`text-3xl font-bold ${
                      status.health === 'healthy' ? 'text-green-400' :
                      status.health === 'degraded' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {status.health.toUpperCase()}
                    </div>
                  </div>
                  <div className="bg-black/50 rounded-lg p-6 border border-zinc-800">
                    <div className="text-sm text-gray-400 mb-2">Total Requests</div>
                    <div className="text-3xl font-bold text-white">
                      {status.metrics.totalRequests.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-black/50 rounded-lg p-6 border border-zinc-800">
                    <div className="text-sm text-gray-400 mb-2">Error Rate</div>
                    <div className="text-3xl font-bold text-white">
                      {status.metrics.totalRequests > 0
                        ? ((status.metrics.totalErrors / status.metrics.totalRequests) * 100).toFixed(2)
                        : 0}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Circuit Breakers */}
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-xl p-8">
                <h2 className="text-2xl font-bold mb-6 text-white">Circuit Breakers</h2>
                <div className="space-y-4">
                  {Object.entries(status.circuits).length === 0 ? (
                    <div className="text-gray-400 text-center py-8">
                      No circuit breakers active yet
                    </div>
                  ) : (
                    Object.entries(status.circuits).map(([key, circuit]: [string, any]) => (
                      <div key={key} className="bg-black/50 rounded-lg p-6 border border-zinc-800">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="font-mono text-sm text-gray-400">{key}</div>
                            <div className={`text-lg font-bold ${
                              circuit.state === 'closed' ? 'text-green-400' :
                              circuit.state === 'half_open' ? 'text-yellow-400' :
                              'text-red-400'
                            }`}>
                              {circuit.state.toUpperCase().replace('_', '-')}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-400">Error Rate</div>
                            <div className="text-2xl font-bold text-white">
                              {(circuit.errorRate * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Failures:</span>{' '}
                            <span className="text-white">{circuit.stats.failures}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Successes:</span>{' '}
                            <span className="text-white">{circuit.stats.successes}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Idempotency Engine */}
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-xl p-8">
                <h2 className="text-2xl font-bold mb-6 text-white">Idempotency Engine</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-black/50 rounded-lg p-6 border border-zinc-800">
                    <div className="text-sm text-gray-400 mb-2">Total Records</div>
                    <div className="text-3xl font-bold text-white">
                      {status.idempotency.totalRecords.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-black/50 rounded-lg p-6 border border-zinc-800">
                    <div className="text-sm text-gray-400 mb-2">Success Rate</div>
                    <div className="text-3xl font-bold text-green-400">
                      {(status.idempotency.successRate * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Temporal Determinism */}
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-xl p-8">
                <h2 className="text-2xl font-bold mb-6 text-white">Temporal Determinism</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-black/50 rounded-lg p-6 border border-zinc-800">
                    <div className="text-sm text-gray-400 mb-2">Logical Clock</div>
                    <div className="text-3xl font-bold text-white">
                      {status.temporal.currentLogicalClock.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-black/50 rounded-lg p-6 border border-zinc-800">
                    <div className="text-sm text-gray-400 mb-2">Total Executions</div>
                    <div className="text-3xl font-bold text-white">
                      {status.temporal.totalExecutions.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Real-time Metrics */}
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-xl p-8">
                <h2 className="text-2xl font-bold mb-6 text-white">Real-time Metrics</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-black/50 rounded-lg p-6 border border-zinc-800">
                    <div className="text-sm text-gray-400 mb-2">Circuit Breaker Rejections</div>
                    <div className="text-3xl font-bold text-red-400">
                      {status.metrics.circuitBreakerRejections.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-black/50 rounded-lg p-6 border border-zinc-800">
                    <div className="text-sm text-gray-400 mb-2">Total Errors</div>
                    <div className="text-3xl font-bold text-yellow-400">
                      {status.metrics.totalErrors.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-black/50 rounded-lg p-6 border border-zinc-800">
                    <div className="text-sm text-gray-400 mb-2">Uptime</div>
                    <div className="text-3xl font-bold text-green-400">99.9%</div>
                  </div>
                </div>
              </div>

              {/* API Endpoints */}
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-xl p-8">
                <h2 className="text-2xl font-bold mb-6 text-white">API Endpoints</h2>
                <div className="space-y-3">
                  <a
                    href="http://localhost:4000/api/adaptive/health"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-black/50 rounded-lg p-4 border border-zinc-800 hover:border-zinc-600 transition-colors"
                  >
                    <div className="font-mono text-sm text-gray-400">/api/adaptive/health</div>
                    <div className="text-white">Health Check Endpoint</div>
                  </a>
                  <a
                    href="http://localhost:4000/api/adaptive/metrics"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-black/50 rounded-lg p-4 border border-zinc-800 hover:border-zinc-600 transition-colors"
                  >
                    <div className="font-mono text-sm text-gray-400">/api/adaptive/metrics</div>
                    <div className="text-white">Prometheus Metrics</div>
                  </a>
                  <a
                    href="http://localhost:4000/api/adaptive/circuits"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-black/50 rounded-lg p-4 border border-zinc-800 hover:border-zinc-600 transition-colors"
                  >
                    <div className="font-mono text-sm text-gray-400">/api/adaptive/circuits</div>
                    <div className="text-white">Circuit Breaker Status</div>
                  </a>
                  <a
                    href="http://localhost:4000/api/adaptive/status"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-black/50 rounded-lg p-4 border border-zinc-800 hover:border-zinc-600 transition-colors"
                  >
                    <div className="font-mono text-sm text-gray-400">/api/adaptive/status</div>
                    <div className="text-white">Complete System Status</div>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
