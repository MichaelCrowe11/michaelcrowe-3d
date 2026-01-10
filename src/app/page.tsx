'use client';

import dynamic from 'next/dynamic';
import { Hero } from '@/components/sections/Hero';
import { Services } from '@/components/sections/Services';
import { Products } from '@/components/sections/Products';
import { Footer } from '@/components/sections/Footer';

// Dynamic import for Three.js scene to prevent SSR issues
const Scene = dynamic(
  () => import('@/components/three/Scene').then((mod) => mod.Scene),
  { ssr: false }
);

// Dynamic import for chat component
const AIChat = dynamic(
  () => import('@/components/chat/AIChat').then((mod) => mod.AIChat),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[var(--background)]">
      {/* 3D Background Scene */}
      <Scene />

      {/* Content sections */}
      <Hero />
      <Services />
      <Products />
      <Footer />

      {/* AI Chat Widget */}
      <AIChat />
    </main>
  );
}
