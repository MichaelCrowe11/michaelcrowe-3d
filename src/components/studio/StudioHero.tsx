'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { GlowButton } from '@/components/studio/GlowButton';
import { GlassCard } from '@/components/studio/GlassComponents';
import { PillTag, PriceChip } from '@/components/studio/PillTag';

interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  freeTier: string;
  price: string;
  href: string;
  accentColor?: string;
}

function ModuleCard({ title, description, icon, freeTier, price, href, accentColor = 'cyan' }: ModuleCardProps) {
  return (
    <Link href={href}>
      <GlassCard className="relative p-6 h-full flex flex-col group">
        <PriceChip price={price} />
        
        <div className={`mb-4 text-${accentColor}-400`}>
          {icon}
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
          {title}
        </h3>
        
        <p className="text-white/60 text-sm mb-4 flex-grow">
          {description}
        </p>
        
        <PillTag variant={accentColor as any}>{freeTier}</PillTag>
      </GlassCard>
    </Link>
  );
}

export function StudioHero() {
  const modules = [
    {
      title: 'Deep Consulting',
      description: 'Voice-first consulting with domain experts across life sciences, AI strategy, and specialized fields.',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
      ),
      freeTier: '3 min free',
      price: '$0.75/min',
      href: '/studio/deep-consulting',
      accentColor: 'cyan',
    },
    {
      title: 'Extraction & Formulation',
      description: 'CO2, ethanol, and water extraction optimization. Purification methods and analytical testing.',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 15.5m14.8-.2l.2.2a9 9 0 01-2.1 5.7m-12.8-5.9l-.2.2a9 9 0 002.1 5.7M9 10.5h6" />
        </svg>
      ),
      freeTier: '3 min free',
      price: '$0.50/min',
      href: '/studio',
      accentColor: 'amber',
    },
    {
      title: 'Mycology Research',
      description: 'Fungal biology, medicinal compound research, and clinical evidence behind medicinal mushrooms.',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3c-1.2 0-2.4.6-3 1.5C8.4 5.4 8 6.6 8 8c0 1.4.4 2.6 1 3.5.6.9 1.8 1.5 3 1.5s2.4-.6 3-1.5c.6-.9 1-2.1 1-3.5 0-1.4-.4-2.6-1-3.5-.6-.9-1.8-1.5-3-1.5zM12 13c-1.2 0-2.4.6-3 1.5-.6.9-1 2.1-1 3.5 0 1.4.4 2.6 1 3.5.6.9 1.8 1.5 3 1.5s2.4-.6 3-1.5c.6-.9 1-2.1 1-3.5 0-1.4-.4-2.6-1-3.5-.6-.9-1.8-1.5-3-1.5zM6 8h12M6 18h12M8 13h8" />
        </svg>
      ),
      freeTier: '3 min free',
      price: '$0.50/min',
      href: '/studio',
      accentColor: 'emerald',
    },
    {
      title: 'Computational Chemist',
      description: 'DFT calculations, molecular dynamics, virtual screening, and ML-based property prediction.',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 12m-1 0a1 1 0 102 0 1 1 0 10-2 0M12 12c-4.97 0-9 2.686-9 6s4.03 6 9 6 9-2.686 9-6-4.03-6-9-6zM12 12c4.97 0 9-2.686 9-6s-4.03-6-9-6-9 2.686-9 6 4.03 6 9 6zM12 3v18" />
        </svg>
      ),
      freeTier: '3 min free',
      price: '$0.75/min',
      href: '/studio',
      accentColor: 'violet',
    },
    {
      title: 'Drug Discovery',
      description: 'Target identification, druggability assessment, ADMET optimization, and development pipeline.',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 15.5m14.8-.2l.2.2a9 9 0 01-2.1 5.7m-12.8-5.9l-.2.2a9 9 0 002.1 5.7" />
        </svg>
      ),
      freeTier: '3 min free',
      price: '$0.75/min',
      href: '/studio',
      accentColor: 'emerald',
    },
    {
      title: 'ParallelSynth',
      description: 'Advanced synthesis and orchestration module for complex multi-agent workflows.',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      ),
      freeTier: 'Beta Access',
      price: 'Custom',
      href: '/studio/parallel-synth',
      accentColor: 'cyan',
    },
  ];
  
  return (
    <div className="relative min-h-screen">
      {/* Brand pill (top-left) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="fixed top-6 left-6 z-20 flex items-center gap-3 px-3 py-2 glass-button rounded-full"
      >
        <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-cyan-500/30">
          <img src="/crowe-avatar.png" alt="Crowe Logic" className="w-full h-full object-cover" />
        </div>
        <div className="pr-2">
          <div className="text-sm font-bold text-white">MichaelCrowe.ai</div>
          <div className="text-[10px] text-cyan-400 font-medium tracking-wider">AI CONSULTANT</div>
        </div>
      </motion.div>
      
      {/* Hero section */}
      <div className="relative z-10 pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-6xl md:text-8xl font-display font-bold text-white mb-6 tracking-tighter">
              Crowe Logic{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-violet-400 bg-clip-text text-transparent animate-gradient">
                Studio
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-3xl mx-auto font-light">
              Transform expertise into immersive, voice-first experiences.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/studio">
                <GlowButton variant="primary" size="lg">
                  Enter Studio
                </GlowButton>
              </Link>
              <Link href="/studio/deep-consulting">
                <GlowButton variant="secondary" size="lg">
                  Start a Deep Dive
                </GlowButton>
              </Link>
            </div>
          </motion.div>
          
          {/* Module Cards Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {modules.map((module, i) => (
              <motion.div
                key={module.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.1 }}
              >
                <ModuleCard {...module} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="relative z-10 pb-8 text-center"
      >
        <div className="flex items-center justify-center gap-6 text-white/30 text-xs">
          <a href="mailto:michael@crowelogic.com" className="hover:text-white/50 transition-colors">Contact</a>
          <a href="https://github.com/MichaelCrowe11" className="hover:text-white/50 transition-colors">GitHub</a>
          <span className="text-white/20">© Crowe Logic, Inc.</span>
        </div>
      </motion.div>
    </div>
  );
}
