'use client';

import { motion } from 'framer-motion';
import { getActiveAgents, type Agent } from '@/config/agents';
import { HolographicCard } from '../ui/HolographicCard';

const iconMap = {
  Microscope: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 15.5m14.8-.2l.2.2a9 9 0 01-2.1 5.7m-12.8-5.9l-.2.2a9 9 0 002.1 5.7" />
    </svg>
  ),
  Brain: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  ),
  Sprout: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
    </svg>
  ),
  Sparkles: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
  ),
  Flask: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 15.5m14.8-.2l.2.2a9 9 0 01-2.1 5.7m-12.8-5.9l-.2.2a9 9 0 002.1 5.7M9 10.5h6" />
    </svg>
  ),
  Dna: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3c-1.2 0-2.4.6-3 1.5C8.4 5.4 8 6.6 8 8c0 1.4.4 2.6 1 3.5.6.9 1.8 1.5 3 1.5s2.4-.6 3-1.5c.6-.9 1-2.1 1-3.5 0-1.4-.4-2.6-1-3.5-.6-.9-1.8-1.5-3-1.5zM12 13c-1.2 0-2.4.6-3 1.5-.6.9-1 2.1-1 3.5 0 1.4.4 2.6 1 3.5.6.9 1.8 1.5 3 1.5s2.4-.6 3-1.5c.6-.9 1-2.1 1-3.5 0-1.4-.4-2.6-1-3.5-.6-.9-1.8-1.5-3-1.5zM6 8h12M6 18h12M8 13h8" />
    </svg>
  ),
  Atom: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 12m-1 0a1 1 0 102 0 1 1 0 10-2 0M12 12c-4.97 0-9 2.686-9 6s4.03 6 9 6 9-2.686 9-6-4.03-6-9-6zM12 12c4.97 0 9-2.686 9-6s-4.03-6-9-6-9 2.686-9 6 4.03 6 9 6zM12 3v18" />
    </svg>
  ),
};

const colorMap = {
  emerald: {
    bg: 'from-[#6fd6cc]/20 to-[#3faea1]/10',
    border: 'border-white/10 hover:border-[#6fd6cc]/40',
    icon: 'text-[#6fd6cc]',
    badge: 'bg-[#6fd6cc]/15 text-[#b7f1e9]',
  },
  cyan: {
    bg: 'from-[#6fd6cc]/20 to-[#2f7f77]/10',
    border: 'border-white/10 hover:border-[#6fd6cc]/40',
    icon: 'text-[#6fd6cc]',
    badge: 'bg-[#6fd6cc]/15 text-[#b7f1e9]',
  },
  purple: {
    bg: 'from-[#d4a15f]/22 to-[#8f6a3f]/10',
    border: 'border-white/10 hover:border-[#d4a15f]/40',
    icon: 'text-[#d4a15f]',
    badge: 'bg-[#d4a15f]/15 text-[#f1d2a8]',
  },
  amber: {
    bg: 'from-[#f0c27b]/25 to-[#d4a15f]/10',
    border: 'border-white/10 hover:border-[#d4a15f]/40',
    icon: 'text-[#f0c27b]',
    badge: 'bg-[#f0c27b]/15 text-[#ffe0b5]',
  },
  rose: {
    bg: 'from-[#d4a15f]/20 to-[#6b4f2c]/10',
    border: 'border-white/10 hover:border-[#d4a15f]/40',
    icon: 'text-[#d4a15f]',
    badge: 'bg-[#d4a15f]/15 text-[#f1d2a8]',
  },
  indigo: {
    bg: 'from-[#6fd6cc]/20 to-[#244a44]/10',
    border: 'border-white/10 hover:border-[#6fd6cc]/40',
    icon: 'text-[#6fd6cc]',
    badge: 'bg-[#6fd6cc]/15 text-[#b7f1e9]',
  },
};

interface AgentSelectorProps {
  onSelect: (agent: Agent) => void;
  onBack: () => void;
}

export function AgentSelector({ onSelect, onBack }: AgentSelectorProps) {
  const agents = getActiveAgents();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-10 flex flex-col items-center justify-center p-4 md:p-8 overflow-y-auto h-[100dvh]"
    >
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors z-20 p-2 touch-manipulation"
      >
        <svg className="w-6 h-6 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-lg md:text-base">Back</span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-8 mt-20 md:mt-0 px-4"
      >
        <h2 className="text-3xl md:text-4xl font-display text-white/90 mb-3">
          Select Your Specialist
        </h2>
        <p className="text-white/55 max-w-md mx-auto text-sm md:text-base">
          Choose a domain lead to start a focused consultation session.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl w-full pb-20 md:pb-0">
        {agents.map((agent, i) => {
          const colors = colorMap[agent.color];
          const Icon = iconMap[agent.icon];

          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              className="h-full"
            >
              <HolographicCard
                onClick={() => onSelect(agent)}
                glareColor={agent.color}
                className="h-full text-left"
              >
                <div className={`${colors.icon} mb-3`}>
                  {Icon}
                </div>

                <h3 className="text-lg font-medium text-white/90 mb-1">
                  {agent.name}
                </h3>
                <p className="text-sm text-white/50 mb-3">
                  {agent.tagline}
                </p>

                <p className="text-xs text-white/40 mb-3 line-clamp-2">
                  {agent.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${colors.badge}`}>
                    {agent.freeTierMinutes} min free
                  </span>
                  <span className="text-xs text-white/40">
                    ${agent.pricing.perMinute}/min
                  </span>
                </div>
              </HolographicCard>
            </motion.div>
          );
        })}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 mb-4 text-white/30 text-sm"
      >
        Microphone access required for voice conversation
      </motion.p>
    </motion.div>
  );
}
