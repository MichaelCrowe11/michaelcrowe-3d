'use client';

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface LiquidOrbProps {
  onClick: () => void;
  isHovered: boolean;
}

function LiquidOrb({ onClick, isHovered }: LiquidOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hoverIntensity, setHoverIntensity] = useState(0);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;

      // Slow rotation
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.15;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.1;

      // Smooth hover transition
      const targetIntensity = isHovered ? 1 : 0;
      setHoverIntensity(prev => prev + (targetIntensity - prev) * 0.1);

      // Scale pulse on hover
      const baseScale = 1 + hoverIntensity * 0.15;
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.03 * hoverIntensity;
      meshRef.current.scale.setScalar(baseScale + pulse);
    }
  });

  return (
    <Sphere
      ref={meshRef}
      args={[1, 64, 64]}
      onClick={onClick}
    >
      <MeshDistortMaterial
        color={isHovered ? "#22d3ee" : "#10b981"}
        attach="material"
        distort={0.4 + hoverIntensity * 0.2}
        speed={2 + hoverIntensity * 2}
        roughness={0.15}
        metalness={0.85}
        emissive={isHovered ? "#22d3ee" : "#10b981"}
        emissiveIntensity={0.1 + hoverIntensity * 0.3}
      />
    </Sphere>
  );
}

interface LiquidOrbButtonProps {
  onClick: () => void;
}

export function LiquidOrbButton({ onClick }: LiquidOrbButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative w-24 h-24 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect behind orb */}
      <div
        className="absolute inset-0 rounded-full transition-all duration-300"
        style={{
          background: isHovered
            ? 'radial-gradient(circle, rgba(34, 211, 238, 0.4) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)',
          transform: `scale(${isHovered ? 1.5 : 1.2})`,
        }}
      />

      {/* Three.js Canvas */}
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-3, -3, 2]} intensity={0.5} color="#22d3ee" />
        <pointLight position={[3, 3, 2]} intensity={0.5} color="#10b981" />

        <LiquidOrb onClick={onClick} isHovered={isHovered} />
      </Canvas>

      {/* Outer pulse rings */}
      {isHovered && (
        <>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute inset-0 rounded-full border border-cyan-400/30 pointer-events-none animate-ping"
              style={{
                animationDelay: `${i * 0.3}s`,
                animationDuration: '1.5s',
              }}
            />
          ))}
        </>
      )}

      {/* "Talk to me" label */}
      <div
        className={`absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-300 ${
          isHovered ? 'opacity-100 -translate-y-1' : 'opacity-70 translate-y-0'
        }`}
      >
        <div className="px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-sm border border-white/10">
          <span className="text-white/80 text-xs font-medium">Talk to me</span>
        </div>
      </div>
    </div>
  );
}
