'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCredits } from '@/hooks/useCredits';
import { PricingModal } from '@/components/pricing/PricingModal';

interface UsageRecord {
  id: string;
  agent_id: string;
  duration_seconds: number;
  minutes_charged: number;
  billing_type: string;
  created_at: string;
}

interface AccountDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

export function AccountDashboard({ isOpen, onClose, userEmail }: AccountDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'usage' | 'billing'>('overview');
  const [usageHistory, setUsageHistory] = useState<UsageRecord[]>([]);
  const [loadingUsage, setLoadingUsage] = useState(false);
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  const credits = useCredits({ email: userEmail, autoRefresh: true });

  useEffect(() => {
    if (isOpen && activeTab === 'usage' && usageHistory.length === 0) {
      fetchUsageHistory();
    }
  }, [isOpen, activeTab]);

  const fetchUsageHistory = async () => {
    setLoadingUsage(true);
    try {
      const userId = `email_${Buffer.from(userEmail).toString('base64').slice(0, 20)}`;
      const response = await fetch(`/api/usage?userId=${encodeURIComponent(userId)}`);
      if (response.ok) {
        const data = await response.json();
        setUsageHistory(data.history || []);
      }
    } catch (error) {
      console.error('Failed to fetch usage history:', error);
    } finally {
      setLoadingUsage(false);
    }
  };

  const openBillingPortal = async () => {
    setLoadingPortal(true);
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Unable to open billing portal. Please try again.');
      }
    } catch (error) {
      console.error('Portal error:', error);
      alert('Failed to open billing portal.');
    } finally {
      setLoadingPortal(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-[#0b0c0f] border border-white/10 rounded-2xl overflow-hidden max-h-[85vh] flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10 shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-light text-white/90">Account</h2>
                    <p className="text-white/50 text-sm mt-1">{userEmail}</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white/70 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mt-6">
                  {(['overview', 'usage', 'billing'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-full text-sm capitalize transition-all ${
                        activeTab === tab
                          ? 'bg-white/10 text-white'
                          : 'text-white/50 hover:text-white/70'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto flex-1">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Credits Card */}
                    <div className="p-5 rounded-xl bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/50 text-sm">Available Minutes</p>
                          <p className="text-4xl font-light text-white mt-1">
                            {credits.isLoading ? '...' : credits.displayMinutes}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs ${
                            credits.hasSubscription
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-white/10 text-white/50'
                          }`}>
                            {credits.hasSubscription ? credits.subscriptionTier : 'Free Tier'}
                          </span>
                        </div>
                      </div>

                      {credits.isLowCredits && (
                        <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                          <p className="text-amber-400 text-sm">
                            Running low on minutes. Add more to continue using agents.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-white/50 text-sm">Credit Balance</p>
                        <p className="text-2xl font-light text-white mt-1">
                          {credits.balanceMinutes} min
                        </p>
                      </div>
                      {credits.hasSubscription && (
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                          <p className="text-white/50 text-sm">Subscription Minutes</p>
                          <p className="text-2xl font-light text-white mt-1">
                            {credits.isUnlimited ? 'Unlimited' : `${credits.subscriptionMinutesRemaining} min`}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowPricing(true)}
                        className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-medium hover:opacity-90 transition-opacity"
                      >
                        {credits.hasSubscription ? 'Extend access' : 'Add minutes'}
                      </button>
                      {credits.hasSubscription && (
                        <button
                          onClick={openBillingPortal}
                          disabled={loadingPortal}
                          className="px-4 py-3 rounded-lg bg-white/10 text-white hover:bg-white/15 transition-colors disabled:opacity-50"
                        >
                          {loadingPortal ? 'Loading...' : 'Manage plan'}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'usage' && (
                  <div className="space-y-4">
                    {loadingUsage ? (
                      <div className="text-center py-8 text-white/50">Loading usage history...</div>
                    ) : usageHistory.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-white/50">No usage history yet.</p>
                        <p className="text-white/30 text-sm mt-2">
                          Start a conversation with an agent to see your usage here.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {usageHistory.map((record) => (
                          <div
                            key={record.id}
                            className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between"
                          >
                            <div>
                              <p className="text-white/90 font-medium capitalize">
                                {record.agent_id.replace(/-/g, ' ')}
                              </p>
                              <p className="text-white/50 text-sm">
                                {formatDate(record.created_at)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-white/90">
                                {formatDuration(record.duration_seconds)}
                              </p>
                              <p className="text-white/50 text-xs capitalize">
                                {record.billing_type.replace('_', ' ')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={fetchUsageHistory}
                      disabled={loadingUsage}
                      className="w-full mt-4 px-4 py-2 rounded-lg bg-white/5 text-white/70 hover:bg-white/10 transition-colors disabled:opacity-50"
                    >
                      {loadingUsage ? 'Loading...' : 'Refresh History'}
                    </button>
                  </div>
                )}

                {activeTab === 'billing' && (
                  <div className="space-y-6">
                    {/* Current Plan */}
                    <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                      <h3 className="text-lg font-medium text-white/90">Current Plan</h3>
                      <p className="text-white/50 mt-2">
                        {credits.hasSubscription
                          ? `${credits.subscriptionTier} Subscription`
                          : 'No active subscription'}
                      </p>
                      {credits.hasSubscription && (
                        <button
                          onClick={openBillingPortal}
                          disabled={loadingPortal}
                          className="mt-4 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/15 transition-colors disabled:opacity-50"
                        >
                          {loadingPortal ? 'Loading...' : 'Manage Subscription'}
                        </button>
                      )}
                    </div>

                    {/* Billing Portal */}
                    <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                      <h3 className="text-lg font-medium text-white/90">Account Portal</h3>
                      <p className="text-white/50 mt-2 text-sm">
                        Manage account history, payment methods, and invoices.
                      </p>
                      <button
                        onClick={openBillingPortal}
                        disabled={loadingPortal}
                        className="mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        {loadingPortal ? 'Opening...' : 'Open account portal'}
                      </button>
                    </div>

                    {/* Access Options */}
                    <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                      <h3 className="text-lg font-medium text-white/90">Need more minutes?</h3>
                      <p className="text-white/50 mt-2 text-sm">
                        Add minute packs or set a monthly allowance.
                      </p>
                      <button
                        onClick={() => setShowPricing(true)}
                        className="mt-4 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/15 transition-colors"
                      >
                        View options
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <PricingModal
        isOpen={showPricing}
        onClose={() => setShowPricing(false)}
        currentMinutes={credits.availableMinutes}
        userEmail={userEmail}
      />
    </>
  );
}
