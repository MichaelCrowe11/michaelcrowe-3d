'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { AgentInterfaceTheme } from '@/config/agentInterfaces';

interface CustomStatusOrbProps {
  status: 'connected' | 'connecting' | 'disconnected';
  isSpeaking: boolean;
  theme?: AgentInterfaceTheme;
  orbStyle: 'standard' | 'animated' | 'pulsing' | 'morphing';
}

export function CustomStatusOrb({ status, isSpeaking, theme, orbStyle }: CustomStatusOrbProps) {
  const getOrbAnimation = () => {
    switch (orbStyle) {
      case 'animated':
        return isSpeaking ? { scale: [1, 1.1, 1], rotate: [0, 360] } : { scale: 1 };
      case 'pulsing':
        return isSpeaking ? { scale: [1, 1.15, 1] } : {};
      case 'morphing':
        return isSpeaking ? { 
          borderRadius: ['50%', '40%', '50%', '45%', '50%'],
          scale: [1, 1.05, 1.1, 1.05, 1]
        } : {};
      default:
        return isSpeaking ? { scale: [1, 1.1, 1] } : {};
    }
  };

  const orbBgStyle = status === 'connected'
    ? isSpeaking
      ? `linear-gradient(135deg, ${theme?.primaryColor || '#22d3ee'}, ${theme?.secondaryColor || '#10b981'})`
      : `linear-gradient(135deg, ${theme?.primaryColor || '#22d3ee'}80, ${theme?.secondaryColor || '#10b981'}80)`
    : 'rgba(255, 255, 255, 0.1)';

  const shadowStyle = status === 'connected'
    ? isSpeaking
      ? `0 0 60px ${theme?.glowColor || 'rgba(34, 211, 238, 0.5)'}`
      : `0 0 30px ${theme?.glowColor || 'rgba(34, 211, 238, 0.3)'}`
    : 'none';

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="relative mb-12"
    >
      <motion.div
        animate={getOrbAnimation()}
        transition={{ duration: orbStyle === 'animated' ? 2 : 0.5, repeat: isSpeaking ? Infinity : 0 }}
        className="w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center transition-all duration-500"
        style={{
          background: orbBgStyle,
          boxShadow: shadowStyle,
        }}
      >
        {status === 'connected' ? (
          <motion.div
            animate={isSpeaking ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="text-white/90 text-center"
          >
            <div className="text-lg font-medium">
              {isSpeaking ? 'Speaking' : 'Listening'}
            </div>
            <div className="text-sm opacity-60">
              {isSpeaking ? 'Agent responding...' : 'Your turn to speak'}
            </div>
          </motion.div>
        ) : status === 'connecting' ? (
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: theme?.primaryColor || '#22d3ee' }}
              />
            ))}
          </div>
        ) : (
          <span className="text-white/40">Ready</span>
        )}
      </motion.div>

      {/* Pulse rings when speaking - customized per agent */}
      <AnimatePresence>
        {status === 'connected' && isSpeaking && (
          <>
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.5 + i * 0.2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: theme?.pulseColor || 'rgba(34, 211, 238, 0.3)' }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
