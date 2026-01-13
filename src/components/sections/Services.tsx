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
    <section id="services" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
            Research Domains
          </h2>
          <p className="text-white/50 max-w-xl text-sm leading-relaxed">
            Active research programs spanning computational biology, applied mycology, and intelligent systems.
            Each domain supports consultation services and data licensing.
          </p>
        </motion.div>

        <div className="space-y-1">
          {researchDomains.map((domain, i) => (
            <motion.div
              key={domain.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group border-t border-white/10 py-8 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-start gap-6">
                <span className="text-white/20 font-mono text-sm">{domain.id}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg text-white font-medium group-hover:text-white/90 transition-colors">
                      {domain.title}
                    </h3>
                    <span className="text-xs text-white/30 border border-white/10 px-2 py-0.5">
                      {domain.status}
                    </span>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed mb-4 max-w-2xl">
                    {domain.abstract}
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs">
                    <div className="text-white/30">
                      <span className="text-white/50">Methods:</span>{' '}
                      {domain.methods.join(' · ')}
                    </div>
                    <div className="text-white/30">
                      <span className="text-white/50">Data:</span>{' '}
                      {domain.datasets}
                    </div>
                  </div>
                </div>
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
          <p className="text-white/30 text-xs">
            For collaboration inquiries or data licensing, schedule a consultation with the relevant domain expert.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
