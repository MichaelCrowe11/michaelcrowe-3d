'use client';

import { motion } from 'framer-motion';

const signalMetrics = [
  { label: 'Research Years', value: '10+' },
  { label: 'Publications', value: '41' },
  { label: 'Training Samples', value: '634K' },
  { label: 'Active Programs', value: '6' },
];

const activeThreads = [
  'ML-accelerated docking for bioactive discovery',
  'Closed-loop cultivation controls at commercial scale',
  'Voice-first expert systems for high-signal decisions',
];

export function Hero({ onStartDeepDive }: { onStartDeepDive?: () => void }) {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 right-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,_rgba(212,161,95,0.2)_0%,_transparent_70%)] blur-2xl" />
        <div className="absolute bottom-0 left-10 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,_rgba(111,214,204,0.18)_0%,_transparent_70%)] blur-2xl" />
      </div>

      <div className="relative z-10 px-6 max-w-6xl mx-auto py-24 lg:py-32 w-full grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 signal-chip text-xs uppercase tracking-[0.3em] text-white/70">
            <span className="h-2 w-2 rounded-full bg-[color:var(--accent)] shadow-[var(--glow-accent)]" />
            Crowe Logic Research Studio
          </div>

          <h1 className="mt-8 text-5xl md:text-6xl lg:text-7xl font-display text-white tracking-tight leading-[1.05]">
            Signal-grade AI for life sciences, cultivation, and applied discovery.
          </h1>

          <p className="mt-6 text-lg text-white/65 max-w-xl leading-relaxed">
            We design adaptive intelligence systems that compress research timelines, optimize operations,
            and translate complex data into actionable decisions.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            {onStartDeepDive && (
              <button
                onClick={onStartDeepDive}
                className="px-6 py-3 rounded-full bg-[color:var(--accent)] text-black text-sm font-semibold tracking-wide hover:bg-[color:var(--accent-strong)] transition-colors"
              >
                Consult an Expert
              </button>
            )}
            <a
              href="#services"
              className="px-6 py-3 rounded-full border border-white/15 text-white/80 text-sm font-medium hover:border-white/30 hover:bg-white/5 transition-colors"
            >
              Explore Research Systems
            </a>
            <a
              href="#products"
              className="px-6 py-3 text-white/50 text-sm font-medium hover:text-white/80 transition-colors"
            >
              Products and Intelligence Assets
            </a>
          </div>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {signalMetrics.map((metric) => (
              <div key={metric.label} className="signal-card px-4 py-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">{metric.label}</p>
                <p className="mt-2 text-2xl font-display text-white">{metric.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="signal-card p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">Live Programs</p>
              <h2 className="text-2xl font-display text-white mt-2">Research Command Deck</h2>
            </div>
            <div className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center text-xs text-white/50">
              01
            </div>
          </div>

          <div className="space-y-4">
            {activeThreads.map((thread) => (
              <div key={thread} className="flex items-start gap-3 border border-white/5 rounded-2xl px-4 py-3 bg-white/5">
                <span className="mt-1 h-2 w-2 rounded-full bg-[color:var(--accent-cool)] shadow-[var(--glow-cool)]" />
                <p className="text-sm text-white/70 leading-relaxed">{thread}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="text-xs text-white/40 uppercase tracking-[0.3em]">Access</p>
            <p className="text-sm text-white/70 mt-2">
              Proprietary datasets, expert consultations, and applied R and D programs.
            </p>
            <div className="mt-4 flex gap-3">
              <span className="px-3 py-1 text-xs uppercase tracking-[0.2em] signal-chip text-white/60">Private</span>
              <span className="px-3 py-1 text-xs uppercase tracking-[0.2em] signal-chip text-white/60">Enterprise</span>
              <span className="px-3 py-1 text-xs uppercase tracking-[0.2em] signal-chip text-white/60">Data-first</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
