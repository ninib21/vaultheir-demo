'use client';

import { FormEvent, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { createIPAsset, CreateIPAssetDto, getAllAssets, IPAsset } from '@/lib/api/ip-assets';
import { useToastContext } from '@/components/providers/ToastProvider';
import { notarizeWithHedera } from '@/lib/api/hedera';
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
  Loader2,
} from 'lucide-react';

type AssetTypeLabel = 'Patent' | 'Trademark' | 'Copyright' | 'Trade Secret' | 'Legal Document';
type AssetStatusLabel = 'Notarized' | 'Processing';

type DashboardAsset = {
  id: string;
  name: string;
  type: AssetTypeLabel;
  status: AssetStatusLabel;
  notarizedAt: string | null;
  transactionId: string | null;
  hash: string | null;
  value: string;
  category: string;
};

const assetTypeMeta: Record<CreateIPAssetDto['type'], { label: AssetTypeLabel; category: string }> = {
  patent: { label: 'Patent', category: 'Technology' },
  trademark: { label: 'Trademark', category: 'Brand' },
  copyright: { label: 'Copyright', category: 'Creative' },
  'trade-secret': { label: 'Trade Secret', category: 'Security' },
};

const assetTypeOptions = [
  { value: 'patent', label: 'Patent', helper: 'Inventions, algorithms, product designs' },
  { value: 'trademark', label: 'Trademark', helper: 'Logos, slogans, brand assets' },
  { value: 'copyright', label: 'Copyright', helper: 'Creative works, media, documentation' },
  { value: 'trade-secret', label: 'Trade Secret', helper: 'Confidential processes, playbooks' },
] satisfies Array<{ value: CreateIPAssetDto['type']; label: string; helper: string }>;

const Background3D = dynamic(() => import('@/components/Background3D'), {
  ssr: false,
  loading: () => null,
});

// Sample notarized assets data
const sampleAssets: DashboardAsset[] = [
  {
    id: '1',
    name: 'Aurora Biotech Gene Therapy Dossier',
    type: 'Patent',
    status: 'Notarized',
    notarizedAt: '2024-11-20T14:32:00Z',
    transactionId: '0.0.7001101@1700234567.123456789',
    hash: '0x9e2bf8a4c17d55b6ae34c97fbe61d9c203fa9d11',
    value: '$450,000',
    category: 'Technology',
  },
  {
    id: '2',
    name: 'Lumen Collective Brand System',
    type: 'Trademark',
    status: 'Notarized',
    notarizedAt: '2024-11-18T09:15:00Z',
    transactionId: '0.0.7001102@1700123456.987654321',
    hash: '0x1f4a9ce0b72d88aa4b7f0dc42f51a8d5cc0e8844',
    value: '$85,000',
    category: 'Brand',
  },
  {
    id: '3',
    name: 'Sentinel Zero-Knowledge Security Stack',
    type: 'Trade Secret',
    status: 'Notarized',
    notarizedAt: '2024-11-15T16:45:00Z',
    transactionId: '0.0.7001103@1700012345.456789012',
    hash: '0x5c8f71d92b0efab4730d96caa453b0f3de9a22af',
    value: '$1,200,000',
    category: 'Security',
  },
  {
    id: '4',
    name: 'Nebula OS Interface Library',
    type: 'Copyright',
    status: 'Notarized',
    notarizedAt: '2024-11-12T11:20:00Z',
    transactionId: '0.0.7001104@1699901234.789012345',
    hash: '0x72b1d4f93e0c8aa5bb1d2f0c8d4a55e1ffcc01bd',
    value: '$125,000',
    category: 'Design',
  },
  {
    id: '5',
    name: 'Helios Quantum Compute Recipes',
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
    name: 'Atlas Estate Governance Templates',
    type: 'Legal Document',
    status: 'Notarized',
    notarizedAt: '2024-11-08T13:55:00Z',
    transactionId: '0.0.7001105@1699790123.012345678',
    hash: '0xb4a7e6f8d2100ccf9a62dcb4ef1d05e8a412779c',
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

const typeColors: Record<AssetTypeLabel, string> = {
  'Patent': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Trademark': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Copyright': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Trade Secret': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Legal Document': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

function mapApiAssetToDashboard(asset: IPAsset): DashboardAsset {
  const meta = assetTypeMeta[asset.type];
  return {
    id: asset.id,
    name: asset.name,
    type: meta?.label ?? 'Patent',
    status: asset.status === 'notarized' ? 'Notarized' : 'Processing',
    notarizedAt: asset.status === 'notarized' ? asset.updatedAt : null,
    transactionId: asset.hederaTransactionId ?? null,
    hash: null,
    value: '—',
    category: meta?.category ?? 'Custom',
  };
}

function buildDemoAssetFromForm(name: string, type: CreateIPAssetDto['type']): DashboardAsset {
  const meta = assetTypeMeta[type];
  return {
    id: `demo-${Date.now()}`,
    name,
    type: meta?.label ?? 'Patent',
    status: 'Processing',
    notarizedAt: null,
    transactionId: null,
    hash: null,
    value: '—',
    category: meta?.category ?? 'Custom',
  };
}

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
  const { success, error, info } = useToastContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [assets, setAssets] = useState<DashboardAsset[]>(sampleAssets);
  const [selectedAsset, setSelectedAsset] = useState<DashboardAsset | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [notarizingAssetId, setNotarizingAssetId] = useState<string | null>(null);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssetCreated = (asset: DashboardAsset) => {
    setAssets((prev) => [asset, ...prev]);
    setSelectedAsset(asset);
  };

  useEffect(() => {
    let mounted = true;

    const fetchAssets = async () => {
      setIsLoadingAssets(true);
      try {
        const records = await getAllAssets();
        if (!mounted) return;
        const mapped = records.map((record) => mapApiAssetToDashboard(record));
        setAssets(mapped.length ? mapped : sampleAssets);
      } catch (fetchError) {
        console.error(fetchError);
      } finally {
        if (mounted) setIsLoadingAssets(false);
      }
    };

    fetchAssets();
    return () => {
      mounted = false;
    };
  }, []);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleQuickNotarize = async (asset: DashboardAsset) => {
    if (notarizingAssetId) return;

    setNotarizingAssetId(asset.id);

    try {
      const payloadContent = JSON.stringify({
        assetId: asset.id,
        name: asset.name,
        type: asset.type,
        category: asset.category,
        createdAt: new Date().toISOString(),
      });

      const response = await notarizeWithHedera({
        content: payloadContent,
        metadata: {
          source: 'dashboard',
          assetName: asset.name,
        },
      });

      const hashscanUrl = `https://hashscan.io/testnet/transaction/${response.transactionId}`;

      setAssets((prev) =>
        prev.map((item) =>
          item.id === asset.id
            ? {
                ...item,
                status: 'Notarized',
                notarizedAt: response.timestamp,
                transactionId: response.transactionId,
              }
            : item
        )
      );

      success('Asset notarized on Hedera', 4000);
      info(`Hashscan: ${hashscanUrl}`, 6000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to notarize asset';
      error(message);
    } finally {
      setNotarizingAssetId(null);
    }
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
                  onClick={() => setIsCreateModalOpen(true)}
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
                            {asset.status !== 'Notarized' && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-primary-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={notarizingAssetId === asset.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleQuickNotarize(asset);
                                }}
                              >
                                {notarizingAssetId === asset.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Shield className="w-4 h-4" />
                                )}
                              </motion.button>
                            )}
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

        {/* Asset Detail & Creation Modals */}
        <AnimatePresence>
          {selectedAsset && (
            <motion.div
              key="asset-detail-modal"
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
          {isCreateModalOpen && (
            <NewAssetModal
              key="new-asset-modal"
              onClose={() => setIsCreateModalOpen(false)}
              onCreated={handleAssetCreated}
            />
          )}
        </AnimatePresence>
      </main>
    </ErrorBoundary>
  );
}

interface NewAssetModalProps {
  onClose: () => void;
  onCreated: (asset: DashboardAsset) => void;
}

function NewAssetModal({ onClose, onCreated }: NewAssetModalProps) {
  const { success, error, warning } = useToastContext();
  const [assetName, setAssetName] = useState('');
  const [assetType, setAssetType] = useState<CreateIPAssetDto['type']>('patent');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const resetForm = () => {
    setAssetName('');
    setAssetType('patent');
    setDescription('');
    setFormError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!assetName.trim()) {
      setFormError('Please enter an asset name');
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    try {
      const createdAsset = await createIPAsset({
        name: assetName.trim(),
        type: assetType,
        description: description.trim() || undefined,
      });

      const mappedAsset = mapApiAssetToDashboard(createdAsset);
      onCreated(mappedAsset);
      success('Asset created and queued for notarization.');
      resetForm();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create asset';
      error(message);
      const fallbackAsset = buildDemoAssetFromForm(assetName.trim(), assetType);
      onCreated(fallbackAsset);
      warning('Running in demo mode. Asset stored locally for testing.');
      resetForm();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl glass-effect-strong rounded-2xl border border-white/20 p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-wider text-primary-300 mb-1">Create IP Asset</p>
            <h3 className="text-2xl font-bold text-white">New Asset</h3>
            <p className="text-sm text-gray-400 mt-1">
              Capture key metadata before notarizing on Hedera.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
            aria-label="Close new asset modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Asset Name
            </label>
            <input
              type="text"
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              placeholder="e.g., Estate Plan Playbook"
              className="w-full px-4 py-2.5 glass-effect border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Asset Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {assetTypeOptions.map((option) => {
                const isActive = assetType === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setAssetType(option.value)}
                    className={`text-left p-3 rounded-xl border transition-all ${
                      isActive
                        ? 'border-primary-500 bg-primary-500/10 text-white'
                        : 'border-white/10 text-gray-300 hover:border-primary-500/40'
                    }`}
                  >
                    <div className="font-semibold">{option.label}</div>
                    <div className="text-xs text-gray-400 mt-1">{option.helper}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Briefly describe what this asset protects or includes..."
              className="w-full px-4 py-2.5 glass-effect border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none"
            />
          </div>

          {formError && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
              {formError}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:border-white/30 transition-colors"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              disabled={isSubmitting}
              className="w-full sm:flex-1 px-5 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Create Asset
                </>
              )}
            </motion.button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            You can upload supporting documents and notarize this asset once it appears in the list.
          </p>
        </form>
      </motion.div>
    </motion.div>
  );
}
