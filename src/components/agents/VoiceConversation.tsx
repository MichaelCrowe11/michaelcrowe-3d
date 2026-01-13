'use client';

import { useState, useEffect, useCallback } from 'react';
import { useConversation } from '@elevenlabs/react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Agent } from '@/config/agents';
import { useSessionStore } from '@/stores/sessionStore';
import { PricingModal } from '@/components/pricing/PricingModal';

interface VoiceConversationProps {
  agent: Agent;
  onEnd: () => void;
}

interface CreditsInfo {
  canStartSession: boolean;
  availableMinutes: number;
  source: 'subscription' | 'credits' | 'none';
  balanceMinutes: number;
}

export function VoiceConversation({ agent, onEnd }: VoiceConversationProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [credits, setCredits] = useState<CreditsInfo | null>(null);
  const [showPricing, setShowPricing] = useState(false);
  const { elapsedSeconds, tick, startConversation, endConversation } = useSessionStore();

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
      className="fixed inset-0 z-10 flex flex-col items-center justify-center p-8"
    >
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={handleEnd}
        className="absolute top-6 left-6 flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        End Session
      </motion.button>

      {/* Agent info */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-light text-white/90 mb-2">
          {agent.name}
        </h2>
        <p className="text-white/50">{agent.tagline}</p>
      </motion.div>

      {/* Status orb */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative mb-12"
      >
        <div
          className={`w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center transition-all duration-500 ${
            status === 'connected'
              ? isSpeaking
                ? 'bg-gradient-to-br from-cyan-500 to-emerald-500 shadow-[0_0_60px_rgba(34,211,238,0.5)]'
                : 'bg-gradient-to-br from-cyan-500/50 to-emerald-500/50 shadow-[0_0_30px_rgba(34,211,238,0.3)]'
              : 'bg-white/10'
          }`}
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
                  className="w-3 h-3 bg-cyan-400 rounded-full"
                />
              ))}
            </div>
          ) : (
            <span className="text-white/40">Ready</span>
          )}
        </div>

        {/* Pulse rings when speaking */}
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
                  className="absolute inset-0 rounded-full border-2 border-cyan-400/30"
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Suggested topics (shown when connected but not speaking) */}
      {status === 'connected' && !isSpeaking && agent.category === 'life-sciences' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-wrap gap-2 justify-center max-w-md"
          role="region"
          aria-label="Suggested conversation topics"
        >
          <p className="w-full text-center text-white/40 text-xs mb-2">Suggested topics (speak to ask):</p>
          <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm">
            Virtual screening
          </span>
          <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm">
            DFT / QM help
          </span>
          <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm">
            Roadmap + tools
          </span>
        </motion.div>
      )}

      {status === 'connected' && !isSpeaking && agent.category === 'cultivation' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-wrap gap-2 justify-center max-w-md"
          role="region"
          aria-label="Suggested conversation topics"
        >
          <p className="w-full text-center text-white/40 text-xs mb-2">Suggested topics (speak to ask):</p>
          <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm">
            Substrate formulation
          </span>
          <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm">
            Contamination help
          </span>
          <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm">
            Scaling operations
          </span>
        </motion.div>
      )}

      {status === 'connected' && !isSpeaking && agent.category === 'ai-strategy' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-wrap gap-2 justify-center max-w-md"
          role="region"
          aria-label="Suggested conversation topics"
        >
          <p className="w-full text-center text-white/40 text-xs mb-2">Suggested topics (speak to ask):</p>
          <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm">
            LLM selection
          </span>
          <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm">
            Agent architecture
          </span>
          <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm">
            Cost optimization
          </span>
        </motion.div>
      )}

      {/* Timer and credits */}
      {status === 'connected' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-8"
        >
          <div className="mb-6 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 max-w-sm mx-auto">
            {/* Elapsed time */}
            <div className="mb-4">
              <div className="text-white/50 text-xs uppercase tracking-wider mb-1">Elapsed Time</div>
              <div className="text-4xl md:text-5xl font-mono text-white/90">
                {formatTime(elapsedSeconds)}
              </div>
            </div>
            
            {/* Current cost */}
            <div className="mb-4 pb-4 border-b border-white/10">
              <div className="text-white/50 text-xs uppercase tracking-wider mb-1">Current Cost</div>
              <div className="text-2xl font-semibold text-cyan-400">
                ${estimatedCost.toFixed(2)}
              </div>
            </div>

            {/* Free minutes remaining or balance */}
            <div>
              <div className="text-white/50 text-xs uppercase tracking-wider mb-1">
                {credits?.availableMinutes === -1 ? 'Plan Status' : 'Minutes Remaining'}
              </div>
              <div className={`text-lg font-medium ${
                credits?.availableMinutes === -1 
                  ? 'text-emerald-400' 
                  : Math.max(0, (credits?.availableMinutes || 0) - Math.ceil(elapsedSeconds / 60)) < 5
                  ? 'text-amber-400'
                  : 'text-white/70'
              }`}>
                {credits?.availableMinutes === -1
                  ? 'Unlimited'
                  : `${Math.max(0, (credits?.availableMinutes || 0) - Math.ceil(elapsedSeconds / 60))} min`}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Credits balance (when not connected) */}
      {status === 'disconnected' && credits && !showPricing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 text-center"
        >
          <div className="text-white/50 text-sm">
            {credits.availableMinutes === -1 ? (
              <span className="text-emerald-400">Unlimited plan active</span>
            ) : (
              <>
                <span className="text-white/70">{credits.availableMinutes} min</span> available
                {credits.source === 'subscription' && (
                  <span className="ml-2 text-cyan-400">(subscription)</span>
                )}
              </>
            )}
          </div>
          <button
            onClick={() => setShowPricing(true)}
            className="mt-2 text-xs text-white/30 hover:text-white/50 transition-colors"
          >
            Get more minutes
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

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex gap-4"
      >
        {status === 'disconnected' && (
          <button
            onClick={handleStart}
            disabled={!signedUrl}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {signedUrl ? 'Start Deep Dive' : 'Connecting...'}
          </button>
        )}

        {status === 'connected' && (
          <button
            onClick={handleEnd}
            className="px-8 py-4 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2h2m3-4H9a2 2 0 00-2 2v7a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-1m-1 4l-3 3m0 0l-3-3m3 3V3" />
            </svg>
            End & Save Transcript
          </button>
        )}
      </motion.div>

      {/* Hint */}
      {status === 'disconnected' && !error && !showPricing && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-white/30 text-sm"
        >
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
