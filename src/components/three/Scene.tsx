'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Suspense } from 'react';
import { NeuralNetwork } from './NeuralNetwork';
import { FloatingOrbs } from './FloatingOrbs';

function SceneContent() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.3}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 2.2}
      />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#06b6d4" /> {/* Cyan */}
      <pointLight position={[-10, -10, -10]} intensity={1} color="#a78bfa" /> {/* Violet */}
      <spotLight position={[0, 10, 0]} intensity={1} color="#34d399" angle={0.6} penumbra={1} />

      {/* 3D Elements */}
      <NeuralNetwork />
      <FloatingOrbs />

      {/* Environment */}
      <Environment preset="night" blur={0.8} />

      {/* Post-processing effects */}
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.5}
          luminanceThreshold={0.4}
          luminanceSmoothing={0.7}
          blendFunction={BlendFunction.ADD}
          mipmapBlur
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[0.0003, 0.0003]}
        />
      </EffectComposer>
    </>
  );
}

export function Scene() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        gl={{ 
          antialias: false, // Post-processing handles AA usually, or disabling for perf
          alpha: true, 
          powerPreference: 'high-performance',
          stencil: false,
          depth: true
        }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]} // Limit DPR for performance
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
