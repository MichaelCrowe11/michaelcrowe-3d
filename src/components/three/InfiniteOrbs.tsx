'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';

interface OrbProps {
  position: THREE.Vector3;
  scale: number;
  color: string;
  distort: number;
  speed: number;
  phase: number;
  depth: number;
}

function FloatingOrb({ data }: { data: OrbProps }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;

    // Complex floating motion
    const x = data.position.x + Math.sin(time * 0.2 + data.phase) * 3;
    const y = data.position.y + Math.cos(time * 0.15 + data.phase) * 2 + Math.sin(time * 0.4) * 0.5;
    const z = data.position.z + Math.sin(time * 0.1 + data.phase * 2) * 4;

    // Mouse parallax
    const parallaxStrength = data.depth * 0.03;
    const px = state.pointer.x * parallaxStrength * 5;
    const py = state.pointer.y * parallaxStrength * 3;

    meshRef.current.position.set(x + px, y + py, z);

    // Breathing scale
    const breathe = 1 + Math.sin(time * data.speed + data.phase) * 0.15;
    meshRef.current.scale.setScalar(data.scale * breathe);

    // Rotate
    meshRef.current.rotation.x = time * 0.1 + data.phase;
    meshRef.current.rotation.y = time * 0.15 + data.phase;

    // Pulsing emissive
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = 0.3 + Math.sin(time * 2 + data.phase) * 0.2;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 32, 32]} position={data.position} scale={data.scale}>
      <MeshDistortMaterial
        ref={materialRef}
        color={data.color}
        emissive={data.color}
        emissiveIntensity={0.3}
        distort={data.distort}
        speed={data.speed}
        roughness={0}
        metalness={0.9}
        envMapIntensity={3}
        transparent
        opacity={0.9}
      />
    </Sphere>
  );
}

function GlowSphere({ position, color, scale }: { position: [number, number, number]; color: string; scale: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
      ref.current.scale.setScalar(scale * pulse);
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.1} />
    </mesh>
  );
}

export function InfiniteOrbs() {
  const groupRef = useRef<THREE.Group>(null);

  const colors = ['#22d3ee', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4', '#a855f7', '#14b8a6'];

  const orbs = useMemo(() => {
    const orbData: OrbProps[] = [];

    // Near orbs (larger, more visible)
    for (let i = 0; i < 15; i++) {
      const x = (Math.random() - 0.5) * 30;
      const y = (Math.random() - 0.5) * 20;
      const z = -3 - Math.random() * 10;

      orbData.push({
        position: new THREE.Vector3(x, y, z),
        scale: 0.4 + Math.random() * 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        distort: 0.3 + Math.random() * 0.4,
        speed: 0.5 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
        depth: Math.abs(z)
      });
    }

    // Mid orbs
    for (let i = 0; i < 20; i++) {
      const x = (Math.random() - 0.5) * 50;
      const y = (Math.random() - 0.5) * 35;
      const z = -10 - Math.random() * 20;

      orbData.push({
        position: new THREE.Vector3(x, y, z),
        scale: 0.3 + Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        distort: 0.2 + Math.random() * 0.4,
        speed: 0.3 + Math.random() * 1,
        phase: Math.random() * Math.PI * 2,
        depth: Math.abs(z)
      });
    }

    // Far orbs (smaller, subtle)
    for (let i = 0; i < 30; i++) {
      const x = (Math.random() - 0.5) * 80;
      const y = (Math.random() - 0.5) * 50;
      const z = -25 - Math.random() * 40;

      orbData.push({
        position: new THREE.Vector3(x, y, z),
        scale: 0.15 + Math.random() * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        distort: 0.1 + Math.random() * 0.3,
        speed: 0.2 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        depth: Math.abs(z)
      });
    }

    return orbData;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle rotation
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.01;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Star field */}
      <Sparkles
        count={500}
        scale={100}
        size={1.5}
        speed={0.2}
        opacity={0.6}
        color="#ffffff"
      />

      {/* Colored sparkles */}
      <Sparkles
        count={100}
        scale={60}
        size={3}
        speed={0.3}
        opacity={0.4}
        color="#22d3ee"
      />
      <Sparkles
        count={100}
        scale={60}
        size={3}
        speed={0.3}
        opacity={0.4}
        color="#8b5cf6"
      />

      {/* Ambient glow spheres */}
      <GlowSphere position={[-15, 10, -20]} color="#22d3ee" scale={8} />
      <GlowSphere position={[20, -8, -30]} color="#8b5cf6" scale={10} />
      <GlowSphere position={[0, 15, -25]} color="#10b981" scale={6} />

      {/* Floating orbs */}
      {orbs.map((orb, i) => (
        <FloatingOrb key={i} data={orb} />
      ))}

      {/* Dynamic lights that move */}
      <Float speed={1} rotationIntensity={0} floatIntensity={2}>
        <pointLight position={[10, 10, 5]} intensity={3} color="#22d3ee" distance={50} />
      </Float>
      <Float speed={0.8} rotationIntensity={0} floatIntensity={2}>
        <pointLight position={[-10, -5, 0]} intensity={2} color="#8b5cf6" distance={40} />
      </Float>
      <Float speed={1.2} rotationIntensity={0} floatIntensity={3}>
        <pointLight position={[0, 5, -10]} intensity={2} color="#10b981" distance={40} />
      </Float>
    </group>
  );
}
