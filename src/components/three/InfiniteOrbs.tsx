'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

export function InfiniteOrbs() {
  const groupRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  const colors = ['#22d3ee', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899'];

  const orbs = useMemo(() => {
    const orbData: {
      position: THREE.Vector3;
      basePosition: THREE.Vector3;
      scale: number;
      color: string;
      distort: number;
      speed: number;
      phase: number;
    }[] = [];

    // Create scattered orbs across the scene
    for (let i = 0; i < 25; i++) {
      const x = (Math.random() - 0.5) * 40;
      const y = (Math.random() - 0.5) * 30;
      const z = -5 - Math.random() * 30;

      const pos = new THREE.Vector3(x, y, z);
      orbData.push({
        position: pos.clone(),
        basePosition: pos.clone(),
        scale: 0.3 + Math.random() * 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        distort: 0.2 + Math.random() * 0.5,
        speed: 0.5 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2
      });
    }
    return orbData;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;

    // Track mouse for subtle parallax
    mouseRef.current.x = THREE.MathUtils.lerp(mouseRef.current.x, state.pointer.x * 2, 0.05);
    mouseRef.current.y = THREE.MathUtils.lerp(mouseRef.current.y, state.pointer.y * 2, 0.05);

    groupRef.current.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh && orbs[i]) {
        const orb = orbs[i];

        // Floating motion
        child.position.x = orb.basePosition.x + Math.sin(time * 0.3 + orb.phase) * 2;
        child.position.y = orb.basePosition.y + Math.cos(time * 0.2 + orb.phase) * 1.5;
        child.position.z = orb.basePosition.z + Math.sin(time * 0.1 + orb.phase) * 3;

        // Subtle parallax based on mouse
        child.position.x += mouseRef.current.x * (Math.abs(orb.basePosition.z) * 0.02);
        child.position.y += mouseRef.current.y * (Math.abs(orb.basePosition.z) * 0.02);

        // Breathing scale
        const breathe = 1 + Math.sin(time * orb.speed + orb.phase) * 0.1;
        child.scale.setScalar(orb.scale * breathe);
      }
    });

    // Very slow rotation
    groupRef.current.rotation.y = time * 0.02;
  });

  return (
    <group ref={groupRef}>
      {orbs.map((orb, i) => (
        <Sphere key={i} args={[1, 32, 32]} position={orb.position} scale={orb.scale}>
          <MeshDistortMaterial
            color={orb.color}
            distort={orb.distort}
            speed={orb.speed}
            roughness={0.05}
            metalness={0.9}
            transparent
            opacity={0.85}
          />
        </Sphere>
      ))}
    </group>
  );
}
