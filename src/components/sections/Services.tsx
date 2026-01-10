'use client';

import { motion } from 'framer-motion';

const services = [
  {
    icon: '🧬',
    title: 'Drug Discovery AI',
    description: 'Advanced AI models for identifying novel drug targets using validated ChEMBL data and proprietary ML pipelines.',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    icon: '🧠',
    title: 'AI Consulting',
    description: 'Strategic AI implementation with Claude 4.5 Opus, custom model fine-tuning, and enterprise deployment.',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    icon: '🍄',
    title: 'Cultivation Intelligence',
    description: 'ML-powered cultivation optimization from 10+ years of commercial mushroom farming expertise.',
    color: 'from-violet-500 to-purple-500'
  },
  {
    icon: '📊',
    title: 'Premium Datasets',
    description: 'Curated training datasets including 634K+ cultivation frames and 500+ validated drug targets.',
    color: 'from-orange-500 to-amber-500'
  }
];

export function Services() {
  return (
    <section id="services" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            AI-Powered <span className="gradient-text">Services</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Cutting-edge artificial intelligence solutions tailored for scientific discovery and enterprise applications.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass-card p-8 group cursor-pointer"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform`}>
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
              <p className="text-gray-400 leading-relaxed">{service.description}</p>
              <div className="mt-6 flex items-center gap-2 text-cyan-400 group-hover:gap-4 transition-all">
                <span className="font-medium">Learn more</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
