'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { AgentInterfaceTheme } from '@/config/agentInterfaces';

interface CustomStatusOrbProps {
  status: 'connected' | 'connecting' | 'disconnected' | 'disconnecting';
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
      : `linear-gradient(135deg, ${theme?.primaryColor || '#22d3ee'}90, ${theme?.secondaryColor || '#10b981'}90)`
    : status === 'connecting'
    ? 'rgba(255, 255, 255, 0.2)'
    : 'rgba(255, 255, 255, 0.15)';

  const shadowStyle = status === 'connected'
    ? isSpeaking
      ? `0 0 80px ${theme?.glowColor || 'rgba(34, 211, 238, 0.6)'}, 0 0 40px ${theme?.glowColor || 'rgba(34, 211, 238, 0.4)'}`
      : `0 0 50px ${theme?.glowColor || 'rgba(34, 211, 238, 0.4)'}, 0 0 25px ${theme?.glowColor || 'rgba(34, 211, 238, 0.3)'}`
    : status === 'connecting'
    ? `0 0 25px ${theme?.glowColor || 'rgba(34, 211, 238, 0.3)'}`
    : `0 0 15px rgba(255, 255, 255, 0.1)`;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="relative mb-8 md:mb-12"
    >
      <motion.div
        animate={getOrbAnimation()}
        transition={{ duration: orbStyle === 'animated' ? 2 : 0.5, repeat: isSpeaking ? Infinity : 0 }}
        className="w-40 h-40 md:w-48 md:h-48 rounded-full flex items-center justify-center transition-all duration-500 backdrop-blur-sm border-2"
        style={{
          background: orbBgStyle,
          boxShadow: shadowStyle,
          borderColor: theme?.primaryColor ? `${theme.primaryColor}40` : 'rgba(34, 211, 238, 0.3)',
        }}
      >
        {status === 'connected' ? (
          <motion.div
            animate={isSpeaking ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="text-white text-center px-6"
          >
            <div className="text-xl md:text-2xl font-bold mb-2 drop-shadow-lg">
              {isSpeaking ? '🗣️ Speaking' : '👂 Listening'}
            </div>
            <div className="text-sm md:text-base font-medium text-white/80">
              {isSpeaking ? 'Agent responding...' : 'Your turn to speak'}
            </div>
          </motion.div>
        ) : status === 'connecting' || status === 'disconnecting' ? (
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: theme?.primaryColor || '#22d3ee' }}
              />
            ))}
          </div>
        ) : (
          <span className="text-white/60 text-lg font-medium">Ready</span>
        )}
      </motion.div>

      {/* Pulse rings when speaking - enhanced visibility */}
      <AnimatePresence>
        {status === 'connected' && isSpeaking && (
          <>
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 1.6 + i * 0.3, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                className="absolute inset-0 rounded-full border-4"
                style={{ borderColor: theme?.pulseColor || 'rgba(34, 211, 238, 0.4)' }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
