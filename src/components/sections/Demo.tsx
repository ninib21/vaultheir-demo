'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Shield, CheckCircle, Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import { createIPAsset, notarizeIPAsset } from '@/lib/api/ip-assets';
import { useToastContext } from '@/components/providers/ToastProvider';
import { validateFile } from '@/lib/utils/validation';

export default function Demo() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [assetName, setAssetName] = useState('');
  const [assetType, setAssetType] = useState<'patent' | 'trademark' | 'copyright' | 'trade-secret'>('patent');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [transactionHash, setTransactionHash] = useState<string>('');
  const [fileError, setFileError] = useState<string>('');
  const { success, error: showError } = useToastContext();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateFile(file);
      if (!validation.valid) {
        setFileError(validation.error || 'Invalid file');
        setSelectedFile(null);
        showError(validation.error || 'Invalid file');
        return;
      }
      
      setFileError('');
      setSelectedFile(file);
      setUploadStatus('idle');
      setTransactionHash('');
      if (!assetName) {
        setAssetName(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !assetName.trim()) {
      showError('Please select a file and enter an asset name');
      return;
    }

    setUploadStatus('uploading');
    
    try {
      // Create IP asset first
      const asset = await createIPAsset({
        name: assetName,
        type: assetType,
        description: `Uploaded file: ${selectedFile.name}`,
      });

      // Notarize on blockchain
      const result = await notarizeIPAsset(asset.id, selectedFile);
      
      setTransactionHash(result.transactionId);
      setUploadStatus('success');
      success('IP asset successfully notarized on Hedera blockchain!');
    } catch (error) {
      setUploadStatus('error');
      const message = error instanceof Error ? error.message : 'Failed to notarize IP asset';
      showError(message);
      
      // Fallback to demo mode if API is unavailable
      if (message.includes('Network error') || message.includes('unavailable')) {
        setTimeout(() => {
          const mockHash = '0x' + Array.from({ length: 64 }, () => 
            Math.floor(Math.random() * 16).toString(16)
          ).join('');
          setTransactionHash(mockHash);
          setUploadStatus('success');
          success('Demo mode: Simulated blockchain transaction');
        }, 2000);
      }
    }
  };

  const steps = [
    {
      icon: Upload,
      title: 'Upload Your IP Asset',
      description: 'Drag and drop or select your file (patent, design, code, etc.)',
      status: selectedFile ? 'complete' : 'pending',
    },
    {
      icon: Shield,
      title: 'Blockchain Notarization',
      description: 'Immutable record created on Hedera Hashgraph',
      status: uploadStatus === 'success' ? 'complete' : uploadStatus === 'uploading' ? 'processing' : 'pending',
    },
    {
      icon: CheckCircle,
      title: 'IP Protected',
      description: 'Your IP is now permanently recorded and verifiable',
      status: uploadStatus === 'success' ? 'complete' : 'pending',
    },
  ];

  return (
    <section id="demo" className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">Try It Now</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience the power of blockchain IP notarization in minutes
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-effect rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Upload Your IP Asset</h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Asset Name
                </label>
                <input
                  type="text"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  placeholder="Enter asset name"
                  className="w-full px-4 py-2.5 glass-effect border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Asset Type
                </label>
                <select
                  value={assetType}
                  onChange={(e) => setAssetType(e.target.value as any)}
                  className="w-full px-4 py-2.5 glass-effect border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                >
                  <option value="patent">Patent</option>
                  <option value="trademark">Trademark</option>
                  <option value="copyright">Copyright</option>
                  <option value="trade-secret">Trade Secret</option>
                </select>
              </div>

              <div
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                  selectedFile
                    ? 'border-primary-500 bg-primary-500/10'
                    : fileError
                    ? 'border-red-500/50 bg-red-500/10'
                    : 'border-gray-600 hover:border-primary-500/50'
                }`}
              >
                <Upload className={`w-12 h-12 mx-auto mb-4 ${fileError ? 'text-red-400' : 'text-primary-400'}`} />
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.png,.svg"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer block"
                >
                  {selectedFile ? (
                    <div>
                      <FileText className="w-8 h-8 text-primary-400 mx-auto mb-2" />
                      <p className="text-white font-semibold">{selectedFile.name}</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  ) : fileError ? (
                    <div>
                      <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                      <p className="text-red-400 font-semibold mb-1">{fileError}</p>
                      <p className="text-sm text-gray-500">Please select a valid file</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-300 mb-2">
                        Drag and drop your file here, or{' '}
                        <span className="text-primary-400 font-semibold">browse</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports PDF, DOC, images, and more (max 10MB)
                      </p>
                    </div>
                  )}
                </label>
              </div>

              <motion.button
                onClick={handleUpload}
                disabled={!selectedFile || !assetName.trim() || uploadStatus === 'uploading'}
                className="w-full py-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 glow-effect"
                whileHover={{ scale: selectedFile && assetName.trim() && uploadStatus !== 'uploading' ? 1.02 : 1 }}
                whileTap={{ scale: selectedFile && assetName.trim() && uploadStatus !== 'uploading' ? 0.98 : 1 }}
              >
                {uploadStatus === 'uploading' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Notarizing on Hedera...
                  </>
                ) : uploadStatus === 'success' ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Notarized Successfully
                  </>
                ) : uploadStatus === 'error' ? (
                  <>
                    Try Again
                    <ArrowRight className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    Notarize on Blockchain
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>

              {transactionHash && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-primary-500/20 border border-primary-500/50 rounded-lg"
                >
                  <p className="text-sm text-gray-400 mb-1">Transaction Hash:</p>
                  <p className="text-primary-400 font-mono text-sm break-all">{transactionHash}</p>
                  <a
                    href={`https://hashscan.io/mainnet/transaction/${transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-300 hover:text-primary-200 text-sm mt-2 inline-block"
                  >
                    View on Hashscan →
                  </a>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Process Steps */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-white mb-6">How It Works</h3>
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`glass-effect rounded-xl p-6 border-2 transition-all ${
                  step.status === 'complete'
                    ? 'border-primary-500 bg-primary-500/10'
                    : step.status === 'processing'
                    ? 'border-accent-500 bg-accent-500/10'
                    : 'border-gray-700'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                      step.status === 'complete'
                        ? 'bg-primary-500'
                        : step.status === 'processing'
                        ? 'bg-accent-500'
                        : 'bg-gray-700'
                    }`}
                  >
                    {step.status === 'processing' ? (
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    ) : (
                      <step.icon className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-1">{step.title}</h4>
                    <p className="text-gray-400 text-sm">{step.description}</p>
                    {step.status === 'complete' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2 flex items-center gap-2 text-primary-400 text-sm"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Complete
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-effect rounded-xl p-6 border border-primary-500/30"
            >
              <h4 className="font-semibold text-white mb-2">Why Hedera Hashgraph?</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                  <span>Ultra-fast transactions (seconds, not minutes)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                  <span>Minimal fees ($0.01-$0.50 per transaction)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                  <span>Carbon-negative (greener than traditional blockchain)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                  <span>Enterprise-grade security and compliance</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

