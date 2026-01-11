'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { AccessGate } from '@/components/auth/AccessGate';
import { SalesProvider, useSales } from '@/components/sales/SalesProvider';
import { CroweAIChat } from '@/components/conversation/CroweAIChat';

interface UserInfo {
  name: string;
  email: string;
  company?: string;
  accessType: 'free' | 'paid';
  timestamp: string;
}

const IntroScene = dynamic(
  () => import('@/components/three/IntroScene').then((mod) => mod.IntroScene),
  { ssr: false }
);

function Branding() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="fixed top-6 left-6 z-20 flex items-center gap-3"
    >
      <div className="w-10 h-10 rounded-xl overflow-hidden ring-1 ring-white/10 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
        <img src="/crowe-avatar.png" alt="MC" className="w-full h-full object-cover" />
      </div>
      <div>
        <h1 className="text-lg font-medium text-white/90">
          michael<span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">crowe</span>.ai
        </h1>
        <p className="text-xs text-white/40">AI Consultant</p>
      </div>
    </motion.div>
  );
}

function WelcomeText({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8, duration: 1 }}
      className="fixed inset-0 z-10 flex flex-col items-center justify-center pointer-events-none"
    >
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="text-4xl md:text-6xl font-extralight text-white/90 mb-4 text-center px-4"
      >
        What can I build for you?
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="text-white/40 text-center max-w-md px-4"
      >
        Click the orb to start a conversation
      </motion.p>
    </motion.div>
  );
}

function Footer() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-6 text-white/20 text-xs"
    >
      <a href="mailto:michael@crowelogic.com" className="hover:text-white/50 transition-colors">Contact</a>
      <a href="https://github.com/MichaelCrowe11" className="hover:text-white/50 transition-colors">GitHub</a>
      <span className="text-white/10">© Crowe Logic, Inc.</span>
    </motion.div>
  );
}

function UserBadge({ user, onLogout }: { user: UserInfo; onLogout: () => void }) {
  const firstName = user.name.split(' ')[0];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed top-6 right-6 z-20 flex items-center gap-3"
    >
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white text-sm font-medium">
          {firstName.charAt(0).toUpperCase()}
        </div>
        <span className="text-white/70 text-sm">{firstName}</span>
        {user.accessType === 'paid' && (
          <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-medium">
            PRO
          </span>
        )}
      </div>
      <button
        onClick={onLogout}
        className="p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white/70 transition-colors"
        title="Sign out"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </motion.div>
  );
}

function HomeContent() {
  const [showUI, setShowUI] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [showAccessGate, setShowAccessGate] = useState(false);
  const salesContextRef = useRef<ReturnType<typeof useSales> | null>(null);

  // Try to get sales context (will work after provider mounts)
  try {
    salesContextRef.current = useSales();
  } catch {
    // Context not available yet
  }

  // Check for existing session on mount
  useEffect(() => {
    const stored = localStorage.getItem('mcai_user');
    if (stored) {
      try {
        const userData = JSON.parse(stored) as UserInfo;
        const sessionAge = Date.now() - new Date(userData.timestamp).getTime();
        if (sessionAge < 24 * 60 * 60 * 1000) {
          setUser(userData);
        } else {
          localStorage.removeItem('mcai_user');
        }
      } catch {
        localStorage.removeItem('mcai_user');
      }
    }

    // Fallback: always show UI after 5 seconds in case 3D doesn't load
    const fallback = setTimeout(() => setShowUI(true), 5000);
    return () => clearTimeout(fallback);
  }, []);

  // Listen for ElevenLabs events
  useEffect(() => {
    // Handle client tool calls
    const handleClientTool = (event: CustomEvent) => {
      const { tool_name, parameters } = event.detail || {};
      const sales = salesContextRef.current;

      if (tool_name === 'open_checkout' && parameters?.url) {
        sales?.openCheckout(parameters.url);
      }

      if (tool_name === 'add_to_cart' && parameters?.product_id) {
        sales?.showProduct(parameters.product_id);
      }

      if (tool_name === 'show_product' && parameters?.product_id) {
        sales?.showProduct(parameters.product_id);
      }
    };

    // Handle agent responses to detect product mentions
    const handleAgentResponse = (event: CustomEvent) => {
      const { message } = event.detail || {};
      const sales = salesContextRef.current;
      if (!message || !sales) return;

      const lowerMsg = message.toLowerCase();

      // Show product cards when agent mentions products
      if (lowerMsg.includes('digital edition') || lowerMsg.includes('digital masterclass')) {
        sales.showProduct('prod_TluqIRTGNTLkXC');
      }
      if (lowerMsg.includes('hardcover') || lowerMsg.includes('premium edition')) {
        sales.showProduct('prod_TVswtN5lJzcvjo');
      }
      if (lowerMsg.includes('consult') || lowerMsg.includes('session')) {
        sales.showProduct('prod_TluqOymLTmLRHM');
      }
      if (lowerMsg.includes('ai access') || lowerMsg.includes('premium access')) {
        sales.showProduct('prod_Tlt4EQ1eEP9KTd');
      }

      // Celebrate purchases
      if (lowerMsg.includes('purchase complete') || lowerMsg.includes('payment successful')) {
        sales.celebratePurchase();
      }
    };

    window.addEventListener('elevenlabs-convai:client-tool' as any, handleClientTool as EventListener);
    window.addEventListener('elevenlabs-convai:agent-response' as any, handleAgentResponse as EventListener);

    return () => {
      window.removeEventListener('elevenlabs-convai:client-tool' as any, handleClientTool as EventListener);
      window.removeEventListener('elevenlabs-convai:agent-response' as any, handleAgentResponse as EventListener);
    };
  }, []);

  // Listen for successful checkout (URL param)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      salesContextRef.current?.celebratePurchase();
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const handleAccessGranted = (userData: UserInfo) => {
    setUser(userData);
    setShowAccessGate(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('mcai_user');
    setUser(null);
  };

  return (
    <main className="relative min-h-screen bg-[#030303] overflow-hidden">
      {/* 3D Background */}
      <IntroScene onIntroComplete={() => setShowUI(true)} />

      {/* Branding */}
      {showUI && <Branding />}

      {/* User Badge (top right) */}
      {showUI && user && <UserBadge user={user} onLogout={handleLogout} />}

      {/* Welcome text - always visible */}
      <WelcomeText visible={showUI} />

      {/* Footer */}
      {showUI && <Footer />}

      {/* Access Gate Modal - only when triggered */}
      {showAccessGate && !user && (
        <AccessGate onAccessGranted={handleAccessGranted} />
      )}

      {/* Custom Crowe AI Chat - replaces ElevenLabs widget */}
      {showUI && <CroweAIChat />}
    </main>
  );
}

// Wrap with SalesProvider for product cards and celebrations
export default function Home() {
  return (
    <SalesProvider>
      <HomeContent />
    </SalesProvider>
  );
}
