'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Script from 'next/script';

const IntroScene = dynamic(
  () => import('@/components/three/IntroScene').then((mod) => mod.IntroScene),
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

function CentralOrbWithWidget({ visible }: { visible: boolean }) {
  const [widgetReady, setWidgetReady] = useState(false);

  useEffect(() => {
    // Style the ElevenLabs widget to blend into our orb
    const style = document.createElement('style');
    style.id = 'elevenlabs-custom-styles';
    style.textContent = `
      .orb-widget-container elevenlabs-convai {
        position: relative !important;
        z-index: 10 !important;
      }
      elevenlabs-convai::part(widget) {
        width: 100px !important;
        height: 100px !important;
        background: transparent !important;
        box-shadow: none !important;
      }
      elevenlabs-convai::part(widget-orb) {
        background: linear-gradient(135deg, rgba(34, 211, 238, 0.9), rgba(16, 185, 129, 0.9)) !important;
        box-shadow: 
          0 0 40px rgba(34, 211, 238, 0.6),
          0 0 80px rgba(16, 185, 129, 0.4),
          inset 0 0 20px rgba(255, 255, 255, 0.2) !important;
        border: 2px solid rgba(255, 255, 255, 0.2) !important;
      }
      elevenlabs-convai::part(widget-orb):hover {
        transform: scale(1.05) !important;
        box-shadow: 
          0 0 60px rgba(34, 211, 238, 0.8),
          0 0 120px rgba(16, 185, 129, 0.5),
          inset 0 0 30px rgba(255, 255, 255, 0.3) !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById('elevenlabs-custom-styles');
      if (existingStyle) existingStyle.remove();
    };
  }, []);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 1.5, type: 'spring', damping: 15 }}
      className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none"
    >
      {/* Outer glow rings */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute w-[350px] h-[350px] rounded-full bg-gradient-to-r from-violet-500/15 to-cyan-500/15 blur-2xl"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute w-[220px] h-[220px] rounded-full bg-gradient-to-r from-cyan-500/25 to-emerald-500/25 blur-xl"
      />

      {/* Glass orb container */}
      <motion.div
        animate={{
          boxShadow: [
            '0 0 60px rgba(34, 211, 238, 0.3), 0 0 120px rgba(16, 185, 129, 0.2)',
            '0 0 80px rgba(34, 211, 238, 0.5), 0 0 160px rgba(16, 185, 129, 0.3)',
            '0 0 60px rgba(34, 211, 238, 0.3), 0 0 120px rgba(16, 185, 129, 0.2)',
          ]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="relative w-[200px] h-[200px] rounded-full bg-gradient-to-br from-white/[0.06] to-transparent backdrop-blur-sm border border-white/10 flex items-center justify-center pointer-events-auto"
      >
        {/* Inner glass highlight */}
        <div className="absolute top-5 left-8 w-14 h-10 bg-white/10 rounded-full blur-lg" />

        {/* ElevenLabs Widget */}
        <div 
          className="orb-widget-container relative z-10"
          dangerouslySetInnerHTML={{ 
            __html: '<elevenlabs-convai agent-id="bBKor4JZfhlkTrCfFRa8"></elevenlabs-convai>' 
          }} 
        />
      </motion.div>

      {/* Floating particles */}
      {[...Array(16)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400/50"
          animate={{
            x: [0, Math.cos(i * 22.5 * Math.PI / 180) * (130 + (i % 3) * 30), 0],
            y: [0, Math.sin(i * 22.5 * Math.PI / 180) * (130 + (i % 3) * 30), 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 4 + (i % 4),
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.15,
          }}
        />
      ))}
    </motion.div>
  );
}

function WelcomeText({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.8, duration: 1 }}
      className="fixed top-[18%] left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
        className="text-3xl md:text-5xl font-extralight text-white/80 mb-3"
      >
        What can I build for you?
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4 }}
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
      transition={{ delay: 2.8 }}
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

      {/* Central Orb with ElevenLabs Widget */}
      <CentralOrbWithWidget visible={showUI} />

      {/* ElevenLabs Script */}
      {showUI && (
        <Script 
          src="https://unpkg.com/@elevenlabs/convai-widget-embed@beta" 
          strategy="lazyOnload"
        />
      )}

      {/* Footer */}
      <Footer visible={showUI} />
    </main>
  );
}
