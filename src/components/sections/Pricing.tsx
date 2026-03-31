'use client';

import { motion } from 'framer-motion';

const plans = [
  {
    name: 'Free Trial',
    price: '$0',
    priceSuffix: 'forever',
    description: 'Experience AI-powered research consultations with no commitment.',
    highlight: false,
    features: [
      { text: '3–5 free minutes per agent', included: true },
      { text: '7 specialist AI agents', included: true },
      { text: 'Voice-first consultations', included: true },
      { text: 'Session transcripts', included: false },
      { text: 'Priority queue access', included: false },
      { text: 'API access', included: false },
    ],
    cta: 'Start Free',
    ctaStyle: 'border border-white/20 text-white/80 hover:border-white/40 hover:bg-white/5',
  },
  {
    name: 'Pro',
    price: '$49',
    priceSuffix: '/month',
    description: 'Full access to all 7 specialist agents with generous monthly minutes.',
    highlight: true,
    badge: 'MOST POPULAR',
    features: [
      { text: '200 min/mo across all agents', included: true },
      { text: '7 specialist AI agents', included: true },
      { text: 'Voice-first consultations', included: true },
      { text: 'Session transcripts', included: true },
      { text: 'Priority queue access', included: true },
      { text: 'API access', included: false },
    ],
    cta: 'Get Pro Access',
    ctaStyle: 'bg-gradient-to-r from-[#d4a15f] to-[#f0c27b] text-black font-bold shadow-[0_0_30px_rgba(212,161,95,0.4)]',
  },
  {
    name: 'Enterprise',
    price: '$199',
    priceSuffix: '/month',
    description: 'Unlimited minutes, API access, and custom agent development for teams.',
    highlight: false,
    features: [
      { text: 'Unlimited minutes', included: true },
      { text: '7 specialist AI agents', included: true },
      { text: 'Voice-first consultations', included: true },
      { text: 'Session transcripts', included: true },
      { text: 'Priority queue access', included: true },
      { text: 'Full API access', included: true },
    ],
    cta: 'Contact Sales',
    ctaStyle: 'border border-[#6fd6cc]/40 text-[#6fd6cc] hover:bg-[#6fd6cc]/10',
  },
];

const agentDomains = [
  { name: 'Life Sciences', agents: ['Drug Discovery Specialist', 'Mycology Research', 'Computational Chemist'] },
  { name: 'Cultivation', agents: ['Cultivation Intelligence', 'Extraction & Formulation'] },
  { name: 'Strategy', agents: ['AI Strategy Advisor', 'Sales Director'] },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-32 px-6 relative">
      {/* Section divider */}
      <div className="absolute top-0 left-0 right-0">
        <div className="section-divider max-w-4xl mx-auto" />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse,_rgba(212,161,95,0.12)_0%,_transparent_70%)] blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="section-kicker justify-center mb-6">AI Tools Access</p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 leading-[1.1]">
            Expert AI, priced for<br />
            <span className="gradient-text">every stage of research.</span>
          </h2>
          <p className="text-lg text-white/55 max-w-2xl mx-auto leading-relaxed">
            Access specialized AI agents trained on proprietary research data across life sciences,
            cultivation, and enterprise strategy. Start free, scale as you grow.
          </p>
        </motion.div>

        {/* Plans grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              className="relative"
            >
              {plan.highlight && (
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-[#d4a15f]/50 to-transparent pointer-events-none" />
              )}
              <div className={`relative h-full rounded-2xl p-8 flex flex-col ${plan.highlight ? 'bg-[#0d0c0a] border border-[#d4a15f]/40' : 'bg-white/[0.03] border border-white/10'}`}>
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[color:var(--accent)] text-black text-[10px] font-bold tracking-[0.25em] uppercase">
                    {plan.badge}
                  </div>
                )}

                <div className="mb-6">
                  <p className={`text-xs uppercase tracking-[0.3em] mb-3 ${plan.highlight ? 'text-[color:var(--accent)]' : 'text-white/40'}`}>
                    {plan.name}
                  </p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-display font-bold text-white">{plan.price}</span>
                    <span className="text-sm text-white/40">{plan.priceSuffix}</span>
                  </div>
                  <p className="mt-3 text-sm text-white/55 leading-relaxed">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature.text} className="flex items-center gap-3">
                      <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${feature.included ? 'bg-[color:var(--accent)]/20 text-[color:var(--accent)]' : 'bg-white/5 text-white/20'}`}>
                        {feature.included ? (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </span>
                      <span className={`text-sm ${feature.included ? 'text-white/70' : 'text-white/30'}`}>{feature.text}</span>
                    </li>
                  ))}
                </ul>

                <motion.a
                  href={plan.name === 'Enterprise' ? '/products/consulting' : '#'}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`block w-full py-3.5 rounded-xl text-center text-sm font-semibold transition-all duration-200 ${plan.ctaStyle}`}
                >
                  {plan.cta}
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Agent coverage table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="signal-card p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-2">Included with All Plans</p>
              <h3 className="text-2xl font-display text-white">7 Specialist AI Agents</h3>
            </div>
            <span className="px-3 py-1 text-[10px] uppercase tracking-[0.2em] rounded-full bg-[color:var(--accent)]/15 text-[color:var(--accent)] border border-[color:var(--accent)]/30">
              All Active
            </span>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {agentDomains.map((domain) => (
              <div key={domain.name}>
                <p className="text-xs uppercase tracking-[0.25em] text-white/40 mb-3">{domain.name}</p>
                <ul className="space-y-2">
                  {domain.agents.map((agent) => (
                    <li key={agent} className="flex items-center gap-2.5 text-sm text-white/65">
                      <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent-cool)]" />
                      {agent}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
