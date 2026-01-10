'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

const IntroScene = dynamic(
  () => import('@/components/three/IntroScene').then((mod) => mod.IntroScene),
  { ssr: false }
);

const AgenticChat = dynamic(
  () => import('@/components/chat/AgenticChat').then((mod) => mod.AgenticChat),
  { ssr: false }
);

export default function Home() {
  const [showChat, setShowChat] = useState(false);

  return (
    <main className="relative min-h-screen bg-[#030303] overflow-hidden">
      <IntroScene onIntroComplete={() => setShowChat(true)} />
      <AgenticChat visible={showChat} />
    </main>
  );
}
