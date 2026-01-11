'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  velocity: { x: number; y: number };
}

interface PurchaseCelebrationProps {
  show: boolean;
  productName?: string;
  onComplete?: () => void;
}

export function PurchaseCelebration({ show, productName, onComplete }: PurchaseCelebrationProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (show) {
      // Create confetti particles
      const colors = ['#22d3ee', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];
      const newParticles: Particle[] = [];

      for (let i = 0; i < 100; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: -20,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 10 + 5,
          rotation: Math.random() * 360,
          velocity: {
            x: (Math.random() - 0.5) * 10,
            y: Math.random() * 5 + 3,
          },
        });
      }

      setParticles(newParticles);

      // Clear after animation
      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Confetti Particles */}
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                initial={{
                  x: particle.x,
                  y: particle.y,
                  rotate: particle.rotation,
                  opacity: 1,
                }}
                animate={{
                  y: window.innerHeight + 100,
                  x: particle.x + particle.velocity.x * 50,
                  rotate: particle.rotation + 720,
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  ease: 'easeOut',
                }}
                style={{
                  position: 'absolute',
                  width: particle.size,
                  height: particle.size,
                  backgroundColor: particle.color,
                  borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                }}
              />
            ))}
          </div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl text-center max-w-md mx-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Purchase Complete!
              </h2>
              {productName && (
                <p className="text-white/70">
                  Thank you for purchasing<br />
                  <span className="text-cyan-400 font-semibold">{productName}</span>
                </p>
              )}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.5, duration: 2 }}
                className="h-1 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full mt-4"
              />
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
