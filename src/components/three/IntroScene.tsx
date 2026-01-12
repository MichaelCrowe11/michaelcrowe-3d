'use client';

import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ChromaticAberration, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Suspense, useState, useEffect } from 'react';
import { BigBang } from './BigBang';
import { InfiniteOrbs } from './InfiniteOrbs';
import { AudioReactive } from './AudioReactive';

function SceneContent({ showOrbs, onIntroComplete }: { showOrbs: boolean; onIntroComplete: () => void }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={75} />

      {/* Deep space ambient */}
      <ambientLight intensity={0.05} />

      {/* Stars background */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {!showOrbs && <BigBang onComplete={onIntroComplete} />}
      {showOrbs && <InfiniteOrbs />}

      {/* Audio-reactive background elements */}
      {showOrbs && <AudioReactive baseRadius={4} particleCount={200} />}

      <Environment preset="night" blur={0.8} />

      {/* Post-processing effects - Optimized */}
      <EffectComposer multisampling={0} enableNormalPass={false}>
        <Bloom
          intensity={1.5}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
          blendFunction={BlendFunction.ADD}
          mipmapBlur
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[0.001, 0.001]}
          radialModulation={true}
          modulationOffset={0.5}
        />
        <Vignette
          offset={0.3}
          darkness={0.7}
          blendFunction={BlendFunction.NORMAL}
        />
        <Noise
          opacity={0.02}
          blendFunction={BlendFunction.OVERLAY}
        />
      </EffectComposer>
    </>
  );
}

function LoadingScreen() {
  return (
    <div className="absolute inset-0 z-50 bg-[#030303] flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
    </div>
  );
}

export function IntroScene({ onIntroComplete }: { onIntroComplete: () => void }) {
  const [showOrbs, setShowOrbs] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Give WebGL time to initialize
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleIntroComplete = () => {
    setShowOrbs(true);
    setTimeout(onIntroComplete, 300);
  };

  return (
    <div className="fixed inset-0 z-0">
      {!isLoaded && <LoadingScreen />}
      <Canvas
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
        }}
        style={{ background: '#030303' }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 8], fov: 75 }}
        onCreated={() => setIsLoaded(true)}
      >
        <color attach="background" args={['#030303']} />
        <fog attach="fog" args={['#030303', 30, 100]} />
        <Suspense fallback={null}>
          <SceneContent showOrbs={showOrbs} onIntroComplete={handleIntroComplete} />
        </Suspense>
      </Canvas>
    </div>
  );
}
