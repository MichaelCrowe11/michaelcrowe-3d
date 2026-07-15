'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { OrbitBackground } from '@/components/studio/OrbitBackground';
import { FloatingBlobs } from '@/components/studio/FloatingBlobs';
import { GlassCard } from '@/components/studio/GlassComponents';
import { PillTag } from '@/components/studio/PillTag';

export default function DoomscrollPage() {
  const pillars = [
    {
      title: 'The loop',
      desc: 'Engagement, Immersion, Log Off. Fire rate scales with Engagement, the field of view creeps with Immersion, and the only way to win is to log off before The Feed consumes you.',
    },
    {
      title: 'The Feed',
      desc: 'A black-void arena of cyan grid, neon monoliths, and enemies drawn from the worst of your timeline. They hold just off your crosshair and drain you on contact.',
    },
    {
      title: 'The pipeline',
      desc: 'Built end to end by an agentic game-dev pipeline: design bible, C++ gameplay code, arena construction scripts, HUD, and the trailer itself. Documented like everything else here.',
    },
  ];

  return (
    <main className="relative min-h-screen bg-[#060607]">
      <OrbitBackground />
      <FloatingBlobs count={2} />

      <div className="relative z-10 px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <Link href="/studio" className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors mb-12">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Studio
          </Link>

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="mb-6 flex items-center justify-center gap-3">
              <PillTag variant="cyan">Unreal Engine 5</PillTag>
              <PillTag variant="cyan">Playable build</PillTag>
            </div>
            <h1 className="text-6xl md:text-7xl font-display font-bold text-white mb-6 tracking-tight">
              DOOM<span className="text-[#6fd6cc]">SCROLL</span>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              An arena survivor about the attention economy. You are the last
              user inside The Feed, and the algorithm does not want you to leave.
            </p>
          </motion.div>

          {/* Trailer */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-16"
          >
            <div className="glass-panel rounded-2xl overflow-hidden">
              <video
                className="block w-full h-auto"
                controls
                preload="metadata"
                poster="/doomscroll/poster.jpg"
                aria-label="DOOMSCROLL trailer: first-person arena combat inside The Feed"
              >
                <source src="/doomscroll/trailer.mp4" type="video/mp4" />
              </video>
            </div>
            <p className="mt-3 text-center text-sm text-white/40">
              Trailer captured from live gameplay. Score from the Substrate sessions.
            </p>
          </motion.div>

          {/* Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <GlassCard className="p-6 h-full">
                  <h3 className="text-xl font-bold text-white mb-2">{p.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{p.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <GlassCard className="inline-block px-8 py-6 text-left max-w-xl">
              <h3 className="text-lg font-bold text-white mb-2">Where it stands</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                First-person combat, The Feed arena, kill-burst feedback, and a
                code-only HUD are in and running. A standalone macOS build exists
                today; a public demo and store page come after the feel pass.
                Ask about early access if you want in.
              </p>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
