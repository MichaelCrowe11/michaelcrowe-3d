'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { OrbitBackground } from '@/components/studio/OrbitBackground';
import { FloatingBlobs } from '@/components/studio/FloatingBlobs';
import { GlowButton } from '@/components/studio/GlowButton';
import { GlassCard } from '@/components/studio/GlassComponents';

export default function ParallelSynthPage() {
  const actions = [
    { title: 'Start a Run', icon: '▶️', desc: 'Begin a new synthesis workflow' },
    { title: 'New Synthesis', icon: '✨', desc: 'Create custom synthesis pipeline' },
    { title: 'Import Library', icon: '📚', desc: 'Import existing templates' },
  ];
  
  return (
    <main className="relative min-h-screen bg-[#030303]">
      <OrbitBackground />
      <FloatingBlobs count={3} />
      
      <div className="relative z-10 px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <Link href="/studio" className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors mb-12">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Studio
          </Link>
          
          {/* Hero with Atom Emblem */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            {/* Atom-like emblem */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="w-32 h-32 mx-auto mb-8 relative"
            >
              <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30" />
              <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30 rotate-60" />
              <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30 -rotate-60" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-violet-400 shadow-lg shadow-cyan-400/50" />
              </div>
            </motion.div>
            
            <h1 className="text-6xl md:text-7xl font-display font-bold text-white mb-6 tracking-tight">
              Parallel<span className="text-cyan-400">Synth</span>
            </h1>
            
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Advanced synthesis and orchestration module for complex multi-agent workflows.
            </p>
            
            <GlowButton variant="primary" size="lg">
              Explore Now
            </GlowButton>
          </motion.div>
          
          {/* Action Tiles */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {actions.map((action, i) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
              >
                <GlassCard className="p-8 text-center cursor-pointer">
                  <div className="text-5xl mb-4">{action.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{action.title}</h3>
                  <p className="text-white/60 text-sm">{action.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Feature description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-16 glass-panel rounded-3xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-4">What is ParallelSynth?</h2>
            <p className="text-white/70 leading-relaxed">
              ParallelSynth is a first-class Studio module that enables sophisticated orchestration
              of multiple AI agents working in parallel. Build complex workflows, manage distributed
              computations, and synthesize insights from diverse domain experts—all with the same
              cosmic glass console aesthetic that defines Crowe Logic Studio.
            </p>
            
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="px-4 py-2 rounded-full bg-cyan-500/20 text-cyan-300 text-sm border border-cyan-500/30">
                Beta Access
              </span>
              <span className="px-4 py-2 rounded-full bg-violet-500/20 text-violet-300 text-sm border border-violet-500/30">
                Custom Pricing
              </span>
              <span className="px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-300 text-sm border border-emerald-500/30">
                Enterprise Ready
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
