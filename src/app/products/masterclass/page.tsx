'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function MasterclassPage() {
  return (
    <main className="relative min-h-screen bg-[#050506] overflow-x-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#d4a15f]/10 via-transparent to-transparent pointer-events-none" />

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
              <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">
            Mushroom Cultivator's<br />Masterclass
          </h1>
          
          <p className="text-xl md:text-2xl text-white/70 mb-8 max-w-3xl mx-auto">
            The complete guide to commercial mushroom cultivation
          </p>

          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="text-5xl font-display font-bold text-white">$499</span>
            <span className="text-2xl text-white/30 line-through">$899</span>
            <span className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-semibold">
              Save 44%
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
            { icon: 'Chapters', label: '28 Chapters', desc: 'Comprehensive curriculum' },
            { icon: 'Pages', label: '640+ Pages', desc: 'In-depth content' },
            { icon: 'Video', label: '46 Hours Video', desc: 'Visual demonstrations' },
            { icon: 'Access', label: 'Lifetime Access', desc: 'Learn at your pace' },
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
            What's Included
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              'Substrate formulation science',
              'Environmental control systems',
              'Contamination prevention protocols',
              'Scaling from hobby to commercial',
              'Fruiting optimization techniques',
              'Strain selection and genetics',
              'Business planning and operations',
              'Equipment recommendations',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <svg className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white/80">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <button className="px-12 py-6 bg-gradient-to-r from-[#d4a15f] via-[#e2b577] to-[#6fd6cc] text-white text-xl font-bold rounded-2xl shadow-2xl hover:shadow-[0_0_40px_rgba(212,161,95,0.5)] transition-all">
            Get Instant Access
          </button>
          
          <p className="mt-6 text-white/50 text-sm">
            Secure payment powered by Stripe • 30-day money-back guarantee
          </p>
        </motion.div>
      </div>
    </main>
  );
}
