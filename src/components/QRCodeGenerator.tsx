'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Download, Copy, CheckCircle, Smartphone } from 'lucide-react';

interface QRCodeGeneratorProps {
  value?: string;
  size?: number;
  showDownload?: boolean;
}

export default function QRCodeGenerator({
  value = typeof window !== 'undefined' ? window.location.href : 'https://vaultheir.com',
  size = 200,
  showDownload = true
}: QRCodeGeneratorProps) {
  const [copied, setCopied] = useState(false);
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    // Generate QR code using Google Charts API (simple, no dependencies)
    const encodedValue = encodeURIComponent(value);
    setQrUrl(`https://chart.googleapis.com/chart?cht=qr&chs=${size}x${size}&chl=${encodedValue}&choe=UTF-8`);
  }, [value, size]);

  const copyLink = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = 'vaultheir-qr-code.png';
    link.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-2xl p-6 border border-white/10"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center">
          <Smartphone className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Mobile Access</h3>
          <p className="text-sm text-gray-400">Scan to open on your phone</p>
        </div>
      </div>

      {/* QR Code Display */}
      <div className="relative bg-white rounded-xl p-4 mb-4">
        {qrUrl ? (
          <img
            src={qrUrl}
            alt="QR Code"
            className="w-full h-auto"
            style={{ imageRendering: 'pixelated' }}
          />
        ) : (
          <div className="w-full aspect-square flex items-center justify-center bg-gray-100 rounded-lg">
            <QrCode className="w-12 h-12 text-gray-400 animate-pulse" />
          </div>
        )}

        {/* Overlay logo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">V</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <motion.button
          onClick={copyLink}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 text-sm text-gray-300 transition-all"
        >
          {copied ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-400" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Link
            </>
          )}
        </motion.button>

        {showDownload && (
          <motion.button
            onClick={downloadQR}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 text-sm text-white font-medium"
          >
            <Download className="w-4 h-4" />
            Download
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
