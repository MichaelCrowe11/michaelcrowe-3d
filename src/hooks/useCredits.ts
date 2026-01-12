'use client';

import { useState, useEffect, useCallback } from 'react';

interface CreditStatus {
  canStart: boolean;
  availableMinutes: number;
  source: 'subscription' | 'credits' | 'none';
  subscriptionTier: string | null;
  balanceMinutes: number;
  subscriptionMinutesRemaining: number;
  isLoading: boolean;
  error: string | null;
}

interface UseCreditsOptions {
  email?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

const DEFAULT_STATUS: CreditStatus = {
  canStart: false,
  availableMinutes: 0,
  source: 'none',
  subscriptionTier: null,
  balanceMinutes: 0,
  subscriptionMinutesRemaining: 0,
  isLoading: true,
  error: null,
};

export function useCredits(options: UseCreditsOptions = {}) {
  const { email, autoRefresh = false, refreshInterval = 60000 } = options;
  const [status, setStatus] = useState<CreditStatus>(DEFAULT_STATUS);

  const fetchCredits = useCallback(async () => {
    if (!email) {
      setStatus({ ...DEFAULT_STATUS, isLoading: false });
      return;
    }

    try {
      const userId = `email_${Buffer.from(email).toString('base64').slice(0, 20)}`;
      const response = await fetch(`/api/credits?userId=${encodeURIComponent(userId)}`);

      if (!response.ok) {
        throw new Error('Failed to fetch credits');
      }

      const data = await response.json();

      setStatus({
        canStart: data.canStart,
        availableMinutes: data.availableMinutes,
        source: data.source,
        subscriptionTier: data.subscriptionTier,
        balanceMinutes: data.balanceMinutes,
        subscriptionMinutesRemaining: data.subscriptionMinutesRemaining,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error fetching credits:', error);
      setStatus(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load credit status',
      }));
    }
  }, [email]);

  const refresh = useCallback(() => {
    setStatus(prev => ({ ...prev, isLoading: true }));
    fetchCredits();
  }, [fetchCredits]);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  useEffect(() => {
    if (!autoRefresh || !email) return;

    const interval = setInterval(fetchCredits, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchCredits, email]);

  // Computed properties
  const isLowCredits = status.availableMinutes > 0 && status.availableMinutes <= 5;
  const isOutOfCredits = !status.canStart && !status.isLoading;
  const hasSubscription = !!status.subscriptionTier;
  const isUnlimited = status.subscriptionTier === 'unlimited';

  // Format display string
  const displayMinutes = isUnlimited
    ? 'Unlimited'
    : `${status.availableMinutes} minutes`;

  return {
    ...status,
    isLowCredits,
    isOutOfCredits,
    hasSubscription,
    isUnlimited,
    displayMinutes,
    refresh,
  };
}

// Hook for tracking session usage
export function useSessionUsage(email?: string) {
  const [isTracking, setIsTracking] = useState(false);
  const [sessionStart, setSessionStart] = useState<Date | null>(null);

  const startSession = useCallback(() => {
    setSessionStart(new Date());
    setIsTracking(true);
  }, []);

  const endSession = useCallback(async (agentId: string) => {
    if (!sessionStart || !email || !isTracking) return null;

    setIsTracking(false);
    const endTime = new Date();
    const durationSeconds = Math.floor((endTime.getTime() - sessionStart.getTime()) / 1000);

    try {
      const userId = `email_${Buffer.from(email).toString('base64').slice(0, 20)}`;
      const response = await fetch('/api/usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          agentId,
          durationSeconds,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to record usage');
      }

      const data = await response.json();
      setSessionStart(null);
      return data;
    } catch (error) {
      console.error('Error recording usage:', error);
      return null;
    }
  }, [email, sessionStart, isTracking]);

  const getElapsedMinutes = useCallback(() => {
    if (!sessionStart || !isTracking) return 0;
    return Math.floor((new Date().getTime() - sessionStart.getTime()) / 60000);
  }, [sessionStart, isTracking]);

  return {
    isTracking,
    sessionStart,
    startSession,
    endSession,
    getElapsedMinutes,
  };
}
