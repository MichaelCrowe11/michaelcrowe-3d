'use client';

import { motion } from 'framer-motion';

const researchDomains = [
  {
    id: '01',
    title: 'Computational Drug Discovery',
    abstract: 'Virtual screening pipelines combining molecular docking with machine learning for hit identification. Focus on natural product scaffolds and GPCR targets.',
    methods: ['Molecular Dynamics', 'QSAR Modeling', 'Pharmacophore Mapping'],
    datasets: '500+ validated targets',
    status: 'Active'
  },
  {
    id: '02',
    title: 'Applied Mycology',
    abstract: 'Systematic optimization of Basidiomycete cultivation through environmental control and substrate engineering. Commercial-scale protocols for medicinal species.',
    methods: ['Environmental Modeling', 'Spectral Analysis', 'Yield Optimization'],
    datasets: '634K training frames',
    status: 'Active'
  },
  {
    id: '03',
    title: 'Natural Product Chemistry',
    abstract: 'Extraction and characterization of bioactive compounds from fungal sources. Beta-glucan quantification and triterpene profiling for quality standardization.',
    methods: ['HPLC-MS', 'NMR Spectroscopy', 'Bioassay Screening'],
    datasets: '200+ compound profiles',
    status: 'Active'
  },
  {
    id: '04',
    title: 'Expert Systems',
    abstract: 'Development of voice-first consultation systems embedding domain expertise. Real-time knowledge retrieval with conversational interfaces.',
    methods: ['RAG Architecture', 'Voice Synthesis', 'Knowledge Graphs'],
    datasets: '6 deployed agents',
    status: 'Active'
  }
];

export function Services() {
  return (
    <section id="services" className="py-24 px-6 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 h-px w-[72%] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Research Systems</p>
            <h2 className="text-3xl md:text-5xl font-display text-white mt-4">
              Domains engineered for measurable breakthroughs.
            </h2>
          </div>
          <p className="text-white/55 max-w-xl text-sm leading-relaxed">
            Each domain is designed as a closed-loop program: data capture, modeling,
            operational feedback, and measurable outcomes.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {researchDomains.map((domain, i) => (
            <motion.div
              key={domain.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="signal-card p-6 group"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.25em] text-white/40">Domain {domain.id}</p>
                  <h3 className="text-xl text-white font-display">{domain.title}</h3>
                </div>
                <span className="px-3 py-1 text-[11px] uppercase tracking-[0.2em] signal-chip text-white/50">
                  {domain.status}
                </span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed mt-4">
                {domain.abstract}
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs text-white/50">
                {domain.methods.map((method) => (
                  <span key={method} className="px-3 py-1 rounded-full border border-white/10 bg-white/5">
                    {method}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between text-xs text-white/45">
                <span>Data footprint</span>
                <span className="text-white/70">{domain.datasets}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-white/10"
        >
          <p className="text-white/40 text-xs">
            For collaboration or data licensing, schedule a consult with the relevant domain expert.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
