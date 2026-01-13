'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { OrbitBackground } from '@/components/studio/OrbitBackground';
import { FloatingBlobs } from '@/components/studio/FloatingBlobs';
import { GlassCard } from '@/components/studio/GlassComponents';
import { PillTag } from '@/components/studio/PillTag';
import { getActiveAgents } from '@/config/agents';

export default function StudioPage() {
  const agents = getActiveAgents();
  
  return (
    <main className="relative min-h-screen bg-[#060607]">
      <OrbitBackground />
      <FloatingBlobs count={2} />
      
      {/* Header */}
      <div className="relative z-10 pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors mb-8">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-4 tracking-tight">
              Studio Dashboard
            </h1>
            <p className="text-xl text-white/60">Choose a module or search for expertise</p>
          </motion.div>
          
          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <div className="glass-panel rounded-2xl p-4 flex items-center gap-4">
              <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search modules..."
                className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/40"
              />
            </div>
          </motion.div>
          
          {/* Module Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent, i) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <Link href={`/studio/deep-consulting?agent=${agent.id}`}>
                  <GlassCard className="p-6 h-full">
                    <h3 className="text-xl font-bold text-white mb-2">{agent.name}</h3>
                    <p className="text-white/60 text-sm mb-4">{agent.tagline}</p>
                    <div className="flex items-center justify-between">
                      <PillTag variant="cyan">{agent.freeTierMinutes} min free</PillTag>
                      <span className="text-white/40 text-sm">${agent.pricing.perMinute}/min</span>
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
