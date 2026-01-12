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
import { VoiceConversation } from '@/components/agents/VoiceConversation';
import { useSessionStore } from '@/stores/sessionStore';
import type { Agent } from '@/config/agents';

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
      className="fixed top-6 left-6 z-20 flex items-center gap-3 p-2 pr-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/5 hover:border-white/10 transition-colors duration-300"
    >
      <div className="w-10 h-10 rounded-xl overflow-hidden ring-1 ring-white/10 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
        <img src="/crowe-avatar.png" alt="MC" className="w-full h-full object-cover" />
      </div>
      <div>
        <h1 className="text-lg font-display font-bold text-white tracking-tight">
          michael<span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">crowe</span>.ai
        </h1>
        <p className="text-xs text-white/50 font-medium tracking-wide uppercase">AI Consultant</p>
      </div>
    </motion.div>
  );
}

function WelcomeText({ visible, onStartDeepDive }: { visible: boolean; onStartDeepDive: () => void }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
            className="fixed inset-0 z-10 flex flex-col items-center justify-center pointer-events-none" // pointer-events-none allows clicks to pass if needed, but we have a button so carefully check z-index
          >
            {/* Inner container with pointer-events-auto for the button */}
            <div className="pointer-events-auto flex flex-col items-center">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="text-5xl md:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/50 mb-6 text-center px-4 tracking-tighter drop-shadow-2xl"
            >
              Deep Consulting Workflow
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 1 }}
              className="text-cyan-100/60 text-center max-w-md px-4 mb-10 text-lg font-light tracking-wide"
            >
              Voice-first consulting with domain experts. <br/> Pay only for what you use.
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2, duration: 0.5 }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(34,211,238,0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={onStartDeepDive}
              className="px-10 py-5 rounded-full bg-white/5 backdrop-blur-md border border-white/20 text-white font-semibold text-lg hover:bg-white/10 transition-all duration-500 group relative overflow-hidden"
            >
              <span className="relative z-10">Start a Deep Dive</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
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
                  avatarBox: 'w-10 h-10 ring-2 ring-cyan-500/30',
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
    <main className="relative min-h-screen bg-[#030303] overflow-hidden">
      {/* 3D Background */}
      <IntroScene onIntroComplete={() => setPhase('home')} />

      {/* Branding */}
      {showUI && phase !== 'conversation' && <Branding />}

      {/* Auth buttons (top right) */}
      {showUI && phase !== 'conversation' && <AuthButtons />}

      {/* Phase content */}
      <AnimatePresence mode="wait">
        {phase === 'home' && (
          <WelcomeText
            key="welcome"
            visible={true}
            onStartDeepDive={handleStartDeepDive}
          />
        )}

        {phase === 'agents' && (
          <AgentSelector
            key="agents"
            onSelect={handleAgentSelect}
            onBack={handleBackToHome}
          />
        )}

        {phase === 'conversation' && selectedAgent && (
          <VoiceConversation
            key="conversation"
            agent={selectedAgent}
            onEnd={handleConversationEnd}
          />
        )}
      </AnimatePresence>

      {/* Footer - only on home */}
      {phase === 'home' && <Footer />}

      {/* Legacy chat orb - still available as fallback */}
      {showUI && phase === 'home' && <CroweAIChat />}
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
