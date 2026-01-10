'use client';

import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-sm font-medium mb-8">
            AI Consultant & Drug Discovery Specialist
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
        >
          <span className="text-white">Michael</span>
          <br />
          <span className="gradient-text">Crowe</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-10"
        >
          Pioneering AI solutions in drug discovery, cultivating intelligence from code to cultivation.
          Building the future with Claude 4.5 Opus and cutting-edge ML systems.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <a
            href="#services"
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/25"
          >
            Explore Services
          </a>
          <a
            href="#products"
            className="px-8 py-4 rounded-xl bg-white/5 border border-white/20 text-white font-semibold text-lg hover:bg-white/10 transition-colors"
          >
            View Products
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
        >
          {[
            { value: '500+', label: 'Drug Targets Validated' },
            { value: '634K', label: 'ML Training Frames' },
            { value: '46+', label: 'Hours of Expertise' },
            { value: '10+', label: 'Years Experience' }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-3 bg-cyan-400 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
