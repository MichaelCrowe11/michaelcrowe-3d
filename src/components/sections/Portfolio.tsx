'use client';

import { motion } from 'framer-motion';

// Real, shipped work. Links resolve; DOIs are minted. No vaporware.
const built = [
  {
    name: 'DeepParallel',
    cat: 'Developer tool',
    desc: 'A multi-model agentic coding CLI with cross-model review. One model grades another before code ships.',
    tag: 'PyPI · DOI',
    href: 'https://deepparallel.org',
  },
  {
    name: 'CriOS Nova',
    cat: 'Drug discovery',
    desc: 'A cheminformatics engine on RDKit, Mordred, and DeepChem: fingerprints, descriptors, drug-likeness, QSAR, and virtual screening.',
    tag: 'DOI',
    href: 'https://doi.org/10.5281/zenodo.20700053',
  },
  {
    name: 'Crowe Sense',
    cat: 'Ag-tech hardware',
    desc: 'A multi-zone cultivation telemetry rig on a working farm. 3,596,420 readings over 23 days, with an open-hardware sensor node.',
    tag: 'DOI · open hardware',
    href: 'https://doi.org/10.5281/zenodo.20722953',
  },
  {
    name: 'Crowe Nimbus',
    cat: 'Cloud infrastructure',
    desc: 'Managed model compute: private endpoints, edge delivery, and burst capacity at a flat monthly rate.',
    tag: 'Live',
    href: 'https://michaelcrowe11.github.io/crowe-nimbus-site/',
  },
  {
    name: 'crowe-theorem',
    cat: 'Research software',
    desc: 'A proposer that drafts and mechanically verifies mathematical proofs through Z3, Lean, and SymPy.',
    tag: 'DOI',
    href: 'https://orcid.org/0009-0008-5676-8816',
  },
  {
    name: 'Southwest Mushrooms',
    cat: 'Commercial operation',
    desc: 'A Phoenix cultivation company and a 195,000-subscriber education channel. The real floor that everything else instruments.',
    tag: 'Live',
    href: 'https://www.southwestmushrooms.com',
  },
];

export function Portfolio() {
  return (
    <section id="portfolio" className="py-16 lg:py-20 px-6 md:px-10 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"
        >
          <div>
            <p className="eyebrow-mono text-[color:var(--accent)]">Shipped work</p>
            <h2 className="mt-4 text-3xl md:text-4xl font-display headline-gradient tracking-tight max-w-xl leading-[1.1]">
              Built and running, not pitched.
            </h2>
          </div>
          <p className="text-white/55 max-w-md text-sm leading-relaxed">
            A portfolio that resolves. Every item links to a live product or a minted DOI on
            ORCID 0009-0008-5676-8816.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {built.map((p, i) => (
            <motion.a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="signal-card p-6 flex flex-col group"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[color:var(--accent-cool)]">{p.cat}</span>
                <span className="text-[10px] uppercase tracking-[0.16em] text-white/40 signal-chip px-2.5 py-1">{p.tag}</span>
              </div>
              <h3 className="mt-4 text-xl font-display text-white">{p.name}</h3>
              <p className="mt-3 text-sm text-white/55 leading-relaxed flex-1">{p.desc}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-white/50 group-hover:text-[color:var(--accent)] transition-colors">
                Open
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:translate-x-0.5">
                  <path d="M7 17L17 7M17 7H8M17 7V16" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
