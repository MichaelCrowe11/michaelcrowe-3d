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

    // Complex floating motion - slower, more elegant
    const x = data.position.x + Math.sin(time * 0.15 + data.phase) * 2.5;
    const y = data.position.y + Math.cos(time * 0.12 + data.phase) * 1.5 + Math.sin(time * 0.3) * 0.3;
    const z = data.position.z + Math.sin(time * 0.08 + data.phase * 2) * 3;

    // Mouse parallax - more subtle
    const parallaxStrength = data.depth * 0.02;
    const px = state.pointer.x * parallaxStrength * 4;
    const py = state.pointer.y * parallaxStrength * 2;

    meshRef.current.position.set(x + px, y + py, z);

    // Breathing scale - more subtle
    const breathe = 1 + Math.sin(time * data.speed + data.phase) * 0.1;
    meshRef.current.scale.setScalar(data.scale * breathe);

    // Rotate - slower
    meshRef.current.rotation.x = time * 0.05 + data.phase;
    meshRef.current.rotation.y = time * 0.08 + data.phase;

    // Pulsing emissive - subtle
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = 0.15 + Math.sin(time * 1.5 + data.phase) * 0.1;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 16, 16]} position={data.position} scale={data.scale}>
      <MeshDistortMaterial
        ref={materialRef}
        color={data.color}
        emissive={data.color}
        emissiveIntensity={0.15}
        distort={data.distort}
        speed={data.speed}
        roughness={0.4}
        metalness={0.9}
        envMapIntensity={1.5}
      />
    </Sphere>
  );
}

function GlowSphere({ position, color, scale }: { position: [number, number, number]; color: string; scale: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.2;
      ref.current.scale.setScalar(scale * pulse);
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.04} />
    </mesh>
  );
}

export function InfiniteOrbs() {
  const groupRef = useRef<THREE.Group>(null);

  // Sophisticated neutral palette - warm metallics, earth tones
  const colors = [
    '#c9a55c', // warm gold
    '#8b7355', // bronze
    '#6b5b4f', // dark bronze
    '#a08060', // amber bronze
    '#d4c4a8', // soft cream
    '#4a423a', // deep earth
    '#b8a080', // muted gold
    '#707070', // neutral gray
  ];

  const orbs = useMemo(() => {
    const orbData: OrbProps[] = [];

    // Near orbs (larger, more visible)
    for (let i = 0; i < 12; i++) {
      const x = (Math.random() - 0.5) * 30;
      const y = (Math.random() - 0.5) * 20;
      const z = -3 - Math.random() * 10;

      orbData.push({
        position: new THREE.Vector3(x, y, z),
        scale: 0.35 + Math.random() * 0.6,
        color: colors[Math.floor(Math.random() * colors.length)],
        distort: 0.2 + Math.random() * 0.3,
        speed: 0.3 + Math.random() * 1,
        phase: Math.random() * Math.PI * 2,
        depth: Math.abs(z)
      });
    }

    // Mid orbs
    for (let i = 0; i < 18; i++) {
      const x = (Math.random() - 0.5) * 50;
      const y = (Math.random() - 0.5) * 35;
      const z = -10 - Math.random() * 20;

      orbData.push({
        position: new THREE.Vector3(x, y, z),
        scale: 0.25 + Math.random() * 0.4,
        color: colors[Math.floor(Math.random() * colors.length)],
        distort: 0.15 + Math.random() * 0.3,
        speed: 0.2 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
        depth: Math.abs(z)
      });
    }

    // Far orbs (smaller, subtle)
    for (let i = 0; i < 25; i++) {
      const x = (Math.random() - 0.5) * 80;
      const y = (Math.random() - 0.5) * 50;
      const z = -25 - Math.random() * 40;

      orbData.push({
        position: new THREE.Vector3(x, y, z),
        scale: 0.12 + Math.random() * 0.25,
        color: colors[Math.floor(Math.random() * colors.length)],
        distort: 0.08 + Math.random() * 0.2,
        speed: 0.15 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
        depth: Math.abs(z)
      });
    }

    return orbData;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      // Very subtle rotation
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.005;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Star field - dimmer, more sparse */}
      <Sparkles
        count={300}
        scale={100}
        size={1}
        speed={0.1}
        opacity={0.35}
        color="#ffffff"
      />

      {/* Subtle warm sparkles */}
      <Sparkles
        count={60}
        scale={60}
        size={2}
        speed={0.15}
        opacity={0.2}
        color="#c9a55c"
      />
      <Sparkles
        count={40}
        scale={60}
        size={2}
        speed={0.15}
        opacity={0.15}
        color="#8b7355"
      />

      {/* Ambient glow spheres - warm, subtle */}
      <GlowSphere position={[-15, 10, -20]} color="#c9a55c" scale={10} />
      <GlowSphere position={[20, -8, -30]} color="#8b7355" scale={12} />
      <GlowSphere position={[0, 15, -25]} color="#6b5b4f" scale={8} />

      {/* Floating orbs */}
      {orbs.map((orb, i) => (
        <FloatingOrb key={i} data={orb} />
      ))}

      {/* Dynamic lights - warm tones */}
      <Float speed={0.8} rotationIntensity={0} floatIntensity={1.5}>
        <pointLight position={[10, 10, 5]} intensity={1.5} color="#c9a55c" distance={50} />
      </Float>
      <Float speed={0.6} rotationIntensity={0} floatIntensity={1.5}>
        <pointLight position={[-10, -5, 0]} intensity={1} color="#8b7355" distance={40} />
      </Float>
      <Float speed={0.9} rotationIntensity={0} floatIntensity={2}>
        <pointLight position={[0, 5, -10]} intensity={1} color="#d4c4a8" distance={40} />
      </Float>
    </group>
  );
}
