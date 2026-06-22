'use client';

import { motion } from 'framer-motion';

const channels = [
  { label: 'Email', value: 'michael@crowelogic.com', href: 'mailto:michael@crowelogic.com' },
  { label: 'ORCID', value: '0009-0008-5676-8816', href: 'https://orcid.org/0009-0008-5676-8816' },
  { label: 'GitHub', value: 'MichaelCrowe11', href: 'https://github.com/MichaelCrowe11' },
  { label: 'LinkedIn', value: 'michael-crowe', href: 'https://www.linkedin.com/in/michael-crowe-b4b567256' },
];

const tracks = [
  { t: 'Consulting', d: 'Applied cheminformatics, cultivation telemetry, and operational instrumentation. From a single audit to a deployed system.' },
  { t: 'Research', d: 'Collaboration on natural-product and small-molecule discovery, controlled-environment ag, and verified-reasoning tooling.' },
  { t: 'Licensing', d: 'The CriOS Nova engine, the agent and CLI stack, and curated, DOI-backed datasets.' },
];

export function Contact() {
  return (
    <section id="contact" className="py-20 px-6 md:px-10 relative">
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <p className="eyebrow-mono text-[color:var(--accent)]">Work with me</p>
          <h2 className="mt-5 text-3xl md:text-5xl font-display headline-gradient tracking-tight leading-[1.05]">
            Build something <span className="g-gold">real</span>.
          </h2>
          <p className="mt-6 text-white/60 leading-relaxed">
            I take on a small number of consulting, research, and licensing engagements.
            If you are working where biology meets computation, get in touch.
          </p>
        </motion.div>

        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {tracks.map((tk, i) => (
            <motion.div
              key={tk.t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="signal-card p-6"
            >
              <h3 className="text-lg font-display text-white">{tk.t}</h3>
              <p className="mt-3 text-sm text-white/55 leading-relaxed">{tk.d}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 signal-card p-8 flex flex-col items-center gap-8"
        >
          <a href="mailto:michael@crowelogic.com" className="btn-gold px-8 py-3.5 text-base">
            Start a conversation
          </a>
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden">
            {channels.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="bg-[#0b0e13] px-5 py-5 text-center hover:bg-white/[0.04] transition-colors group"
              >
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">{c.label}</p>
                <p className="mt-2 text-sm text-white/75 group-hover:text-[color:var(--accent-cool)] transition-colors break-all">
                  {c.value}
                </p>
              </a>
            ))}
          </div>
          <p className="text-xs text-white/35 text-center">
            Michael Crowe, Phoenix, Arizona. Cultivating since 2005, commercial since 2017.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
