'use client';

import { motion } from 'framer-motion';

// Verified arc from the crowe-identity ledger. Conservative, checkable.
const arc = [
  {
    year: '2005',
    title: 'Started cultivating, at fifteen',
    body: 'A hands-on obsession with fungi that never stopped. Cultivation craft learned by doing, not in a lab, and the foundation for everything since.',
  },
  {
    year: '2017',
    title: 'Founded Southwest Mushrooms',
    body: 'Built a commercial farm in Phoenix into one of the city’s most productive urban operations: 1,200 to 1,500 pounds weekly, 35+ species. Two Phoenix New Times features called me "The Professor."',
  },
  {
    year: '2020',
    title: 'Taught it to 195,000 people',
    body: 'An education channel grown to over 195,000 subscribers and 11.9 million views. Cultivation knowledge, documented and given away.',
  },
  {
    year: '2024',
    title: 'Instrumented the floor with Crowe Sense',
    body: 'Built my own multi-zone telemetry rig on the working farm. A frozen snapshot holds 3,596,420 readings over 23 continuous days, backed by an open-hardware sensor-node design.',
  },
  {
    year: '2025',
    title: 'Founded Crowe Logic',
    body: 'Taught myself the computational science to make the data mean something. CriOS Nova, a proof-verification engine, scientific languages, and a discovery toolchain. 26 DOI-backed works, all resolvable.',
  },
];

export function Story() {
  return (
    <section id="story" className="py-16 lg:py-20 px-6 md:px-10 relative">
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 max-w-2xl"
        >
          <p className="eyebrow-mono text-[color:var(--accent)]">The path</p>
          <h2 className="mt-5 text-3xl md:text-4xl font-display headline-gradient tracking-tight leading-[1.08]">
            From the grow room to published science.
          </h2>
          <p className="mt-6 text-white/60 leading-relaxed">
            I did not arrive from a credential. I built a real operation, instrumented it,
            and learned the computation to close the loop. Every step is documented.
          </p>
        </motion.div>

        <div className="relative">
          {/* spine */}
          <div className="absolute left-[7px] md:left-1/2 top-2 bottom-2 w-px bg-gradient-to-b from-[color:var(--accent)]/40 via-white/10 to-[color:var(--accent-cool)]/40 md:-translate-x-1/2" />

          <div className="space-y-8">
            {arc.map((step, i) => (
              <motion.div
                key={step.year}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className={`relative pl-10 md:pl-0 md:grid md:grid-cols-2 md:gap-12 ${
                  i % 2 === 0 ? '' : 'md:[direction:rtl]'
                }`}
              >
                {/* node */}
                <span className="absolute left-0 md:left-1/2 top-2 h-3.5 w-3.5 rounded-full bg-[color:var(--accent)] shadow-[0_0_18px_rgba(210,173,98,0.7)] md:-translate-x-1/2 ring-4 ring-[#07090c]" />
                <div className={`signal-card p-6 [direction:ltr] ${i % 2 === 0 ? 'md:text-right md:col-start-1' : 'md:col-start-2'}`}>
                  <p className="font-display text-3xl text-[color:var(--accent-strong)]">{step.year}</p>
                  <h3 className="mt-2 text-lg font-display text-white">{step.title}</h3>
                  <p className="mt-3 text-sm text-white/55 leading-relaxed">{step.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
