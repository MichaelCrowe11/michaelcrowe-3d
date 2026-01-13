'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { OrbitBackground } from '@/components/studio/OrbitBackground';
import { FloatingBlobs } from '@/components/studio/FloatingBlobs';
import { GlowButton } from '@/components/studio/GlowButton';
import { GlassCard } from '@/components/studio/GlassComponents';
import { PillTag, PriceChip } from '@/components/studio/PillTag';
import { StatusOrb } from '@/components/studio/StatusOrb';
import { WaveformDots } from '@/components/studio/WaveformDots';

interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  freeTier: string;
  price: string;
  href: string;
  accentColor?: 'cyan' | 'emerald' | 'amber' | 'sky';
  className?: string;
  featured?: boolean;
}

const accentStyles = {
  cyan: {
    icon: 'text-cyan-200',
    glow: 'group-hover:shadow-[0_30px_70px_-40px_rgba(91,201,214,0.6)]',
  },
  emerald: {
    icon: 'text-emerald-200',
    glow: 'group-hover:shadow-[0_30px_70px_-40px_rgba(122,212,181,0.6)]',
  },
  amber: {
    icon: 'text-amber-200',
    glow: 'group-hover:shadow-[0_30px_70px_-40px_rgba(208,169,128,0.6)]',
  },
  sky: {
    icon: 'text-sky-200',
    glow: 'group-hover:shadow-[0_30px_70px_-40px_rgba(108,169,223,0.6)]',
  },
};

function ModuleCard({
  title,
  description,
  icon,
  freeTier,
  price,
  href,
  accentColor = 'cyan',
  className = '',
  featured = false,
}: ModuleCardProps) {
  const accent = accentStyles[accentColor];

  return (
    <Link href={href}>
      <GlassCard className={`relative p-6 h-full min-h-[260px] flex flex-col group ${accent.glow} ${className}`}>
        <PriceChip price={price} className="bg-white/5 border border-white/10 text-white/70" />
        
        {featured ? (
          <motion.div initial="hidden" animate="show" variants={{}} className="flex flex-col flex-grow">
            <motion.div
              className={`mb-5 ${accent.icon} scale-110 origin-left`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
            >
              {icon}
            </motion.div>
            <motion.h3
              className="text-2xl font-semibold text-white mb-3 group-hover:text-white transition-colors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
            >
              {title}
            </motion.h3>
            <motion.p
              className="text-white/60 text-base mb-6 flex-grow max-w-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.25 }}
            >
              {description}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.35 }}
            >
              <PillTag variant={accentColor}>{freeTier}</PillTag>
            </motion.div>
          </motion.div>
        ) : (
          <>
            <div className={`mb-4 ${accent.icon} scale-95 origin-left`}>
              {icon}
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-white transition-colors">
              {title}
            </h3>
            
            <p className="text-white/60 text-sm mb-4 flex-grow">
              {description}
            </p>
            
            <PillTag variant={accentColor}>{freeTier}</PillTag>
          </>
        )}
      </GlassCard>
    </Link>
  );
}

export function StudioHero() {
  const modules = [
    {
      title: 'Deep Consulting',
      description: 'Private strategy sessions for high-stakes decisions, R&D, and executive alignment.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      description: 'Process intelligence for extraction, purification, and quality assurance.',
      icon: (
        <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      description: 'Evidence-grade mycology insights, clinical context, and formulation support.',
      icon: (
        <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      description: 'Molecular intelligence, simulation, and predictive modeling on demand.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 12m-1 0a1 1 0 102 0 1 1 0 10-2 0M12 12c-4.97 0-9 2.686-9 6s4.03 6 9 6 9-2.686 9-6-4.03-6-9-6zM12 12c4.97 0 9-2.686 9-6s-4.03-6-9-6-9 2.686-9 6 4.03 6 9 6zM12 3v18" />
        </svg>
      ),
      freeTier: '3 min free',
      price: '$0.75/min',
      href: '/studio',
      accentColor: 'sky',
    },
    {
      title: 'Drug Discovery',
      description: 'Target-to-candidate intelligence with clinical and regulatory rigor.',
      icon: (
        <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      description: 'Agentic orchestration and multi-model synthesis for complex workflows.',
      icon: (
        <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      ),
      freeTier: 'Studio pilot',
      price: 'Invite',
      href: '/studio/parallel-synth',
      accentColor: 'cyan',
    },
  ];

  const rituals = [
    {
      title: 'Frame the mission',
      description: 'Define intent, risk, and outcomes before a single word is spoken.',
    },
    {
      title: 'Conduct live voice',
      description: 'Capture nuance, pressure-test ideas, and surface hidden constraints.',
    },
    {
      title: 'Synthesize and ship',
      description: 'Convert the conversation into decisions, specs, and execution paths.',
    },
  ];

  const voiceStack = ['ASR', 'TTS', 'Agentic routing', 'Secure capture', 'Compliance-grade logs'];

  const moduleLayout = [
    'lg:col-span-7 lg:min-h-[360px]',
    'lg:col-span-5',
    'lg:col-span-4',
    'lg:col-span-8 lg:min-h-[340px]',
    'lg:col-span-6',
    'lg:col-span-6',
  ];
  
  return (
    <div className="relative min-h-screen">
      {/* Background layers */}
      <OrbitBackground className="opacity-80" />
      <FloatingBlobs count={4} className="opacity-80" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-gradient-to-b from-white/[0.06] to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(122,212,181,0.08),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_70%,rgba(208,169,128,0.08),transparent_45%)]" />
      
      {/* Hero section */}
      <div className="relative z-10 pt-16 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3 px-3 py-2 glass-button rounded-full">
              <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-white/20">
                <img src="/crowe-avatar.png" alt="Crowe Logic" className="w-full h-full object-cover" />
              </div>
              <div className="pr-2">
                <div className="text-sm font-semibold text-white">MichaelCrowe.ai</div>
                <div className="text-[10px] text-white/50 font-medium tracking-[0.35em] uppercase">Studio</div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6 text-[11px] uppercase tracking-[0.35em] text-white/40">
              <span>Advisory</span>
              <span>Research</span>
              <span>Build</span>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 mt-16 items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.45em] text-white/50">
                <span className="h-px w-10 bg-white/20" />
                Voice-first studio
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-semibold text-white mt-6 mb-6 tracking-tight">
                Crowe Logic <span className="gradient-text">Studio</span>
              </h1>
              <p className="text-lg md:text-xl text-white/70 max-w-xl">
                A timeless studio for builders: craft, test, and ship decisions with clarity. Guided by the
                MichaelCrowe.ai persona and connected to{' '}
                <a
                  href="https://crowelogic.com"
                  className="text-white/80 underline decoration-white/30 underline-offset-4 hover:text-white hover:decoration-white/70 transition-colors"
                >
                  CroweLogic.com
                </a>
                .
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
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
              <div className="mt-10 flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.35em] text-white/40">
                <span className="px-3 py-1 rounded-full border border-white/10">Live voice sessions</span>
                <span className="px-3 py-1 rounded-full border border-white/10">Systems-first</span>
                <span className="px-3 py-1 rounded-full border border-white/10">Private by default</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="glass-panel rounded-3xl p-8"
            >
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.35em] text-white/50">
                <span>Voice console</span>
                <span className="text-white/70">Live</span>
              </div>
              <div className="mt-8 grid gap-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.35em] text-white/50">Session status</p>
                    <WaveformDots isActive dotCount={7} className="mt-3 justify-start" />
                    <p className="text-sm text-white/60 mt-4 max-w-xs">
                      Hands-free, low-latency dialogue with persistent memory and reversible decisions.
                    </p>
                  </div>
                  <StatusOrb status="listening" className="md:scale-75" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-xs uppercase tracking-[0.35em] text-white/40">Latency</p>
                    <p className="text-lg font-semibold text-white mt-2">280 ms</p>
                    <p className="text-xs text-white/50">Streaming response</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-xs uppercase tracking-[0.35em] text-white/40">Trust layer</p>
                    <p className="text-lg font-semibold text-white mt-2">Audit-ready</p>
                    <p className="text-xs text-white/50">Full session trace</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="mt-16 grid md:grid-cols-3 gap-6"
          >
            {rituals.map((ritual, index) => (
              <div key={ritual.title} className="glass-card p-6">
                <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.35em] text-white/40">
                  <span className="text-white/60">0{index + 1}</span>
                  <span className="h-px flex-1 bg-white/10" />
                </div>
                <h3 className="text-lg font-semibold text-white mt-4">{ritual.title}</h3>
                <p className="text-sm text-white/60 mt-3">{ritual.description}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85 }}
            className="mt-12 glass-panel rounded-3xl p-8"
          >
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.35em] text-white/50">
              <span>Voice stack</span>
              <span className="text-white/60">Orchestrated</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.35em] text-white/40">
              {voiceStack.map((item) => (
                <span key={item} className="px-3 py-2 rounded-full border border-white/10 bg-white/[0.03]">
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-20"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-display text-white">Capabilities</h2>
              <span className="text-[11px] uppercase tracking-[0.35em] text-white/40">Select a module</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
              {modules.map((module, i) => (
                <motion.div
                  key={`${module.title}-feature`}
                  initial={i === 0 || i === 3 ? { opacity: 0, y: 18, scale: 0.98 } : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: 0.9 + i * 0.1,
                    duration: i === 0 || i === 3 ? 0.9 : 0.6,
                    ease: i === 0 || i === 3 ? [0.22, 1, 0.36, 1] : 'easeOut',
                  }}
                  className={moduleLayout[i] || 'lg:col-span-4'}
                >
                  <ModuleCard {...module} className={i === 0 || i === 3 ? 'lg:p-8' : ''} featured={i === 0 || i === 3} />
                </motion.div>
              ))}
            </div>
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
