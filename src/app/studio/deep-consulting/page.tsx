'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { GlowButton } from '@/components/studio/GlowButton';
import { getActiveAgents } from '@/config/agents';
import { AgentSelector } from '@/components/agents/AgentSelector';
import { VoiceConversation } from '@/components/agents/VoiceConversation';
import { useState } from 'react';
import type { Agent } from '@/config/agents';

export default function DeepConsultingPage() {
  const [phase, setPhase] = useState<'landing' | 'selector' | 'conversation'>('landing');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  
  const handleStartDeepDive = () => {
    setPhase('selector');
  };
  
  const handleAgentSelect = (agent: Agent) => {
    setSelectedAgent(agent);
    setPhase('conversation');
  };
  
  const handleConversationEnd = () => {
    setSelectedAgent(null);
    setPhase('landing');
  };
  
  const handleBack = () => {
    setPhase('landing');
  };
  
  if (phase === 'conversation' && selectedAgent) {
    return (
      <VoiceConversation
        agent={selectedAgent}
        onEnd={handleConversationEnd}
      />
    );
  }
  
  if (phase === 'selector') {
    return (
      <div className="relative min-h-screen bg-[#060607]">
        <OrbitBackground />
        <FloatingBlobs count={2} />
        <AgentSelector onSelect={handleAgentSelect} onBack={handleBack} />
      </div>
    );
  }
  
  return (
    <main className="relative min-h-screen flex items-center justify-center">
    <main className="relative min-h-screen bg-[#060607] flex items-center justify-center">
      <OrbitBackground />
      <FloatingBlobs count={3} />
      
      <div className="relative z-10 px-4 max-w-4xl mx-auto text-center">
        <Link href="/studio" className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors mb-12">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Studio
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-7xl font-display font-bold text-white mb-6 tracking-tight">
            Deep Consulting Workflow
          </h1>
          
          <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-2xl mx-auto">
            Voice-first consulting with domain experts. <br className="hidden md:block" />
            Built for clarity, rigor, and real decisions.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <GlowButton variant="primary" size="lg" onClick={handleStartDeepDive}>
              Start a Deep Dive
            </GlowButton>
            <GlowButton variant="ghost" size="lg" onClick={handleStartDeepDive}>
              Talk to me
            </GlowButton>
          </div>
          
          <p className="text-white/40 text-sm">
            3 min included - $0.40/min after
          </p>
        </motion.div>
        
        {/* Feature highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: (
                <svg className="w-10 h-10 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18.75a4.5 4.5 0 004.5-4.5V6a4.5 4.5 0 10-9 0v8.25a4.5 4.5 0 004.5 4.5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.5 10.5v3a4.5 4.5 0 009 0v-3M12 18.75v2.25" />
                </svg>
              ),
              title: 'Voice-first',
              desc: 'Natural conversation that preserves context and intent.',
            },
            {
              icon: (
                <svg className="w-10 h-10 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 6h3m-4.5 3h6m-7.5 3h9m-10.5 3h12" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 3h12l-1.5 18h-9L6 3z" />
                </svg>
              ),
              title: 'Domain experts',
              desc: 'Specialized knowledge across life sciences and R&D.',
            },
            {
              icon: (
                <svg className="w-10 h-10 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6l4 2" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: 'Session-based',
              desc: 'Transparent timing and clear session boundaries.',
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="glass-card p-6"
            >
              <div className="mb-4 flex items-center justify-center">{feature.icon}</div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-white/60 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
