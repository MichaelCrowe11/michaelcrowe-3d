'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SalesMetrics {
  totalRevenue: number;
  subscriptionRevenue: number;
  packageRevenue: number;
  activeSubscriptions: number;
  totalCustomers: number;
  newCustomers: number;
  recentCharges: Array<{
    id: string;
    amount: number;
    status: string;
    created: number;
    description: string | null;
    customer: string | null;
  }>;
  subscriptions: Array<{
    id: string;
    status: string;
    plan: string;
    amount: number;
    currentPeriodEnd: number;
  }>;
  usageStats: {
    totalMinutesUsed: number;
    totalSessions: number;
    averageSessionLength: number;
  } | null;
}

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  adminEmail: string;
}

type Period = '7d' | '30d' | '90d';

export function AdminDashboard({ isOpen, onClose, adminEmail }: AdminDashboardProps) {
  const [metrics, setMetrics] = useState<SalesMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<Period>('30d');

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/sales?period=${period}`, {
        headers: {
          'x-admin-email': adminEmail,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - admin access required');
        }
        throw new Error('Failed to fetch metrics');
      }

      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [period, adminEmail]);

  useEffect(() => {
    if (isOpen) {
      fetchMetrics();
    }
  }, [isOpen, fetchMetrics]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
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
            className="w-full max-w-4xl bg-[#0b0c0f] border border-white/10 rounded-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-light text-white/90">Sales Dashboard</h2>
                  <p className="text-white/50 text-sm mt-1">Revenue & usage analytics</p>
                </div>
                <div className="flex items-center gap-4">
                  {/* Period Selector */}
                  <div className="flex gap-1 bg-white/5 rounded-lg p-1">
                    {(['7d', '30d', '90d'] as Period[]).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPeriod(p)}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          period === p
                            ? 'bg-white/10 text-white'
                            : 'text-white/50 hover:text-white/70'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
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
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {loading && !metrics && (
                <div className="text-center py-12 text-white/50">
                  Loading metrics...
                </div>
              )}

              {error && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
                  {error}
                </div>
              )}

              {metrics && (
                <div className="space-y-6">
                  {/* Revenue Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20">
                      <p className="text-emerald-400/70 text-sm font-medium">Total Revenue</p>
                      <p className="text-3xl font-light text-white mt-2">
                        {formatCurrency(metrics.totalRevenue)}
                      </p>
                      <p className="text-white/40 text-xs mt-1">Last {period}</p>
                    </div>

                    <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-white/50 text-sm">Subscriptions MRR</p>
                      <p className="text-2xl font-light text-white mt-2">
                        {formatCurrency(metrics.subscriptionRevenue)}
                      </p>
                      <p className="text-white/40 text-xs mt-1">
                        {metrics.activeSubscriptions} active
                      </p>
                    </div>

                    <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-white/50 text-sm">Package Sales</p>
                      <p className="text-2xl font-light text-white mt-2">
                        {formatCurrency(metrics.packageRevenue)}
                      </p>
                      <p className="text-white/40 text-xs mt-1">One-time purchases</p>
                    </div>
                  </div>

                  {/* Customer & Usage Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-white/50 text-sm">New Customers</p>
                      <p className="text-2xl font-light text-white mt-1">
                        {metrics.newCustomers}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-white/50 text-sm">Total Customers</p>
                      <p className="text-2xl font-light text-white mt-1">
                        {metrics.totalCustomers}
                      </p>
                    </div>

                    {metrics.usageStats && (
                      <>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                          <p className="text-white/50 text-sm">Total Sessions</p>
                          <p className="text-2xl font-light text-white mt-1">
                            {metrics.usageStats.totalSessions}
                          </p>
                        </div>

                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                          <p className="text-white/50 text-sm">Minutes Used</p>
                          <p className="text-2xl font-light text-white mt-1">
                            {metrics.usageStats.totalMinutesUsed}
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Recent Charges */}
                  <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                    <div className="p-4 border-b border-white/10">
                      <h3 className="text-lg font-medium text-white/90">Recent Charges</h3>
                    </div>
                    <div className="divide-y divide-white/5 max-h-64 overflow-y-auto">
                      {metrics.recentCharges.length === 0 ? (
                        <div className="p-4 text-center text-white/40">
                          No charges in this period
                        </div>
                      ) : (
                        metrics.recentCharges.slice(0, 10).map((charge) => (
                          <div
                            key={charge.id}
                            className="p-4 flex items-center justify-between hover:bg-white/5"
                          >
                            <div>
                              <p className="text-white/90 text-sm">
                                {charge.description || 'Payment'}
                              </p>
                              <p className="text-white/40 text-xs mt-1">
                                {formatDate(charge.created)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className={`font-medium ${
                                charge.status === 'succeeded'
                                  ? 'text-emerald-400'
                                  : 'text-red-400'
                              }`}>
                                {formatCurrency(charge.amount)}
                              </p>
                              <p className="text-white/40 text-xs capitalize">
                                {charge.status}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Active Subscriptions */}
                  {metrics.subscriptions.length > 0 && (
                    <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                      <div className="p-4 border-b border-white/10">
                        <h3 className="text-lg font-medium text-white/90">Active Subscriptions</h3>
                      </div>
                      <div className="divide-y divide-white/5 max-h-64 overflow-y-auto">
                        {metrics.subscriptions.map((sub) => (
                          <div
                            key={sub.id}
                            className="p-4 flex items-center justify-between hover:bg-white/5"
                          >
                            <div>
                              <p className="text-white/90 text-sm">{sub.plan}</p>
                              <p className="text-white/40 text-xs mt-1">
                                Renews {formatDate(sub.currentPeriodEnd)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-white font-medium">
                                {formatCurrency(sub.amount)}/mo
                              </p>
                              <span className="inline-block px-2 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-400">
                                {sub.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/10 flex justify-between items-center shrink-0">
              <button
                onClick={fetchMetrics}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/15 transition-colors disabled:opacity-50"
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
              <a
                href="https://dashboard.stripe.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1"
              >
                Open Stripe Dashboard
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
