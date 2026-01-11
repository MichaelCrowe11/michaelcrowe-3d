'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { motion } from 'framer-motion';

const IntroScene = dynamic(
  () => import('@/components/three/IntroScene').then((mod) => mod.IntroScene),
  { ssr: false }
);

const VoiceChat = dynamic(
  () => import('@/components/chat/VoiceChat').then((mod) => mod.VoiceChat),
  { ssr: false }
);

function Branding() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="fixed top-6 left-6 z-20 flex items-center gap-3"
    >
      <div className="w-10 h-10 rounded-xl overflow-hidden ring-1 ring-white/10 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
        <img src="/crowe-avatar.png" alt="MC" className="w-full h-full object-cover" />
      </div>
      <div>
        <h1 className="text-lg font-medium text-white/90">
          michael<span className="text-cyan-400">crowe</span>.ai
        </h1>
        <p className="text-xs text-white/40">AI Consultant</p>
      </div>
    </motion.div>
  );
}

function WelcomeText({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 1 }}
      className="fixed top-[20%] left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8 }}
        className="text-3xl md:text-5xl font-extralight text-white/80 mb-3"
      >
        What can I build for you?
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="text-white/30 text-sm"
      >
        Tap the orb to speak with AI
      </motion.p>
    </motion.div>
  );
}

function Footer({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.5 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-6 text-white/20 text-xs"
    >
      <a href="mailto:michael@crowelogic.com" className="hover:text-white/50 transition-colors">Contact</a>
      <a href="https://github.com/MichaelCrowe11" className="hover:text-white/50 transition-colors">GitHub</a>
      <span className="text-white/10">© Crowe Logic, Inc.</span>
    </motion.div>
  );
}

export default function Home() {
  const [showUI, setShowUI] = useState(false);

  return (
    <main className="relative min-h-screen bg-[#030303] overflow-hidden">
      {/* 3D Background */}
      <IntroScene onIntroComplete={() => setShowUI(true)} />

      {/* Branding */}
      {showUI && <Branding />}

      {/* Welcome text */}
      <WelcomeText visible={showUI} />

      {/* Voice Chat Orb */}
      <VoiceChat visible={showUI} />

      {/* Footer */}
      <Footer visible={showUI} />
    </main>
  );
}
