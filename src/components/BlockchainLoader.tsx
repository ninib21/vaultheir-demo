'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, CheckCircle, Link, Database, Cpu } from 'lucide-react';

interface BlockchainLoaderProps {
  stage: 'hashing' | 'encrypting' | 'submitting' | 'confirming' | 'complete';
  progress?: number;
}

const stages = [
  { id: 'hashing', label: 'Generating Hash', icon: Database, description: 'Creating cryptographic fingerprint...' },
  { id: 'encrypting', label: 'Encrypting', icon: Lock, description: 'Securing with AES-256...' },
  { id: 'submitting', label: 'Submitting to Hedera', icon: Link, description: 'Broadcasting to network...' },
  { id: 'confirming', label: 'Confirming', icon: Cpu, description: 'Waiting for consensus...' },
  { id: 'complete', label: 'Notarized', icon: CheckCircle, description: 'Permanently recorded!' },
];

export default function BlockchainLoader({ stage, progress = 0 }: BlockchainLoaderProps) {
  const currentStageIndex = stages.findIndex(s => s.id === stage);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Main Animation */}
      <div className="relative flex items-center justify-center mb-8">
        {/* Outer ring */}
        <motion.div
          className="absolute w-32 h-32 rounded-full border-2 border-primary-500/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />

        {/* Middle ring */}
        <motion.div
          className="absolute w-24 h-24 rounded-full border-2 border-accent-500/30"
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        />

        {/* Inner pulsing circle */}
        <motion.div
          className="absolute w-16 h-16 rounded-full bg-gradient-to-r from-primary-500/20 to-accent-500/20"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Center icon */}
        <motion.div
          className="relative z-10 w-14 h-14 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/40"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {stage === 'complete' ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10 }}
            >
              <CheckCircle className="w-7 h-7 text-white" />
            </motion.div>
          ) : (
            <Shield className="w-7 h-7 text-white" />
          )}
        </motion.div>

        {/* Orbiting particles */}
        {stage !== 'complete' && [0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary-400"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 1,
            }}
            style={{
              transformOrigin: '50px 50px',
            }}
          />
        ))}
      </div>

      {/* Progress Steps */}
      <div className="space-y-3">
        {stages.map((s, index) => {
          const isActive = index === currentStageIndex;
          const isComplete = index < currentStageIndex;
          const isPending = index > currentStageIndex;

          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-primary-500/20 border border-primary-500/40'
                  : isComplete
                  ? 'bg-green-500/10 border border-green-500/20'
                  : 'bg-white/5 border border-white/10'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isActive
                    ? 'bg-primary-500 text-white'
                    : isComplete
                    ? 'bg-green-500 text-white'
                    : 'bg-white/10 text-gray-500'
                }`}
              >
                {isComplete ? (
                  <CheckCircle className="w-4 h-4" />
                ) : isActive ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <s.icon className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <s.icon className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1">
                <div
                  className={`font-medium text-sm ${
                    isActive ? 'text-primary-400' : isComplete ? 'text-green-400' : 'text-gray-500'
                  }`}
                >
                  {s.label}
                </div>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-gray-400"
                  >
                    {s.description}
                  </motion.div>
                )}
              </div>
              {isActive && (
                <motion.div
                  className="w-2 h-2 rounded-full bg-primary-400"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Hash animation */}
      {stage !== 'complete' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 p-3 rounded-lg bg-black/30 border border-white/10"
        >
          <div className="text-xs text-gray-500 mb-1">Transaction Hash</div>
          <motion.div
            className="font-mono text-xs text-primary-400 overflow-hidden"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            0x{Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

// Simpler inline loader for smaller spaces
export function BlockchainLoaderInline() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <motion.div
          className="w-5 h-5 rounded-full border-2 border-primary-500/30 border-t-primary-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <span className="text-sm text-gray-400">Processing on blockchain...</span>
    </div>
  );
}
