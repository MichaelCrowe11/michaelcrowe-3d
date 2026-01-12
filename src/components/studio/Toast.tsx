'use client';

import { motion } from 'framer-motion';

interface ToastProps {
  message: string;
  type?: 'error' | 'success' | 'info';
  onClose?: () => void;
}

export function Toast({ message, type = 'error', onClose }: ToastProps) {
  const edgeColors = {
    error: 'border-l-red-500',
    success: 'border-l-emerald-500',
    info: 'border-l-cyan-500',
  };
  
  const glowColors = {
    error: 'shadow-red-500/20',
    success: 'shadow-emerald-500/20',
    info: 'shadow-cyan-500/20',
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className={`glass-panel px-6 py-4 rounded-2xl border-l-4 ${edgeColors[type]} shadow-2xl ${glowColors[type]} max-w-md`}
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-white/90 text-sm font-medium">{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white/80 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </motion.div>
  );
}
