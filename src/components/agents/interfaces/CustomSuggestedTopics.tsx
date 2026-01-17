'use client';

import { motion } from 'framer-motion';
import type { AgentInterfaceTheme } from '@/config/agentInterfaces';

interface CustomSuggestedTopicsProps {
  topics: string[];
  theme?: AgentInterfaceTheme;
}

export function CustomSuggestedTopics({ topics, theme }: CustomSuggestedTopicsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 md:mb-8 flex flex-wrap gap-3 justify-center max-w-3xl px-4"
      role="region"
      aria-label="Suggested conversation topics"
    >
      <p className="w-full text-center text-white/60 text-sm md:text-base font-medium mb-2">
        Suggested topics (just speak to ask):
      </p>
      {topics.map((topic, index) => (
        <motion.span
          key={topic}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          className="px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-sm border-2 text-white/80 text-sm md:text-base font-medium hover:bg-white/15 transition-all cursor-default shadow-lg"
          style={{
            borderColor: theme?.pulseColor || 'rgba(255, 255, 255, 0.2)',
          }}
          whileHover={{
            borderColor: theme?.primaryColor || '#22d3ee',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
            scale: 1.05,
            boxShadow: `0 0 20px ${theme?.glowColor || 'rgba(34, 211, 238, 0.3)'}`,
          }}
        >
          {topic}
        </motion.span>
      ))}
    </motion.div>
  );
}
