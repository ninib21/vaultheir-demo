'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import {
  FileText,
  Shield,
  Clock,
  CheckCircle,
  ExternalLink,
  Search,
  Filter,
  Download,
  Plus,
  TrendingUp,
  Lock,
  Eye,
  Copy,
  ChevronRight,
} from 'lucide-react';

const Background3D = dynamic(() => import('@/components/Background3D'), {
  ssr: false,
  loading: () => null,
});

// Sample notarized assets data
const sampleAssets = [
  {
    id: '1',
    name: 'AI-Powered Trading Algorithm v2.1',
    type: 'Patent',
    status: 'Notarized',
    notarizedAt: '2024-11-20T14:32:00Z',
    transactionId: '0.0.5678923@1700234567.123456789',
    hash: '0x8a7b3c2d1e4f5a6b7c8d9e0f1a2b3c4d5e6f7890',
    value: '$450,000',
    category: 'Technology',
  },
  {
    id: '2',
    name: 'VaultHeir Brand Identity Package',
    type: 'Trademark',
    status: 'Notarized',
    notarizedAt: '2024-11-18T09:15:00Z',
    transactionId: '0.0.5678924@1700123456.987654321',
    hash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
    value: '$85,000',
    category: 'Brand',
  },
  {
    id: '3',
    name: 'Secure Document Encryption Protocol',
    type: 'Trade Secret',
    status: 'Notarized',
    notarizedAt: '2024-11-15T16:45:00Z',
    transactionId: '0.0.5678925@1700012345.456789012',
    hash: '0x2b3c4d5e6f7890abcdef1234567890abcdef1234',
    value: '$1,200,000',
    category: 'Security',
  },
  {
    id: '4',
    name: 'Mobile App UI/UX Design System',
    type: 'Copyright',
    status: 'Notarized',
    notarizedAt: '2024-11-12T11:20:00Z',
    transactionId: '0.0.5678926@1699901234.789012345',
    hash: '0x3c4d5e6f7890abcdef1234567890abcdef123456',
    value: '$125,000',
    category: 'Design',
  },
  {
    id: '5',
    name: 'Blockchain Integration Framework',
    type: 'Patent',
    status: 'Processing',
    notarizedAt: null,
    transactionId: null,
    hash: null,
    value: '$320,000',
    category: 'Technology',
  },
  {
    id: '6',
    name: 'Estate Planning Legal Templates',
    type: 'Legal Document',
    status: 'Notarized',
    notarizedAt: '2024-11-08T13:55:00Z',
    transactionId: '0.0.5678927@1699790123.012345678',
    hash: '0x4d5e6f7890abcdef1234567890abcdef12345678',
    value: '$45,000',
    category: 'Legal',
  },
];

const stats = [
  { label: 'Total Assets', value: '6', icon: FileText, color: 'primary' },
  { label: 'Protected Value', value: '$2.2M', icon: Shield, color: 'accent' },
  { label: 'Notarized', value: '5', icon: CheckCircle, color: 'green' },
  { label: 'Processing', value: '1', icon: Clock, color: 'yellow' },
];

const typeColors: Record<string, string> = {
  'Patent': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Trademark': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Copyright': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Trade Secret': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Legal Document': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

function formatDate(dateString: string | null) {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function truncateHash(hash: string | null) {
  if (!hash) return '-';
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<typeof sampleAssets[0] | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const filteredAssets = sampleAssets.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <ErrorBoundary>
      <main className="relative min-h-screen overflow-hidden">
        <Navigation />
        <Background3D />

        <div className="relative z-10 pt-24 pb-12 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <span>Dashboard</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-white">My Assets</span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    Welcome back, <span className="gradient-text">Demo User</span>
                  </h1>
                  <p className="text-gray-400">Manage and monitor your protected intellectual property</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold text-white shadow-lg shadow-primary-500/30"
                >
                  <Plus className="w-5 h-5" />
                  New Asset
                </motion.button>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="glass-effect p-5 rounded-xl border border-white/10 hover:border-primary-500/30 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Search and Filter Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col md:flex-row gap-4 mb-6"
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 transition-colors"
                />
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-5 py-3 glass-effect rounded-xl border border-white/10 hover:border-primary-500/30 text-gray-300 hover:text-white transition-all"
                >
                  <Filter className="w-5 h-5" />
                  Filter
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-5 py-3 glass-effect rounded-xl border border-white/10 hover:border-primary-500/30 text-gray-300 hover:text-white transition-all"
                >
                  <Download className="w-5 h-5" />
                  Export
                </motion.button>
              </div>
            </motion.div>

            {/* Assets Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="glass-effect rounded-2xl border border-white/10 overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Asset Name</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Type</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Status</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Value</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Notarized</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAssets.map((asset, index) => (
                      <motion.tr
                        key={asset.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.05 * index }}
                        onClick={() => setSelectedAsset(asset)}
                        className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                              <FileText className="w-5 h-5 text-primary-400" />
                            </div>
                            <div>
                              <div className="font-medium text-white group-hover:text-primary-400 transition-colors">
                                {asset.name}
                              </div>
                              <div className="text-xs text-gray-500">{asset.category}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${typeColors[asset.type]}`}>
                            {asset.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {asset.status === 'Notarized' ? (
                            <span className="flex items-center gap-2 text-green-400">
                              <CheckCircle className="w-4 h-4" />
                              Notarized
                            </span>
                          ) : (
                            <span className="flex items-center gap-2 text-yellow-400">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                              >
                                <Clock className="w-4 h-4" />
                              </motion.div>
                              Processing
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-white">{asset.value}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-400 text-sm">{formatDate(asset.notarizedAt)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedAsset(asset);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </motion.button>
                            {asset.transactionId && (
                              <motion.a
                                href={`https://hashscan.io/mainnet/transaction/${asset.transactionId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-primary-400 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink className="w-4 h-4" />
                              </motion.a>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Demo Notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-6 text-center"
            >
              <p className="text-sm text-gray-500">
                <Lock className="w-4 h-4 inline mr-1" />
                This is a demo dashboard with sample data. Real assets are protected by blockchain encryption.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Asset Detail Modal */}
        <AnimatePresence>
          {selectedAsset && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAsset(null)}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg glass-effect-strong rounded-2xl border border-white/20 p-6 shadow-2xl"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{selectedAsset.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${typeColors[selectedAsset.type]}`}>
                      {selectedAsset.type}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedAsset(null)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-gray-400">Status</span>
                    {selectedAsset.status === 'Notarized' ? (
                      <span className="flex items-center gap-2 text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        Notarized
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-yellow-400">
                        <Clock className="w-4 h-4" />
                        Processing
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-gray-400">Estimated Value</span>
                    <span className="font-bold text-white">{selectedAsset.value}</span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-gray-400">Category</span>
                    <span className="text-white">{selectedAsset.category}</span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-gray-400">Notarized At</span>
                    <span className="text-white">{formatDate(selectedAsset.notarizedAt)}</span>
                  </div>

                  {selectedAsset.transactionId && (
                    <div className="py-3 border-b border-white/10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">Transaction ID</span>
                        <button
                          onClick={() => copyToClipboard(selectedAsset.transactionId!, 'txId')}
                          className="text-primary-400 hover:text-primary-300 transition-colors"
                        >
                          {copiedField === 'txId' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <code className="text-xs text-gray-300 bg-black/30 px-3 py-2 rounded-lg block overflow-x-auto">
                        {selectedAsset.transactionId}
                      </code>
                    </div>
                  )}

                  {selectedAsset.hash && (
                    <div className="py-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">Content Hash</span>
                        <button
                          onClick={() => copyToClipboard(selectedAsset.hash!, 'hash')}
                          className="text-primary-400 hover:text-primary-300 transition-colors"
                        >
                          {copiedField === 'hash' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <code className="text-xs text-gray-300 bg-black/30 px-3 py-2 rounded-lg block overflow-x-auto">
                        {selectedAsset.hash}
                      </code>
                    </div>
                  )}
                </div>

                {selectedAsset.transactionId && (
                  <motion.a
                    href={`https://hashscan.io/mainnet/transaction/${selectedAsset.transactionId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold text-white"
                  >
                    <ExternalLink className="w-5 h-5" />
                    View on Hashscan
                  </motion.a>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </ErrorBoundary>
  );
}
