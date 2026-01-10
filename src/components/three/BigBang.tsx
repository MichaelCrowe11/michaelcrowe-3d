'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface OrbData {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  scale: number;
  color: string;
  distort: number;
  speed: number;
}

export function BigBang({ onComplete }: { onComplete?: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const [phase, setPhase] = useState<'gather' | 'explode' | 'expand'>('gather');
  const [explosionTime, setExplosionTime] = useState(0);
  const startTime = useRef(Date.now());
  const hasCalledComplete = useRef(false);

  const colors = ['#22d3ee', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];

  const orbs = useMemo(() => {
    const orbData: OrbData[] = [];
    const count = 40;

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 0.5 + Math.random() * 0.5;

      orbData.push({
        position: new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi)
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2
        ).normalize().multiplyScalar(0.5 + Math.random() * 1.5),
        scale: 0.1 + Math.random() * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        distort: 0.3 + Math.random() * 0.4,
        speed: 1 + Math.random() * 2
      });
    }
    return orbData;
  }, []);

  useEffect(() => {
    const gatherTimer = setTimeout(() => setPhase('explode'), 800);
    const expandTimer = setTimeout(() => {
      setPhase('expand');
      setExplosionTime(Date.now());
    }, 1200);

    return () => {
      clearTimeout(gatherTimer);
      clearTimeout(expandTimer);
    };
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const elapsed = (Date.now() - startTime.current) / 1000;

    groupRef.current.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh && orbs[i]) {
        const orb = orbs[i];

        if (phase === 'gather') {
          // Pulse inward
          const pulse = Math.sin(elapsed * 8) * 0.1;
          child.position.copy(orb.position).multiplyScalar(0.8 + pulse);
          child.scale.setScalar(orb.scale * (0.5 + Math.sin(elapsed * 10) * 0.3));
        } else if (phase === 'explode' || phase === 'expand') {
          // Explode outward
          const explosionElapsed = (Date.now() - explosionTime) / 1000;
          const expandFactor = phase === 'expand' ? explosionElapsed * 2 : 0;

          const targetPos = orb.position.clone().add(
            orb.velocity.clone().multiplyScalar(expandFactor * 3)
          );

          child.position.lerp(targetPos, 0.05);

          // Scale up as they expand
          const targetScale = orb.scale * (1 + expandFactor * 0.5);
          child.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.05);

          // Fade out after explosion
          if (phase === 'expand' && explosionElapsed > 2 && !hasCalledComplete.current) {
            hasCalledComplete.current = true;
            onComplete?.();
          }
        }
      }
    });

    // Rotate entire group slowly
    groupRef.current.rotation.y += delta * 0.2;
  });

  return (
    <group ref={groupRef}>
      {orbs.map((orb, i) => (
        <Sphere key={i} args={[1, 32, 32]} position={orb.position} scale={orb.scale}>
          <MeshDistortMaterial
            color={orb.color}
            distort={orb.distort}
            speed={orb.speed}
            roughness={0.1}
            metalness={0.8}
            transparent
            opacity={phase === 'expand' ? 0.8 : 1}
          />
        </Sphere>
      ))}

      {/* Central glow */}
      <pointLight
        position={[0, 0, 0]}
        intensity={phase === 'explode' ? 50 : phase === 'expand' ? 20 : 5}
        color="#ffffff"
        distance={50}
      />
    </group>
  );
}
