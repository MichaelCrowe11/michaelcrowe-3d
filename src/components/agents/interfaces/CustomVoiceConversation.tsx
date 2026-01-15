'use client';

import { useState, useEffect, useCallback } from 'react';
import { useConversation } from '@elevenlabs/react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Agent } from '@/config/agents';
import { useSessionStore } from '@/stores/sessionStore';
import { PricingModal } from '@/components/pricing/PricingModal';
import { getAgentInterfaceConfig } from '@/config/agentInterfaces';
import { CustomStatusOrb } from './CustomStatusOrb';
import { CustomSuggestedTopics } from './CustomSuggestedTopics';

interface CustomVoiceConversationProps {
  agent: Agent;
  onEnd: () => void;
}

interface CreditsInfo {
  canStartSession: boolean;
  availableMinutes: number;
  source: 'subscription' | 'credits' | 'none';
  balanceMinutes: number;
}

export function CustomVoiceConversation({ agent, onEnd }: CustomVoiceConversationProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [credits, setCredits] = useState<CreditsInfo | null>(null);
  const [showPricing, setShowPricing] = useState(false);
  const { elapsedSeconds, tick, startConversation, endConversation } = useSessionStore();
  
  // Get agent-specific interface config
  const interfaceConfig = getAgentInterfaceConfig(agent.id);
  const theme = interfaceConfig?.theme;

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to agent');
      startConversation();
    },
    onDisconnect: () => {
      console.log('Disconnected from agent');
      endConversation();
    },
    onError: (err) => {
      console.error('Conversation error:', err);
      setError('Connection error. Please try again.');
    },
  });

  const { status, isSpeaking } = conversation;

  // Check credits and fetch signed URL on mount
  useEffect(() => {
    async function initialize() {
      try {
        // First check credits - include credentials for Clerk auth
        const creditsResponse = await fetch('/api/credits', {
          credentials: 'include',
        });
        if (creditsResponse.ok) {
          const creditsData = await creditsResponse.json();
          setCredits(creditsData);

          if (!creditsData.canStartSession) {
            setShowPricing(true);
            return;
          }
        }

        // Then get signed URL - include credentials for Clerk auth
        const response = await fetch(`/api/agents/${agent.id}/session`, {
          method: 'POST',
          credentials: 'include',
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError('Please sign in to start a consultation');
            return;
          }
          if (response.status === 402) {
            setShowPricing(true);
            return;
          }
          throw new Error('Failed to create session');
        }

        const data = await response.json();
        setSignedUrl(data.signedUrl);
      } catch (err) {
        console.error('Session error:', err);
        setError('Failed to start session. Please try again.');
      }
    }

    initialize();
  }, [agent.id]);

  // Timer
  useEffect(() => {
    if (status !== 'connected') return;

    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [status, tick]);

  const handleStart = useCallback(async () => {
    if (!signedUrl) return;
    setError(null);

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({ signedUrl });
    } catch (err) {
      console.error('Start error:', err);
      setError('Microphone access required for voice conversation');
    }
  }, [signedUrl, conversation]);

  const handleEnd = useCallback(async () => {
    // Record usage before ending
    if (elapsedSeconds > 0) {
      try {
        await fetch('/api/usage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            agentId: agent.id,
            durationSeconds: elapsedSeconds,
          }),
        });
      } catch (err) {
        console.error('Failed to record usage:', err);
      }
    }

    await conversation.endSession();
    onEnd();
  }, [conversation, onEnd, elapsedSeconds, agent.id]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const estimatedCost = (elapsedSeconds / 60) * agent.pricing.perMinute;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-10 flex flex-col items-center justify-center p-4 md:p-8 overflow-y-auto"
      style={{
        background: `radial-gradient(circle at 50% 50%, ${theme?.glowColor || 'rgba(34, 211, 238, 0.15)'} 0%, rgba(0,0,0,0.4) 70%)`,
      }}
    >
      {/* Back button - enhanced visibility */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={handleEnd}
        className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white/80 hover:text-white hover:bg-white/15 transition-all"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="font-medium">End Session</span>
      </motion.button>

      {/* Agent info with custom theme - enhanced visibility */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 md:mb-8 mt-16 md:mt-0"
      >
        <h2 className="text-3xl md:text-4xl font-display font-semibold text-white mb-3 drop-shadow-lg">
          {agent.name}
        </h2>
        <p className="text-white/70 text-lg font-medium">{interfaceConfig?.welcomeMessage || agent.tagline}</p>
      </motion.div>

      {/* Custom Status Orb with agent-specific styling */}
      <CustomStatusOrb
        status={status}
        isSpeaking={isSpeaking}
        theme={theme}
        orbStyle={interfaceConfig?.orbStyle || 'standard'}
      />

      {/* Custom Suggested topics with agent-specific topics */}
      {status === 'connected' && !isSpeaking && interfaceConfig && (
        <CustomSuggestedTopics
          topics={interfaceConfig.suggestedTopics}
          theme={theme}
        />
      )}

      {/* Timer and credits - enhanced visibility and prominence */}
      {status === 'connected' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-6 md:mb-8 w-full max-w-md mx-auto px-4"
        >
          <div 
            className="p-6 md:p-8 bg-white/10 backdrop-blur-xl rounded-3xl border-2 shadow-2xl"
            style={{ 
              borderColor: theme?.primaryColor || 'rgba(34, 211, 238, 0.3)',
              boxShadow: `0 0 40px ${theme?.glowColor || 'rgba(34, 211, 238, 0.2)'}`
            }}
          >
            {/* Elapsed time - more prominent */}
            <div className="mb-6">
              <div className="text-white/60 text-sm uppercase tracking-widest mb-2 font-semibold">Elapsed Time</div>
              <div className="text-5xl md:text-6xl font-mono font-bold text-white drop-shadow-lg">
                {formatTime(elapsedSeconds)}
              </div>
            </div>
            
            {/* Current cost - more prominent */}
            <div className="mb-6 pb-6 border-b border-white/20">
              <div className="text-white/60 text-sm uppercase tracking-widest mb-2 font-semibold">Current Cost</div>
              <div 
                className="text-3xl md:text-4xl font-bold drop-shadow-lg"
                style={{ color: theme?.primaryColor || '#22d3ee' }}
              >
                ${estimatedCost.toFixed(2)}
              </div>
            </div>

            {/* Free minutes remaining or balance - more prominent */}
            <div>
              <div className="text-white/60 text-sm uppercase tracking-widest mb-2 font-semibold">
                {credits?.availableMinutes === -1 ? 'Plan Status' : 'Minutes Remaining'}
              </div>
              <div className={`text-2xl md:text-3xl font-bold drop-shadow-lg ${
                credits?.availableMinutes === -1 
                  ? 'text-emerald-400' 
                  : Math.max(0, (credits?.availableMinutes || 0) - Math.ceil(elapsedSeconds / 60)) < 5
                  ? 'text-amber-400'
                  : 'text-white'
              }`}>
                {credits?.availableMinutes === -1
                  ? 'Unlimited'
                  : `${Math.max(0, (credits?.availableMinutes || 0) - Math.ceil(elapsedSeconds / 60))} min`}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Credits balance (when not connected) - enhanced visibility */}
      {status === 'disconnected' && credits && !showPricing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 text-center p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 max-w-sm mx-auto"
        >
          <div className="text-white/70 text-base font-medium">
            {credits.availableMinutes === -1 ? (
              <span className="text-emerald-400 text-lg font-semibold">✓ Unlimited plan active</span>
            ) : (
              <>
                <span className="text-white text-xl font-bold">{credits.availableMinutes} minutes</span> available
                {credits.source === 'subscription' && (
                  <span className="ml-2 text-sm" style={{ color: theme?.primaryColor }}>
                    (subscription)
                  </span>
                )}
              </>
            )}
          </div>
          <button
            onClick={() => setShowPricing(true)}
            className="mt-3 text-sm text-white/50 hover:text-white/80 transition-colors underline decoration-dotted underline-offset-2"
          >
            Get more minutes →
          </button>
        </motion.div>
      )}

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls - enhanced visibility */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex gap-4 mb-6"
      >
        {status === 'disconnected' && (
          <button
            onClick={handleStart}
            disabled={!signedUrl}
            className="px-10 py-5 rounded-2xl text-white text-lg font-bold hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-2xl"
            style={{
              background: signedUrl 
                ? `linear-gradient(135deg, ${theme?.primaryColor || '#22d3ee'}, ${theme?.secondaryColor || '#10b981'})`
                : 'rgba(255, 255, 255, 0.1)',
              boxShadow: signedUrl ? `0 0 30px ${theme?.glowColor || 'rgba(34, 211, 238, 0.3)'}` : 'none'
            }}
          >
            {signedUrl ? '🎙️ Start Deep Dive' : 'Connecting...'}
          </button>
        )}

        {status === 'connected' && (
          <button
            onClick={handleEnd}
            className="px-10 py-5 rounded-2xl bg-red-500/30 border-2 border-red-500/50 text-red-200 hover:bg-red-500/40 transition-all flex items-center gap-3 text-lg font-bold shadow-2xl"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2h2m3-4H9a2 2 0 00-2 2v7a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-1m-1 4l-3 3m0 0l-3-3m3 3V3" />
            </svg>
            End & Save Transcript
          </button>
        )}
      </motion.div>

      {/* Hint - enhanced visibility */}
      {status === 'disconnected' && !error && !showPricing && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-white/50 text-base font-medium flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          Microphone access required for voice conversation
        </motion.p>
      )}

      {/* Pricing Modal */}
      <PricingModal
        isOpen={showPricing}
        onClose={() => {
          setShowPricing(false);
          if (!credits?.canStartSession) {
            onEnd(); // Go back if no credits
          }
        }}
        currentMinutes={credits?.balanceMinutes || 0}
      />
    </motion.div>
  );
}
