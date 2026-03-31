'use client';

import { motion } from 'framer-motion';

const signalMetrics = [
  { label: 'Research Years', value: '10+' },
  { label: 'AI Agents', value: '7' },
  { label: 'Training Samples', value: '634K' },
  { label: 'Active Programs', value: '6' },
];

const aiTools = [
  { name: 'Cultivation Intelligence', domain: 'Mycology', free: '5 min free', dotBg: 'bg-[#6fd6cc]', textColor: 'text-[#6fd6cc]' },
  { name: 'Drug Discovery Specialist', domain: 'Life Sciences', free: '3 min free', dotBg: 'bg-[#d4a15f]', textColor: 'text-[#d4a15f]' },
  { name: 'AI Strategy Advisor', domain: 'Enterprise', free: '3 min free', dotBg: 'bg-[#f0c27b]', textColor: 'text-[#f0c27b]' },
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
            <span className="h-2 w-2 rounded-full bg-[color:var(--accent)] shadow-[var(--glow-accent)] animate-pulse" />
            Crowe Logic Research Studio
          </div>

          <h1 className="mt-8 text-5xl md:text-6xl lg:text-7xl font-display text-white tracking-tight leading-[1.05]">
            AI tools for life sciences, cultivation, and applied discovery.
          </h1>

          <p className="mt-6 text-lg text-white/65 max-w-xl leading-relaxed">
            Access 7 specialized AI agents trained on proprietary research data. Voice-first consultations that compress timelines and surface decisions faster.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            {onStartDeepDive && (
              <button
                onClick={onStartDeepDive}
                className="px-7 py-3.5 rounded-full bg-[color:var(--accent)] text-black text-sm font-bold tracking-wide hover:bg-[color:var(--accent-strong)] transition-colors shadow-[0_0_24px_rgba(212,161,95,0.4)]"
              >
                Try AI Tools Free →
              </button>
            )}
            <a
              href="#pricing"
              className="px-6 py-3.5 rounded-full border border-white/20 text-white/80 text-sm font-medium hover:border-[color:var(--accent)]/50 hover:bg-white/5 hover:text-white transition-all"
            >
              View Plans &amp; Pricing
            </a>
            <a
              href="#products"
              className="px-6 py-3.5 text-white/50 text-sm font-medium hover:text-white/80 transition-colors"
            >
              Research Products
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
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">Live AI Tools</p>
              <h2 className="text-2xl font-display text-white mt-2">Available Specialists</h2>
            </div>
            <span className="px-3 py-1 text-[10px] uppercase tracking-[0.2em] rounded-full bg-[color:var(--accent)]/15 text-[color:var(--accent)] border border-[color:var(--accent)]/30">
              7 Active
            </span>
          </div>

          <div className="space-y-3">
            {aiTools.map((tool) => (
              <div key={tool.name} className="flex items-center justify-between border border-white/5 rounded-2xl px-4 py-3 bg-white/5 hover:bg-white/8 transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`h-2 w-2 rounded-full ${tool.dotBg}`} />
                  <div>
                    <p className={`text-sm font-medium ${tool.textColor}`}>{tool.name}</p>
                    <p className="text-xs text-white/40">{tool.domain}</p>
                  </div>
                </div>
                <span className="text-xs text-white/50 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">{tool.free}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-white/10 pt-5">
            <p className="text-xs text-white/40 uppercase tracking-[0.3em] mb-3">Access Tiers</p>
            <div className="flex gap-2.5">
              <span className="px-3 py-1 text-xs uppercase tracking-[0.15em] signal-chip text-white/60">Free Trial</span>
              <span className="px-3 py-1 text-xs uppercase tracking-[0.15em] rounded-full bg-[color:var(--accent)]/15 border border-[color:var(--accent)]/30 text-[color:var(--accent)]">Pro</span>
              <span className="px-3 py-1 text-xs uppercase tracking-[0.15em] signal-chip text-white/60">Enterprise</span>
            </div>
            {onStartDeepDive && (
              <button
                onClick={onStartDeepDive}
                className="mt-4 w-full py-3 rounded-xl border border-[color:var(--accent)]/40 bg-[color:var(--accent)]/10 text-[color:var(--accent)] text-sm font-semibold hover:bg-[color:var(--accent)]/20 transition-all"
              >
                Start Free Consultation
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
