'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type AvatarState = 'idle' | 'speaking' | 'listening';

export function SimliAvatar() {
  const [state, setState] = useState<AvatarState>('idle');
  const [isMinimized, setIsMinimized] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const animationRef = useRef<number | null>(null);

  // Listen for ElevenLabs widget events
  useEffect(() => {
    const handleAgentResponse = () => setState('speaking');
    const handleUserTranscript = () => setState('listening');
    const handleConversationEnded = () => setState('idle');

    // ElevenLabs ConvAI custom events
    window.addEventListener('elevenlabs-convai:agent-response', handleAgentResponse as EventListener);
    window.addEventListener('elevenlabs-convai:user-transcript', handleUserTranscript as EventListener);
    window.addEventListener('elevenlabs-convai:conversation-ended', handleConversationEnded as EventListener);

    // Also poll the widget state as backup
    const pollInterval = setInterval(() => {
      const widget = document.querySelector('elevenlabs-convai');
      if (widget) {
        const shadowRoot = widget.shadowRoot;
        if (shadowRoot) {
          // Check for active conversation indicators
          const isActive = shadowRoot.querySelector('[data-state="open"]') ||
                          shadowRoot.querySelector('.speaking') ||
                          shadowRoot.querySelector('[aria-busy="true"]');
          if (isActive && state === 'idle') {
            setState('speaking');
          }
        }
      }
    }, 500);

    return () => {
      window.removeEventListener('elevenlabs-convai:agent-response', handleAgentResponse as EventListener);
      window.removeEventListener('elevenlabs-convai:user-transcript', handleUserTranscript as EventListener);
      window.removeEventListener('elevenlabs-convai:conversation-ended', handleConversationEnded as EventListener);
      clearInterval(pollInterval);
    };
  }, [state]);

  // Animate audio levels when speaking
  useEffect(() => {
    if (state === 'speaking') {
      const animate = () => {
        const time = Date.now() / 1000;
        const base = 0.4;
        const wave = Math.sin(time * 8) * 0.2 + Math.sin(time * 13) * 0.15 + Math.sin(time * 21) * 0.1;
        const random = Math.random() * 0.15;
        setAudioLevel(Math.min(1, Math.max(0, base + wave + random)));
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
    } else {
      setAudioLevel(0);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [state]);

  // Auto-reset to idle after period of no activity
  useEffect(() => {
    if (state !== 'idle') {
      const timeout = setTimeout(() => setState('idle'), 30000);
      return () => clearTimeout(timeout);
    }
  }, [state]);

  const stateConfig = {
    idle: {
      ringColor: 'ring-gray-600/30',
      glowColor: 'rgba(100, 100, 100, 0.2)',
      label: 'Ready',
      dotColor: 'bg-green-500'
    },
    speaking: {
      ringColor: 'ring-cyan-500/60',
      glowColor: `rgba(34, 211, 238, ${0.3 + audioLevel * 0.4})`,
      label: 'Speaking',
      dotColor: 'bg-cyan-500'
    },
    listening: {
      ringColor: 'ring-emerald-500/60',
      glowColor: 'rgba(16, 185, 129, 0.4)',
      label: 'Listening',
      dotColor: 'bg-emerald-500'
    },
  };

  const config = stateConfig[state];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed z-50 transition-all duration-300 ${
          isMinimized
            ? 'bottom-6 left-6 w-16 h-16'
            : 'bottom-6 left-6 w-48 h-56'
        }`}
      >
        <motion.div
          className={`relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 shadow-2xl ring-4 ${config.ringColor} transition-all duration-200`}
          style={{
            boxShadow: `0 0 ${20 + audioLevel * 40}px ${config.glowColor}, 0 10px 40px rgba(0,0,0,0.5)`,
          }}
          animate={{
            scale: state === 'speaking' ? 1 + audioLevel * 0.015 : 1,
          }}
          transition={{ duration: 0.1 }}
        >
          {/* Photo */}
          <div className="absolute inset-0">
            <img
              src="/crowe-avatar.png"
              alt="Crowe Logic"
              className="w-full h-full object-contain p-3"
              style={{
                filter: state === 'speaking'
                  ? `brightness(${1.05 + audioLevel * 0.1})`
                  : 'brightness(1)',
              }}
            />

            {/* Speaking pulse rings */}
            {state === 'speaking' && (
              <>
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-2xl border-2 border-cyan-400/40"
                    initial={{ scale: 1, opacity: 0.6 }}
                    animate={{ scale: 1.15 + i * 0.08, opacity: 0 }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: i * 0.4,
                      ease: 'easeOut',
                    }}
                  />
                ))}
              </>
            )}

            {/* Listening indicator */}
            {state === 'listening' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-16 h-16 rounded-full border-4 border-emerald-400/60 flex items-center justify-center"
                  animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <svg className="w-7 h-7 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 18.75a4.5 4.5 0 004.5-4.5V6a4.5 4.5 0 10-9 0v8.25a4.5 4.5 0 004.5 4.5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M7.5 10.5v3a4.5 4.5 0 009 0v-3M12 18.75v2.25" />
                  </svg>
                </motion.div>
              </div>
            )}

            {/* Audio visualizer bars */}
            {state === 'speaking' && !isMinimized && (
              <div className="absolute bottom-8 left-0 right-0 flex justify-center items-end gap-0.5 h-6 px-4">
                {[...Array(16)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-gradient-to-t from-cyan-400 to-cyan-300 rounded-full"
                    animate={{
                      height: `${4 + audioLevel * 16 * Math.abs(Math.sin(Date.now() / 80 + i * 0.5))}px`,
                    }}
                    transition={{ duration: 0.05 }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

          {/* Status indicator */}
          {!isMinimized && (
            <div className="absolute bottom-2 left-2 flex items-center gap-2">
              <motion.div
                className={`w-2 h-2 rounded-full ${config.dotColor}`}
                animate={{
                  scale: state === 'speaking' ? [1, 1.4, 1] : 1,
                  opacity: state === 'idle' ? 0.7 : 1
                }}
                transition={{ duration: 0.5, repeat: state === 'speaking' ? Infinity : 0 }}
              />
              <span className="text-white/80 text-xs font-medium">{config.label}</span>
            </div>
          )}

          {/* Name badge */}
          {!isMinimized && (
            <div className="absolute bottom-2 right-2">
              <div className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm">
                <span className="text-white/90 text-xs font-medium">Crowe Logic</span>
              </div>
            </div>
          )}

          {/* Minimize button */}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/50 hover:bg-black/70 text-white/60 hover:text-white transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMinimized ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              )}
            </svg>
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Keep placeholder export for compatibility
export function SimliAvatarPlaceholder() {
  return <SimliAvatar />;
}
