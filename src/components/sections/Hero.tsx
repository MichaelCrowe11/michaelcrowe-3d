'use client';

import { motion } from 'framer-motion';

// Verified, checkable. No "20-year" claims, no superlatives.
const proof = ['Cultivating since 2005', '26 DOI-backed works', '3.6M sensor readings', '195K subscribers'];

export function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden">
      {/* legibility wash so the full-bleed 3D never fights the type */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(120%_100%_at_30%_45%,rgba(7,9,12,0.82)_0%,rgba(7,9,12,0.5)_45%,transparent_75%)]" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-24">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="eyebrow-mono text-[color:var(--accent)]"
        >
          Operator, builder, researcher, Phoenix Arizona
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.08 }}
          className="mt-6 font-display tracking-[-0.03em] leading-[0.98] text-[clamp(3rem,9vw,8rem)] max-w-[15ch]"
        >
          <span className="headline-gradient">Real-world </span>
          <span className="g-gold">biology</span>
          <span className="headline-gradient">, </span>
          <span className="g-cyan">computed</span>
          <span className="headline-gradient">.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-8 text-lg md:text-xl text-white/60 max-w-xl leading-relaxed"
        >
          I run a commercial farm, instrumented it myself, and built the computational
          science to close the loop. Operator-built, and all of it resolves.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.32 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a href="#contact" className="btn-gold px-7 py-3.5 text-base">Work with me</a>
          <a href="#work" className="btn-glass px-7 py-3.5 text-base font-medium">See the work</a>
          <a
            href="https://orcid.org/0009-0008-5676-8816"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-3.5 text-sm text-white/45 hover:text-white/80 transition-colors"
          >
            Read the record
          </a>
        </motion.div>

        {/* slim proof line, not cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-[0.14em] text-white/40"
        >
          {proof.map((p, i) => (
            <span key={p} className="flex items-center gap-3">
              {i > 0 && <span className="text-[color:var(--accent-cool)]/50">/</span>}
              {p}
            </span>
          ))}
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.9 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/30"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <span className="h-8 w-px bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
      </motion.div>
    </section>
  );
}
