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
      className="mb-8 flex flex-wrap gap-2 justify-center max-w-2xl"
      role="region"
      aria-label="Suggested conversation topics"
    >
      <p className="w-full text-center text-white/40 text-xs mb-2">
        Suggested topics (speak to ask):
      </p>
      {topics.map((topic, index) => (
        <motion.span
          key={topic}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          className="px-4 py-2 rounded-full bg-white/5 border text-white/60 text-sm hover:bg-white/10 transition-colors cursor-default"
          style={{
            borderColor: theme?.pulseColor || 'rgba(255, 255, 255, 0.1)',
          }}
          whileHover={{
            borderColor: theme?.primaryColor || '#22d3ee',
            color: theme?.primaryColor || '#22d3ee',
            scale: 1.05,
          }}
        >
          {topic}
        </motion.span>
      ))}
    </motion.div>
  );
}
