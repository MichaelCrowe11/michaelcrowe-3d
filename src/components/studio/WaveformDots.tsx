'use client';

import { motion } from 'framer-motion';

interface WaveformDotsProps {
  isActive?: boolean;
  dotCount?: number;
  className?: string;
}

export function WaveformDots({ isActive = false, dotCount = 5, className = '' }: WaveformDotsProps) {
  return (
    <div className={`flex items-center justify-center gap-1.5 ${className}`}>
      {Array.from({ length: dotCount }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-gradient-to-t from-cyan-400 to-cyan-300"
          animate={
            isActive
              ? {
                  scaleY: [1, 2, 1, 1.5, 1],
                  opacity: [0.6, 1, 0.6, 0.8, 0.6],
                }
              : { scaleY: 1, opacity: 0.3 }
          }
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
