'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import { PRODUCTS } from '@/lib/stripe';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMinutes?: number;
}

type TabType = 'packages' | 'subscriptions';

export function PricingModal({ isOpen, onClose, currentMinutes = 0 }: PricingModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('packages');
  const [loading, setLoading] = useState<string | null>(null);
  const { user } = useUser();

  const handlePurchase = async (type: 'package' | 'subscription', productId: string) => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      alert('Please sign in to purchase');
      return;
    }

    setLoading(productId);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          productId,
          email: user.primaryEmailAddress.emailAddress,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Checkout failed');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const packages = Object.entries(PRODUCTS.packages);
  const subscriptions = Object.entries(PRODUCTS.subscriptions);

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
            className="w-full max-w-3xl bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-light text-white/90">Get More Minutes</h2>
                  <p className="text-white/50 text-sm mt-1">
                    Current balance: {currentMinutes} minutes
                  </p>
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
                <button
                  onClick={() => setActiveTab('packages')}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    activeTab === 'packages'
                      ? 'bg-white/10 text-white'
                      : 'text-white/50 hover:text-white/70'
                  }`}
                >
                  Minute Packs
                </button>
                <button
                  onClick={() => setActiveTab('subscriptions')}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    activeTab === 'subscriptions'
                      ? 'bg-white/10 text-white'
                      : 'text-white/50 hover:text-white/70'
                  }`}
                >
                  Monthly Plans
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {activeTab === 'packages' && (
                  <motion.div
                    key="packages"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    {packages.map(([id, pkg]) => (
                      <div
                        key={id}
                        className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all"
                      >
                        <h3 className="text-lg font-medium text-white/90">{pkg.name}</h3>
                        <div className="mt-3">
                          <span className="text-3xl font-light text-white">${pkg.price}</span>
                        </div>
                        <p className="text-white/50 text-sm mt-2">
                          {pkg.minutes} minutes
                          {'savings' in pkg && pkg.savings && (
                            <span className="ml-2 text-emerald-400">Save {pkg.savings}</span>
                          )}
                        </p>
                        <button
                          onClick={() => handlePurchase('package', id)}
                          disabled={loading === id}
                          className="w-full mt-4 px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                          {loading === id ? 'Loading...' : 'Buy Now'}
                        </button>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'subscriptions' && (
                  <motion.div
                    key="subscriptions"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    {subscriptions.map(([id, sub]) => (
                      <div
                        key={id}
                        className={`p-5 rounded-xl border transition-all ${
                          id === 'professional'
                            ? 'bg-gradient-to-b from-cyan-500/10 to-transparent border-cyan-500/30'
                            : 'bg-white/5 border-white/10 hover:border-cyan-500/30'
                        }`}
                      >
                        {id === 'professional' && (
                          <span className="text-xs text-cyan-400 font-medium">MOST POPULAR</span>
                        )}
                        <h3 className="text-lg font-medium text-white/90 mt-1">{sub.name}</h3>
                        <div className="mt-3">
                          <span className="text-3xl font-light text-white">${sub.price}</span>
                          <span className="text-white/50 text-sm">/month</span>
                        </div>
                        <p className="text-white/50 text-sm mt-2">
                          {sub.monthlyMinutes === -1 ? 'Unlimited' : `${sub.monthlyMinutes} min/month`}
                          {'savings' in sub && sub.savings && (
                            <span className="ml-2 text-emerald-400">Save {sub.savings}</span>
                          )}
                        </p>
                        <button
                          onClick={() => handlePurchase('subscription', id)}
                          disabled={loading === id}
                          className={`w-full mt-4 px-4 py-2.5 rounded-lg text-sm font-medium transition-opacity disabled:opacity-50 ${
                            id === 'professional'
                              ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white hover:opacity-90'
                              : 'bg-white/10 text-white hover:bg-white/15'
                          }`}
                        >
                          {loading === id ? 'Loading...' : 'Subscribe'}
                        </button>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/10 text-center">
              <p className="text-white/30 text-xs">
                Secure payments powered by Stripe. Cancel anytime.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
