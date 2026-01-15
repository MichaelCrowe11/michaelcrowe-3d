'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function DatasetPage() {
  return (
    <main className="relative min-h-screen bg-[#050506] overflow-x-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#6fd6cc]/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-24">
        {/* Back button */}
        <Link 
          href="/#products"
          className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors mb-12"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        {/* Hero section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-6">
            <svg className="w-20 h-20 text-[#6fd6cc] mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">
            Drug Discovery<br />Dataset
          </h1>
          
          <p className="text-xl md:text-2xl text-white/70 mb-8 max-w-3xl mx-auto">
            500+ validated molecular targets ready for computational screening
          </p>

          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="text-5xl font-display font-bold text-white">$2,499</span>
            <span className="text-2xl text-white/30 line-through">$4,999</span>
            <span className="px-4 py-2 bg-[#6fd6cc]/20 text-[#6fd6cc] rounded-full text-sm font-semibold">
              Save 50%
            </span>
          </div>
        </motion.div>

        {/* Features grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {[
            { icon: '✅', label: 'ChEMBL Validated', desc: 'Curated targets' },
            { icon: '🧬', label: 'SMILES Data', desc: 'Molecular structures' },
            { icon: '🤖', label: 'ML Ready', desc: 'Pre-processed data' },
            { icon: '🔌', label: 'API Access', desc: 'Direct integration' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 text-center"
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <div className="text-xl font-semibold text-white mb-1">{feature.label}</div>
              <div className="text-sm text-white/50">{feature.desc}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Dataset specs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 md:p-12 mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-8">
            Dataset Specifications
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              '500+ validated drug targets from ChEMBL',
              'SMILES notation for all molecules',
              'Activity data (IC50, Ki, EC50)',
              'Molecular descriptors calculated',
              'Clean, normalized, ML-ready format',
              'CSV, JSON, and Parquet formats',
              'Regular updates and additions',
              'Commercial license included',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <svg className="w-6 h-6 text-[#6fd6cc] flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white/80">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Use cases */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          {[
            { title: 'Virtual Screening', desc: 'Train models for molecular docking and binding prediction' },
            { title: 'QSAR Modeling', desc: 'Build quantitative structure-activity relationship models' },
            { title: 'Target Discovery', desc: 'Identify novel therapeutic targets for specific diseases' },
          ].map((use, i) => (
            <div key={i} className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-3">{use.title}</h3>
              <p className="text-white/60">{use.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <button className="px-12 py-6 bg-gradient-to-r from-[#6fd6cc] via-[#4fae9e] to-[#d4a15f] text-white text-xl font-bold rounded-2xl shadow-2xl hover:shadow-[0_0_40px_rgba(111,214,204,0.5)] transition-all">
            Purchase Dataset
          </button>
          
          <p className="mt-6 text-white/50 text-sm">
            Secure payment powered by Stripe • Commercial license included
          </p>
        </motion.div>
      </div>
    </main>
  );
}
