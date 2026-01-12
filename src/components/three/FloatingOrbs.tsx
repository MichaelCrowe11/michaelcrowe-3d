'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface OrbProps {
  position: [number, number, number];
  color: string;
  speed?: number;
  distort?: number;
  size?: number;
}

function Orb({ position, color, speed = 1, distort = 0.4, size = 1 }: OrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.3; // Slower float
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <Sphere ref={meshRef} args={[size, 64, 64]} position={position}>
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={distort}
        speed={1.5}
        roughness={0.1}
        metalness={0.1}
        transmission={0.5} // Glass-like
        thickness={0.5}
        transparent
        opacity={0.6}
      />
    </Sphere>
  );
}

export function FloatingOrbs() {
  return (
    <group>
      {/* Cyan/Blue Primary Orbs */}
      <Orb position={[-4, 2, -3]} color="#22d3ee" speed={0.4} size={0.8} />
      <Orb position={[4, -1, -2]} color="#34d399" speed={0.6} size={0.6} />
      
      {/* Violet/Accent Orbs */}
      <Orb position={[0, 3, -4]} color="#a78bfa" speed={0.5} size={0.5} />
      
      {/* Distorted Deep Background Orbs */}
      <Orb position={[-3, -2, -3]} color="#06b6d4" speed={0.3} distort={0.6} size={0.4} />
      <Orb position={[3, 1, -5]} color="#10b981" speed={0.45} distort={0.3} size={0.7} />
      
      {/* Extra ambient particles */}
      <Orb position={[2, 4, -6]} color="#8b5cf6" speed={0.3} size={0.3} />
      <Orb position={[-2, -3, -4]} color="#22d3ee" speed={0.4} size={0.2} />
    </group>
  );
}
