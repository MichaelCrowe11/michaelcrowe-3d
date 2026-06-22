'use client';

import { motion } from 'framer-motion';

// Every pillar below maps to resolvable, DOI-minted work on ORCID
// 0009-0008-5676-8816. Descriptions are conservative and checkable.
const pillars = [
  {
    id: '01',
    title: 'Cultivation Intelligence',
    abstract:
      'An operating commercial farm, instrumented end to end. Crowe Sense logs multi-zone environmental telemetry; harvest weight and quality close the loop per batch. The asset a competitor cannot buy: owned sensor-to-outcome pairs from a real commercial floor.',
    methods: ['Crowe Sense telemetry', 'Open-hardware sensor node', 'Yield + contamination modeling'],
    proof: '2 DOIs, 3,596,420 readings',
    status: 'Telemetry live',
  },
  {
    id: '02',
    title: 'Computational Drug Discovery',
    abstract:
      'A targets-to-leads toolchain on real RDKit pipelines, not slideware. CriOS Nova computes fingerprints, descriptors, drug-likeness, QSAR, and virtual screening, feeding a discovery-scoring toolkit, a pharma knowledge graph, and curated target data with protocols.',
    methods: ['CriOS Nova engine', 'Discovery scoring', 'Pharma knowledge graph'],
    proof: '5 DOIs, RDKit / Mordred / DeepChem',
    status: 'Active',
  },
  {
    id: '03',
    title: 'Research Software and Languages',
    abstract:
      'Tools for verifiable science. crowe-theorem proposes and mechanically verifies proofs through Z3, Lean, and SymPy; flux compiles PDEs to GPU; Synapse and Mycelium-EI-Lang are scientific languages with real compilers.',
    methods: ['crowe-theorem', 'flux PDE-to-GPU', 'Synapse, Mycelium-EI-Lang'],
    proof: '6+ DOIs, resolvable on ORCID',
    status: 'Pre-production',
  },
  {
    id: '04',
    title: 'Products and Revenue',
    abstract:
      'Product-shaped work, separable from the research. A multi-model agentic coding CLI with cross-model review, the crowe-logic agent stack, and dynamic-pricing and trading platforms. Published, versioned, and licensable.',
    methods: ['DeepParallel CLI', 'crowe-logic stack', 'PriceFlow, CroweTrade'],
    proof: 'PyPI + DOIs, Apache-2.0',
    status: 'Shipping',
  },
];

export function Services() {
  return (
    <section id="work" className="py-16 lg:py-20 px-6 md:px-10 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-6 left-1/2 -translate-x-1/2 h-px w-[72%] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">What I build</p>
            <h2 className="text-3xl md:text-4xl font-display text-white mt-4 max-w-2xl">
              Three pillars, one through-line: real-world biology, instrumented and computed.
            </h2>
          </div>
          <p className="text-white/55 max-w-md text-sm leading-relaxed">
            Each is backed by resolvable, DOI-minted work, conservatively described. The
            differentiator is an owned, closed-loop data system, not rented public data.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {pillars.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="signal-card p-6 group"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.25em] text-white/40">Pillar {p.id}</p>
                  <h3 className="text-xl text-white font-display">{p.title}</h3>
                </div>
                <span className="px-3 py-1 text-[11px] uppercase tracking-[0.2em] signal-chip text-white/50 whitespace-nowrap">
                  {p.status}
                </span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed mt-4">{p.abstract}</p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs text-white/50">
                {p.methods.map((method) => (
                  <span key={method} className="px-3 py-1 rounded-full border border-white/10 bg-white/5">
                    {method}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between text-xs text-white/45 border-t border-white/5 pt-4">
                <span>Verifiable</span>
                <span className="text-white/70">{p.proof}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4"
        >
          <p className="text-white/45 text-xs max-w-xl">
            Every claim here resolves to a DOI on ORCID 0009-0008-5676-8816. Outcome labels
            for predictive cultivation are still accruing; the telemetry and tooling are real
            and in place today.
          </p>
          <a
            href="https://orcid.org/0009-0008-5676-8816"
            target="_blank"
            rel="noreferrer"
            className="text-xs uppercase tracking-[0.2em] text-[color:var(--accent)] hover:text-white transition-colors"
          >
            View all 26 works
          </a>
        </motion.div>
      </div>
    </section>
  );
}
