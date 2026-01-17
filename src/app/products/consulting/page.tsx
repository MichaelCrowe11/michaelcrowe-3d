'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ConsultingPage() {
  return (
    <main className="relative min-h-screen bg-[#050506] overflow-x-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#d4a15f]/10 via-transparent to-[#1c1c22]/20 pointer-events-none" />

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
            <svg className="w-20 h-20 text-[#d4a15f] mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
            </svg>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">
            Crowe Logic Research Studio<br />Consulting
          </h1>
          
          <p className="text-xl md:text-2xl text-white/70 mb-8 max-w-3xl mx-auto">
            Research Studio consulting for agentic systems, applied intelligence, and accelerated delivery
          </p>

          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="text-5xl font-display font-bold text-white">$5,000</span>
            <span className="px-4 py-2 bg-[#d4a15f]/20 text-[#d4a15f] rounded-full text-sm font-semibold">
              Research Studio Package
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
            { icon: 'Model', label: 'Claude 4.5 Opus', desc: 'Latest AI models' },
            { icon: 'Systems', label: 'Custom Models', desc: 'Tailored solutions' },
            { icon: 'Access', label: '1:1 Sessions', desc: 'Direct access' },
            { icon: 'Launch', label: 'Implementation', desc: 'Full deployment' },
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

        {/* What's included */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 md:p-12 mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-8">
            Package Includes
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              'Strategic AI roadmap and planning',
              'LLM selection and architecture design',
              'RAG system implementation',
              'Agent architecture development',
              'Cost optimization strategies',
              'Security and compliance review',
              'Team training and onboarding',
              '90 days of post-implementation support',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <svg className="w-6 h-6 text-[#d4a15f] flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white/80">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Deliverables */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          {[
            { title: 'AI Strategy Document', desc: 'Comprehensive roadmap aligned with your business objectives' },
            { title: 'Technical Architecture', desc: 'Detailed system design and implementation plan' },
            { title: 'Working Prototype', desc: 'Functional MVP demonstrating key capabilities' },
          ].map((deliverable, i) => (
            <div key={i} className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-3">{deliverable.title}</h3>
              <p className="text-white/60">{deliverable.desc}</p>
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
          <button className="px-12 py-6 bg-gradient-to-r from-[#d4a15f] via-[#c08e54] to-[#1c1c22] text-white text-xl font-bold rounded-2xl shadow-2xl hover:shadow-[0_0_40px_rgba(212,161,95,0.5)] transition-all">
            Schedule Research Studio Consult
          </button>
          
          <p className="mt-6 text-white/50 text-sm">
            Book a 30-minute discovery call to discuss your needs
          </p>
        </motion.div>
      </div>
    </main>
  );
}
