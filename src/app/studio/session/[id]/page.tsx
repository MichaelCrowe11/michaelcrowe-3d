'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StatusOrb } from '@/components/studio/StatusOrb';
import { Toast } from '@/components/studio/Toast';
import { use } from 'react';

type SessionState = 'ready' | 'connecting' | 'listening' | 'failed';

export default function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [state, setState] = useState<SessionState>('ready');
  const [showError, setShowError] = useState(false);
  
  // Simulate state transitions (replace with actual session logic)
  useEffect(() => {
    // TODO: Implement actual session connection logic
    // This is just a demo of state transitions
    const timer = setTimeout(() => {
      if (state === 'ready') {
        setState('connecting');
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [state]);
  
  const handleRetry = () => {
    setShowError(false);
    setState('ready');
  };
  
  return (
    <main className="relative min-h-screen flex items-center justify-center">
      <div className="relative z-10 px-4">
        {/* Status Orb */}
        <StatusOrb status={state === 'failed' ? 'ready' : state} />
        
        {/* Helper text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-white/40 text-sm mt-8"
        >
          Session ID: {id}
        </motion.p>
      </div>
      
      {/* Error Toast */}
      <AnimatePresence>
        {showError && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <Toast
              message="Failed to start session. Please try again."
              type="error"
              onClose={() => setShowError(false)}
            />
          </div>
        )}
      </AnimatePresence>
      
      {/* Debug controls (remove in production) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        <button
          onClick={() => setState('ready')}
          className="px-4 py-2 rounded-lg glass-button text-white/70 text-xs"
        >
          Ready
        </button>
        <button
          onClick={() => setState('connecting')}
          className="px-4 py-2 rounded-lg glass-button text-white/70 text-xs"
        >
          Connecting
        </button>
        <button
          onClick={() => setState('listening')}
          className="px-4 py-2 rounded-lg glass-button text-white/70 text-xs"
        >
          Listening
        </button>
        <button
          onClick={() => {
            setState('failed');
            setShowError(true);
          }}
          className="px-4 py-2 rounded-lg glass-button text-white/70 text-xs"
        >
          Fail
        </button>
      </div>
    </main>
  );
}
