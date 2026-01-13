'use client';

import { motion } from 'framer-motion';

const researchAreas = [
  { field: 'Computational Chemistry', publications: 12 },
  { field: 'Mycology & Cultivation', publications: 8 },
  { field: 'Machine Learning', publications: 15 },
  { field: 'Natural Products', publications: 6 },
];

export function Hero({ onStartDeepDive }: { onStartDeepDive?: () => void }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="relative z-10 px-6 max-w-6xl mx-auto py-20">
        {/* Header with academic style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-12 bg-white/40" />
            <div>
              <p className="text-white/50 text-sm tracking-widest uppercase">Principal Researcher</p>
              <p className="text-white/30 text-xs">Computational Biology & Applied Mycology</p>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-white mb-4 tracking-tight">
            Michael Crowe
          </h1>

          <p className="text-lg md:text-xl text-white/60 max-w-2xl font-light leading-relaxed">
            Independent researcher specializing in computational approaches to natural product discovery,
            fungal cultivation systems, and applied machine learning for life sciences.
          </p>
        </motion.div>

        {/* Research Focus Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-2 gap-6 mb-16"
        >
          <div className="border border-white/10 p-6 backdrop-blur-sm">
            <h3 className="text-white/40 text-xs uppercase tracking-widest mb-4">Research Focus</h3>
            <div className="space-y-3">
              {researchAreas.map((area, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-white/80 text-sm">{area.field}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-1 bg-white/20 rounded" style={{ width: `${area.publications * 6}px` }} />
                    <span className="text-white/40 text-xs font-mono">{area.publications}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-white/10 p-6 backdrop-blur-sm">
            <h3 className="text-white/40 text-xs uppercase tracking-widest mb-4">Current Work</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <span className="text-white/30 mt-1">→</span>
                <span>Bioactive compound screening via ML-accelerated docking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white/30 mt-1">→</span>
                <span>Environmental control systems for commercial cultivation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white/30 mt-1">→</span>
                <span>Voice-first expert systems for domain consultation</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap gap-4"
        >
          {onStartDeepDive && (
            <button
              onClick={onStartDeepDive}
              className="px-6 py-3 bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors"
            >
              Consult an Expert
            </button>
          )}
          <a
            href="#services"
            className="px-6 py-3 border border-white/20 text-white/80 text-sm font-medium hover:bg-white/5 transition-colors"
          >
            View Research Areas
          </a>
          <a
            href="#products"
            className="px-6 py-3 text-white/50 text-sm font-medium hover:text-white/80 transition-colors"
          >
            Publications & Data
          </a>
        </motion.div>

        {/* Minimal Credentials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 pt-8 border-t border-white/10"
        >
          <div className="flex flex-wrap gap-8 text-xs text-white/40">
            <div>
              <span className="text-white/60 font-mono">10+</span> years research
            </div>
            <div>
              <span className="text-white/60 font-mono">41</span> publications
            </div>
            <div>
              <span className="text-white/60 font-mono">634K</span> training samples
            </div>
            <div>
              <span className="text-white/60 font-mono">6</span> active projects
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
