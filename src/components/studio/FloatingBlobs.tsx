'use client';

import { motion } from 'framer-motion';

interface FloatingBlobsProps {
  count?: number;
  className?: string;
}

export function FloatingBlobs({ count = 3, className = '' }: FloatingBlobsProps) {
  const blobs = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 300 + Math.random() * 200,
    left: `${10 + (i * 30) + Math.random() * 20}%`,
    top: `${10 + (i * 20) + Math.random() * 30}%`,
    delay: i * 2,
    duration: 20 + Math.random() * 10,
    gradient: [
      'from-amber-400/18 to-emerald-400/10',
      'from-slate-400/18 to-sky-400/10',
      'from-emerald-400/18 to-cyan-400/10',
    ][i % 3],
  }));
  
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`}>
      {blobs.map((blob) => (
        <motion.div
          key={blob.id}
          className={`absolute rounded-full blur-3xl bg-gradient-to-br ${blob.gradient}`}
          style={{
            width: blob.size,
            height: blob.size,
            left: blob.left,
            top: blob.top,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: blob.delay,
          }}
        />
      ))}
    </div>
  );
}
