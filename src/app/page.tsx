'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Only import Clerk if configured
const hasClerk = typeof window !== 'undefined'
  ? !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  : !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
import { SalesProvider, useSales } from '@/components/sales/SalesProvider';
import { CroweAIChat } from '@/components/conversation/CroweAIChat';
import { AgentSelector } from '@/components/agents/AgentSelector';
import { CustomVoiceConversation } from '@/components/agents/interfaces/CustomVoiceConversation';
import { useSessionStore } from '@/stores/sessionStore';
import type { Agent } from '@/config/agents';
import { Hero } from '@/components/sections/Hero';
import { Services } from '@/components/sections/Services';
import { Products } from '@/components/sections/Products';
import { Footer as SectionFooter } from '@/components/sections/Footer';

type Phase = 'intro' | 'home' | 'agents' | 'conversation';

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
      className="fixed top-6 left-6 z-20 flex items-center gap-3 px-3 py-2 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-white/20 transition-colors duration-300"
    >
      <div className="w-10 h-10 rounded-xl overflow-hidden ring-1 ring-white/10 shadow-[0_0_16px_rgba(212,161,95,0.35)]">
        <img src="/crowe-avatar.png" alt="MC" className="w-full h-full object-cover" />
      </div>
      <div>
        <h1 className="text-lg font-display font-bold text-white tracking-tight">
          Crowe <span className="gradient-text">Logic</span>
        </h1>
        <p className="text-xs text-white/50 font-medium tracking-[0.25em] uppercase">Research Studio</p>
      </div>
    </motion.div>
  );
}





// Dynamic import for Clerk components (only when configured)
const ClerkComponents = dynamic(
  () => import('@clerk/nextjs').then((mod) => ({
    default: function ClerkAuth() {
      return (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed top-6 right-6 z-20"
        >
          <mod.SignedOut>
            <mod.SignInButton mode="modal">
              <button className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm hover:bg-white/10 hover:text-white transition-all">
                Sign In
              </button>
            </mod.SignInButton>
          </mod.SignedOut>
          <mod.SignedIn>
            <mod.UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-10 h-10 ring-2 ring-[#d4a15f]/30',
                },
              }}
            />
          </mod.SignedIn>
        </motion.div>
      );
    },
  })),
  { ssr: false, loading: () => null }
);

function AuthButtons() {
  // Don't render Clerk components if not configured
  if (!hasClerk) return null;
  return <ClerkComponents />;
}

function HomeContent() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const sales = useSales();
  const { reset: resetSession } = useSessionStore();

  // Fallback timer in case 3D doesn't load
  useEffect(() => {
    const fallback = setTimeout(() => {
      if (phase === 'intro') setPhase('home');
    }, 5000);
    return () => clearTimeout(fallback);
  }, [phase]);

  // Listen for ElevenLabs events (for sales integration)
  useEffect(() => {
    const handleClientTool = (event: CustomEvent) => {
      const { tool_name, parameters } = event.detail || {};

      if (tool_name === 'open_checkout' && parameters?.url) {
        sales.openCheckout(parameters.url);
      }
      if (tool_name === 'show_product' && parameters?.product_id) {
        sales.showProduct(parameters.product_id);
      }
    };

    const handleAgentResponse = (event: CustomEvent) => {
      const { message } = event.detail || {};
      if (!message) return;

      const lowerMsg = message.toLowerCase();
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
  }, [sales]);

  // Listen for successful checkout (URL param)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      sales.celebratePurchase();
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [sales]);

  const handleStartDeepDive = () => {
    setPhase('agents');
  };

  const handleAgentSelect = (agent: Agent) => {
    setSelectedAgent(agent);
    setPhase('conversation');
  };

  const handleConversationEnd = () => {
    resetSession();
    setSelectedAgent(null);
    setPhase('home');
  };

  const handleBackToHome = () => {
    setPhase('home');
  };

  const showUI = phase !== 'intro';

  return (
    <main className={`relative min-h-screen bg-[#050506] ${phase === 'home' ? 'overflow-y-auto overflow-x-hidden' : 'overflow-hidden'}`}>
      {/* 3D Background - Fixed */}
      <div className="fixed inset-0 z-0">
        <IntroScene onIntroComplete={() => setPhase('home')} />
      </div>

      {/* Branding */}
      {showUI && phase !== 'conversation' && <Branding />}

      {/* Auth buttons (top right) */}
      {showUI && phase !== 'conversation' && <AuthButtons />}

      {/* Phase content */}
      <AnimatePresence mode="wait">
        {phase === 'home' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10"
          >
            <Hero onStartDeepDive={handleStartDeepDive} />
            <Services />
            <Products />
            <SectionFooter />
          </motion.div>
        )}

        {phase === 'agents' && (
          <AgentSelector
            key="agents"
            onSelect={handleAgentSelect}
            onBack={handleBackToHome}
          />
        )}

        {phase === 'conversation' && selectedAgent && (
          <CustomVoiceConversation
            key="conversation"
            agent={selectedAgent}
            onEnd={handleConversationEnd}
          />
        )}
      </AnimatePresence>

      {/* Legacy chat orb - still available as fallback - moved to bottom right fixed */}
      {showUI && phase === 'home' && (
        <div className="fixed bottom-6 right-6 z-50">
          <CroweAIChat />
        </div>
      )}
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
