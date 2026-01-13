'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRODUCTS } from '@/lib/stripe';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMinutes?: number;
  userEmail?: string;
}

interface PromoDiscount {
  id: string;
  code: string;
  percentOff: number | null;
  amountOff: number | null;
  currency: string | null;
}

type TabType = 'packages' | 'subscriptions';

export function PricingModal({ isOpen, onClose, currentMinutes = 0, userEmail }: PricingModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('packages');
  const [loading, setLoading] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState(userEmail || '');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState<PromoDiscount | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [validatingPromo, setValidatingPromo] = useState(false);

  const email = userEmail || emailInput;

  const validatePromoCode = useCallback(async () => {
    if (!promoCode.trim()) return;

    setValidatingPromo(true);
    setPromoError(null);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode.trim() }),
      });

      const data = await response.json();

      if (data.valid) {
        setPromoDiscount(data.discount);
        setPromoError(null);
      } else {
        setPromoDiscount(null);
        setPromoError('Invalid promo code');
      }
    } catch {
      setPromoError('Failed to validate code');
      setPromoDiscount(null);
    } finally {
      setValidatingPromo(false);
    }
  }, [promoCode]);

  const clearPromo = () => {
    setPromoCode('');
    setPromoDiscount(null);
    setPromoError(null);
  };

  const handlePurchase = async (type: 'package' | 'subscription', productId: string) => {
    if (!email) {
      alert('Please enter your email to purchase');
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
          email,
          promoCode: promoDiscount ? promoCode.trim() : undefined,
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

  const getDiscountedPrice = (originalPrice: number) => {
    if (!promoDiscount) return originalPrice;
    if (promoDiscount.percentOff) {
      return originalPrice * (1 - promoDiscount.percentOff / 100);
    }
    if (promoDiscount.amountOff) {
      return Math.max(0, originalPrice - promoDiscount.amountOff);
    }
    return originalPrice;
  };

  const packages = Object.entries(PRODUCTS.packages);
  const subscriptions = Object.entries(PRODUCTS.subscriptions);
  const needsEmail = !userEmail;

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

              {/* Email input if needed */}
              {needsEmail && (
                <div className="mt-4">
                  <input
                    type="email"
                    placeholder="Enter your email to purchase"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
              )}

              {/* Promo code input */}
              <div className="mt-4">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Promo code"
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value);
                        if (promoDiscount) setPromoDiscount(null);
                        if (promoError) setPromoError(null);
                      }}
                      className={`w-full px-4 py-2 rounded-lg bg-white/5 border text-white placeholder-white/30 focus:outline-none transition-colors ${
                        promoDiscount
                          ? 'border-emerald-500/50'
                          : promoError
                          ? 'border-red-500/50'
                          : 'border-white/10 focus:border-cyan-500/50'
                      }`}
                    />
                    {promoDiscount && (
                      <button
                        onClick={clearPromo}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <button
                    onClick={validatePromoCode}
                    disabled={!promoCode.trim() || validatingPromo || !!promoDiscount}
                    className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/15 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {validatingPromo ? '...' : promoDiscount ? 'Applied' : 'Apply'}
                  </button>
                </div>
                {promoDiscount && (
                  <p className="text-emerald-400 text-sm mt-2">
                    {promoDiscount.percentOff
                      ? `${promoDiscount.percentOff}% off applied!`
                      : `$${promoDiscount.amountOff} off applied!`}
                  </p>
                )}
                {promoError && (
                  <p className="text-red-400 text-sm mt-2">{promoError}</p>
                )}
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
                    {packages.map(([id, pkg]) => {
                      const discountedPrice = getDiscountedPrice(pkg.price);
                      const hasDiscount = promoDiscount && discountedPrice < pkg.price;
                      return (
                        <div
                          key={id}
                          className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all"
                        >
                          <h3 className="text-lg font-medium text-white/90">{pkg.name}</h3>
                          <div className="mt-3">
                            {hasDiscount ? (
                              <>
                                <span className="text-lg text-white/40 line-through mr-2">${pkg.price}</span>
                                <span className="text-3xl font-light text-emerald-400">${discountedPrice.toFixed(2)}</span>
                              </>
                            ) : (
                              <span className="text-3xl font-light text-white">${pkg.price}</span>
                            )}
                          </div>
                          <p className="text-white/50 text-sm mt-2">
                            {pkg.minutes} minutes
                            {'savings' in pkg && pkg.savings && !hasDiscount && (
                              <span className="ml-2 text-emerald-400">Save {pkg.savings}</span>
                            )}
                          </p>
                          <ul className="mt-4 space-y-2 text-xs text-white/60">
                            <li className="flex items-start gap-2">
                              <svg className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span>Voice consultations with AI experts</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <svg className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span>Full conversation transcripts</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <svg className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span>Never expires</span>
                            </li>
                          </ul>
                          <button
                            onClick={() => handlePurchase('package', id)}
                            disabled={loading === id || !email}
                            className="w-full mt-4 px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                          >
                            {loading === id ? 'Loading...' : 'Continue'}
                          </button>
                        </div>
                      );
                    })}
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
                    {subscriptions.map(([id, sub]) => {
                      const discountedPrice = getDiscountedPrice(sub.price);
                      const hasDiscount = promoDiscount && discountedPrice < sub.price;
                      return (
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
                            {hasDiscount ? (
                              <>
                                <span className="text-lg text-white/40 line-through mr-2">${sub.price}</span>
                                <span className="text-3xl font-light text-emerald-400">${discountedPrice.toFixed(2)}</span>
                              </>
                            ) : (
                              <span className="text-3xl font-light text-white">${sub.price}</span>
                            )}
                            <span className="text-white/50 text-sm">/month</span>
                          </div>
                          <p className="text-white/50 text-sm mt-2">
                            {sub.monthlyMinutes === -1 ? 'Unlimited' : `${sub.monthlyMinutes} min/month`}
                            {'savings' in sub && sub.savings && !hasDiscount && (
                              <span className="ml-2 text-emerald-400">Save {sub.savings}</span>
                            )}
                          </p>
                          <ul className="mt-4 space-y-2 text-xs text-white/60">
                            <li className="flex items-start gap-2">
                              <svg className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span>{sub.monthlyMinutes === -1 ? 'Unlimited' : `${sub.monthlyMinutes}`} minutes per month</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <svg className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span>All conversation transcripts</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <svg className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span>Priority support</span>
                            </li>
                          </ul>
                          <button
                            onClick={() => handlePurchase('subscription', id)}
                            disabled={loading === id || !email}
                            className={`w-full mt-4 px-4 py-2.5 rounded-lg text-sm font-medium transition-opacity disabled:opacity-50 ${
                              id === 'professional'
                                ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white hover:opacity-90'
                                : 'bg-white/10 text-white hover:bg-white/15'
                            }`}
                          >
                            {loading === id ? 'Loading...' : 'Subscribe'}
                          </button>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/10 text-center space-y-2">
              <div className="flex items-center justify-center gap-4 text-xs text-white/50">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Cancel anytime</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Transcript delivered</span>
                </div>
              </div>
              <p className="text-white/30 text-xs">
                Secure payments powered by Stripe
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
