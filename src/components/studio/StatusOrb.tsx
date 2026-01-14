'use client';

import { motion } from 'framer-motion';

interface StatusOrbProps {
  status: 'ready' | 'connecting' | 'listening';
  className?: string;
}

export function StatusOrb({ status, className = '' }: StatusOrbProps) {
  const statusConfig = {
    ready: {
      color: 'from-[#6fd6cc] to-[#2f7f77]',
      glow: 'shadow-[0_0_20px_rgba(111,214,204,0.5)]',
      label: 'Ready',
    },
    connecting: {
      color: 'from-[#d4a15f] to-[#9a7b4a]',
      glow: 'shadow-[0_0_20px_rgba(212,161,95,0.5)]',
      label: 'Connecting…',
    },
    listening: {
      color: 'from-[#d4a15f] to-[#6fd6cc]',
      glow: 'shadow-[0_0_20px_rgba(212,161,95,0.5)]',
      label: 'Listening…',
    },
  };
  
  const config = statusConfig[status];
  
  return (
    <div className={`flex flex-col items-center gap-6 ${className}`}>
      <motion.div
        animate={
          status === 'listening'
            ? { scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }
            : status === 'connecting'
            ? { rotate: 360 }
            : {}
        }
        transition={
          status === 'listening'
            ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
            : status === 'connecting'
            ? { duration: 2, repeat: Infinity, ease: 'linear' }
            : {}
        }
        className={`w-24 h-24 rounded-full bg-gradient-to-br ${config.color} shadow-2xl ${config.glow} relative`}
      >
        <div className="absolute inset-2 rounded-full bg-black/20 backdrop-blur-sm" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-white/20 to-transparent" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-medium text-white/90"
      >
        {config.label}
      </motion.p>
    </div>
  );
}
