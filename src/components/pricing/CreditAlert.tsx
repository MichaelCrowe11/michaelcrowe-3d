'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCredits } from '@/hooks/useCredits';

interface CreditAlertProps {
  email?: string;
  onUpgradeClick?: () => void;
}

export function CreditAlert({ email, onUpgradeClick }: CreditAlertProps) {
  const [dismissed, setDismissed] = useState(false);
  const credits = useCredits({ email, autoRefresh: true, refreshInterval: 30000 });

  // Don't show if loading, dismissed, has plenty of credits, or no email
  if (credits.isLoading || dismissed || !email) return null;
  if (!credits.isLowCredits && !credits.isOutOfCredits) return null;

  const isOut = credits.isOutOfCredits;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`fixed top-4 right-4 z-40 max-w-sm p-4 rounded-xl border backdrop-blur-sm ${
          isOut
            ? 'bg-red-500/10 border-red-500/30'
            : 'bg-amber-500/10 border-amber-500/30'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${isOut ? 'bg-red-500/20' : 'bg-amber-500/20'}`}>
            {isOut ? (
              <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>

          <div className="flex-1">
            <h4 className={`font-medium ${isOut ? 'text-red-400' : 'text-amber-400'}`}>
              {isOut ? 'Out of Minutes' : 'Low Minutes'}
            </h4>
            <p className="text-white/70 text-sm mt-1">
              {isOut
                ? 'Purchase minutes to continue using AI agents.'
                : `Only ${credits.availableMinutes} minutes remaining.`}
            </p>

            <div className="flex gap-2 mt-3">
              {onUpgradeClick && (
                <button
                  onClick={onUpgradeClick}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                    isOut
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-amber-500 text-black hover:bg-amber-400'
                  } transition-colors`}
                >
                  Get Minutes
                </button>
              )}
              {!isOut && (
                <button
                  onClick={() => setDismissed(true)}
                  className="px-3 py-1.5 rounded-lg text-sm text-white/50 hover:text-white/70 transition-colors"
                >
                  Dismiss
                </button>
              )}
            </div>
          </div>

          <button
            onClick={() => setDismissed(true)}
            className="text-white/30 hover:text-white/50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Inline credit display for use in headers/navbars
export function CreditBadge({ email, onClick }: { email?: string; onClick?: () => void }) {
  const credits = useCredits({ email });

  if (credits.isLoading || !email) {
    return null;
  }

  const badgeColor = credits.isOutOfCredits
    ? 'from-red-500/20 to-red-600/20 border-red-500/30'
    : credits.isLowCredits
    ? 'from-amber-500/20 to-amber-600/20 border-amber-500/30'
    : 'from-white/5 to-white/10 border-white/10';

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full bg-gradient-to-r ${badgeColor} border text-sm text-white/80 hover:text-white transition-colors flex items-center gap-2`}
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>
        {credits.isUnlimited ? 'Unlimited' : `${credits.availableMinutes} min`}
      </span>
    </button>
  );
}
