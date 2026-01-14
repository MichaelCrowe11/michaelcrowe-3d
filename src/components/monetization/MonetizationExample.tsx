'use client';

/**
 * Access Integration Example
 *
 * This component demonstrates how to integrate access features:
 * - Credit balance display and alerts
 * - Pricing modal for access changes
 * - Account dashboard for plan management
 * - Admin dashboard for usage tracking
 * - Session usage tracking
 *
 * Copy and adapt this pattern for your own pages.
 */

import { useState, useCallback } from 'react';
import { PricingModal } from '@/components/pricing/PricingModal';
import { CreditAlert, CreditBadge } from '@/components/pricing/CreditAlert';
import { AccountDashboard } from '@/components/account/AccountDashboard';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { useCredits, useSessionUsage } from '@/hooks/useCredits';

interface MonetizationExampleProps {
  userEmail: string;
  isAdmin?: boolean;
}

export function MonetizationExample({ userEmail, isAdmin = false }: MonetizationExampleProps) {
  // Modal states
  const [showPricing, setShowPricing] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  // Credit status hook
  const credits = useCredits({ email: userEmail, autoRefresh: true });

  // Session tracking hook
  const session = useSessionUsage(userEmail);

  // Example: Start a session with an agent
  const handleStartSession = useCallback(async () => {
    if (!credits.canStart) {
      setShowPricing(true);
      return;
    }
    session.startSession();
    // Your agent interaction code here
  }, [credits.canStart, session]);

  // Example: End session and record usage
  const handleEndSession = useCallback(async (agentId: string) => {
    const result = await session.endSession(agentId);
    if (result) {
      console.log(`Session recorded: ${result.minutesCharged} minutes (${result.billingType})`);
    }
    // Refresh credits after session ends
    credits.refresh();
  }, [session, credits]);

  return (
    <div className="p-6 space-y-6">
      {/* Credit Alert - Shows when low/out of credits */}
      <CreditAlert email={userEmail} onUpgradeClick={() => setShowPricing(true)} />

      {/* Header with credit badge */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-light text-white">Your App</h1>
        <div className="flex items-center gap-4">
          <CreditBadge email={userEmail} onClick={() => setShowAccount(true)} />

          {isAdmin && (
            <button
              onClick={() => setShowAdmin(true)}
              className="px-4 py-2 rounded-lg bg-[#d4a15f]/15 border border-[#d4a15f]/30 text-[#d4a15f] hover:bg-[#d4a15f]/25 transition-colors"
            >
              Admin
            </button>
          )}
        </div>
      </div>

      {/* Credit Status Display */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10">
        <h2 className="text-lg font-medium text-white/90 mb-4">Credit Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-white/50 text-sm">Available</p>
            <p className="text-2xl font-light text-white">{credits.displayMinutes}</p>
          </div>
          <div>
            <p className="text-white/50 text-sm">Subscription</p>
            <p className="text-2xl font-light text-white">
              {credits.subscriptionTier || 'None'}
            </p>
          </div>
          <div>
            <p className="text-white/50 text-sm">Credit Balance</p>
            <p className="text-2xl font-light text-white">{credits.balanceMinutes} min</p>
          </div>
          <div>
            <p className="text-white/50 text-sm">Can Start Session</p>
            <p className={`text-2xl font-light ${credits.canStart ? 'text-emerald-400' : 'text-red-400'}`}>
              {credits.canStart ? 'Yes' : 'No'}
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setShowPricing(true)}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-medium hover:opacity-90 transition-opacity"
          >
            Add minutes
          </button>
          <button
            onClick={() => setShowAccount(true)}
            className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/15 transition-colors"
          >
            Manage Account
          </button>
        </div>
      </div>

      {/* Session Tracking Demo */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10">
        <h2 className="text-lg font-medium text-white/90 mb-4">Session Tracking Demo</h2>
        <div className="flex items-center gap-4">
          {!session.isTracking ? (
            <button
              onClick={handleStartSession}
              disabled={!credits.canStart}
              className="px-4 py-2 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Session
            </button>
          ) : (
            <>
              <span className="text-white/70">
                Session running: {session.getElapsedMinutes()} minutes
              </span>
              <button
                onClick={() => handleEndSession('demo-agent')}
                className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
              >
                End Session
              </button>
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <PricingModal
        isOpen={showPricing}
        onClose={() => setShowPricing(false)}
        currentMinutes={credits.availableMinutes}
        userEmail={userEmail}
      />

      <AccountDashboard
        isOpen={showAccount}
        onClose={() => setShowAccount(false)}
        userEmail={userEmail}
      />

      {isAdmin && (
        <AdminDashboard
          isOpen={showAdmin}
          onClose={() => setShowAdmin(false)}
          adminEmail={userEmail}
        />
      )}
    </div>
  );
}

/**
 * Usage Example:
 *
 * ```tsx
 * import { MonetizationExample } from '@/components/monetization/MonetizationExample';
 *
 * export default function MyPage() {
 *   const userEmail = 'user@example.com'; // Get from your auth system
 *   const isAdmin = userEmail === 'michael@michaelcrowe.ai';
 *
 *   return (
 *     <MonetizationExample userEmail={userEmail} isAdmin={isAdmin} />
 *   );
 * }
 * ```
 */
