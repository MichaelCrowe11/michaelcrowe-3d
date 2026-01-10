'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Trail, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

interface OrbData {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  scale: number;
  color: string;
  distort: number;
  speed: number;
  delay: number;
}

function ExplosionRing({ progress }: { progress: number }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (ringRef.current && progress > 0) {
      const scale = progress * 30;
      ringRef.current.scale.set(scale, scale, scale);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - progress);
    }
  });

  if (progress <= 0) return null;

  return (
    <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.8, 1, 64]} />
      <meshBasicMaterial color="#22d3ee" transparent side={THREE.DoubleSide} />
    </mesh>
  );
}

function CoreGlow({ intensity }: { intensity: number }) {
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (glowRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.3;
      glowRef.current.scale.setScalar(intensity * pulse);
    }
  });

  return (
    <mesh ref={glowRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
    </mesh>
  );
}

function Orb({ data, phase, explosionProgress }: { data: OrbData; phase: string; explosionProgress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [currentPos] = useState(() => data.position.clone());

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;

    if (phase === 'gather') {
      const pulse = Math.sin(time * 8 + data.delay) * 0.15;
      const targetPos = data.position.clone().multiplyScalar(0.6 + pulse);
      currentPos.lerp(targetPos, 0.1);
      meshRef.current.position.copy(currentPos);

      const breathe = 0.5 + Math.sin(time * 6 + data.delay) * 0.3;
      meshRef.current.scale.setScalar(data.scale * breathe);
    } else {
      const expandFactor = Math.pow(explosionProgress, 0.7) * 8;
      const targetPos = data.position.clone().add(
        data.velocity.clone().multiplyScalar(expandFactor)
      );
      currentPos.lerp(targetPos, 0.08);
      meshRef.current.position.copy(currentPos);

      const scaleUp = data.scale * (1 + explosionProgress * 0.8);
      meshRef.current.scale.setScalar(scaleUp);
    }
  });

  return (
    <Trail
      width={phase === 'expand' ? 2 : 0.5}
      length={phase === 'expand' ? 8 : 2}
      color={data.color}
      attenuation={(t) => t * t}
    >
      <Sphere ref={meshRef} args={[1, 24, 24]} position={currentPos} scale={data.scale}>
        <MeshDistortMaterial
          color={data.color}
          distort={data.distort}
          speed={data.speed * 2}
          roughness={0}
          metalness={1}
          envMapIntensity={2}
        />
      </Sphere>
    </Trail>
  );
}

export function BigBang({ onComplete }: { onComplete?: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const [phase, setPhase] = useState<'gather' | 'explode' | 'expand'>('gather');
  const [explosionProgress, setExplosionProgress] = useState(0);
  const [ringProgress, setRingProgress] = useState(0);
  const [coreIntensity, setCoreIntensity] = useState(0.5);
  const hasCalledComplete = useRef(false);

  const colors = ['#22d3ee', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#14b8a6'];

  const orbs = useMemo(() => {
    const orbData: OrbData[] = [];
    const count = 80;

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 0.3 + Math.random() * 0.7;

      const pos = new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );

      orbData.push({
        position: pos,
        velocity: pos.clone().normalize().multiplyScalar(0.8 + Math.random() * 2),
        scale: 0.05 + Math.random() * 0.15,
        color: colors[Math.floor(Math.random() * colors.length)],
        distort: 0.3 + Math.random() * 0.5,
        speed: 1 + Math.random() * 3,
        delay: Math.random() * Math.PI * 2
      });
    }
    return orbData;
  }, []);

  useEffect(() => {
    // Build up core
    const coreTimer = setInterval(() => {
      setCoreIntensity(prev => Math.min(prev + 0.1, 2));
    }, 50);

    // Explode
    const explodeTimer = setTimeout(() => {
      setPhase('explode');
      setCoreIntensity(5);
      setRingProgress(0.01);
    }, 1000);

    // Expand
    const expandTimer = setTimeout(() => {
      setPhase('expand');
      clearInterval(coreTimer);
    }, 1200);

    return () => {
      clearInterval(coreTimer);
      clearTimeout(explodeTimer);
      clearTimeout(expandTimer);
    };
  }, []);

  useFrame((state, delta) => {
    if (phase === 'expand') {
      setExplosionProgress(prev => {
        const next = prev + delta * 0.5;
        if (next > 2.5 && !hasCalledComplete.current) {
          hasCalledComplete.current = true;
          onComplete?.();
        }
        return next;
      });
      setRingProgress(prev => Math.min(prev + delta * 0.8, 1));
      setCoreIntensity(prev => Math.max(prev - delta * 2, 0));
    }

    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Sparkles background */}
      <Sparkles
        count={200}
        scale={20}
        size={2}
        speed={0.3}
        opacity={0.5}
        color="#ffffff"
      />

      {/* Core glow */}
      <CoreGlow intensity={coreIntensity} />

      {/* Shockwave rings */}
      <ExplosionRing progress={ringProgress} />
      <ExplosionRing progress={Math.max(0, ringProgress - 0.2)} />
      <ExplosionRing progress={Math.max(0, ringProgress - 0.4)} />

      {/* Orbs with trails */}
      {orbs.map((orb, i) => (
        <Orb key={i} data={orb} phase={phase} explosionProgress={explosionProgress} />
      ))}

      {/* Dynamic lights */}
      <pointLight
        position={[0, 0, 0]}
        intensity={phase === 'explode' ? 100 : coreIntensity * 10}
        color="#ffffff"
        distance={100}
      />
      <pointLight position={[5, 5, 5]} intensity={2} color="#22d3ee" />
      <pointLight position={[-5, -5, -5]} intensity={2} color="#8b5cf6" />
    </group>
  );
}
