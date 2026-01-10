'use client';

import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Suspense, useState } from 'react';
import { BigBang } from './BigBang';
import { InfiniteOrbs } from './InfiniteOrbs';

function SceneContent({ showOrbs, onIntroComplete }: { showOrbs: boolean; onIntroComplete: () => void }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={60} />

      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#22d3ee" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#8b5cf6" />

      {!showOrbs && <BigBang onComplete={onIntroComplete} />}
      {showOrbs && <InfiniteOrbs />}

      <Environment preset="night" />

      <EffectComposer>
        <Bloom
          intensity={1.2}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
          blendFunction={BlendFunction.ADD}
        />
        <Vignette
          offset={0.3}
          darkness={0.9}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </>
  );
}

export function IntroScene({ onIntroComplete }: { onIntroComplete: () => void }) {
  const [showOrbs, setShowOrbs] = useState(false);

  const handleIntroComplete = () => {
    setShowOrbs(true);
    setTimeout(onIntroComplete, 500);
  };

  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: '#030303' }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <SceneContent showOrbs={showOrbs} onIntroComplete={handleIntroComplete} />
        </Suspense>
      </Canvas>
    </div>
  );
}
