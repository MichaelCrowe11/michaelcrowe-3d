'use client';

import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Types for conversation state
type ConversationState = 'idle' | 'listening' | 'speaking' | 'thinking';

interface AudioReactiveProps {
  baseRadius?: number;
  particleCount?: number;
}

// Global state for conversation status
let globalState: ConversationState = 'idle';
let globalIntensity = 0;

// Hook to get conversation state from ElevenLabs widget
function useConversationState() {
  const [state, setState] = useState<ConversationState>('idle');
  const [intensity, setIntensity] = useState(0);

  useEffect(() => {
    const handleStateChange = (event: CustomEvent) => {
      const { status, volume } = event.detail || {};

      if (status === 'speaking') {
        setState('speaking');
        setIntensity(Math.min(1, (volume || 0.5) * 2));
        globalState = 'speaking';
        globalIntensity = Math.min(1, (volume || 0.5) * 2);
      } else if (status === 'listening') {
        setState('listening');
        setIntensity(0.3);
        globalState = 'listening';
        globalIntensity = 0.3;
      } else if (status === 'thinking' || status === 'processing') {
        setState('thinking');
        setIntensity(0.5);
        globalState = 'thinking';
        globalIntensity = 0.5;
      } else {
        setState('idle');
        setIntensity(0);
        globalState = 'idle';
        globalIntensity = 0;
      }
    };

    // Listen for ElevenLabs events
    window.addEventListener('elevenlabs-convai:status-change' as any, handleStateChange as EventListener);
    window.addEventListener('elevenlabs-convai:speaking' as any, () => {
      setState('speaking');
      setIntensity(0.8);
      globalState = 'speaking';
      globalIntensity = 0.8;
    });
    window.addEventListener('elevenlabs-convai:listening' as any, () => {
      setState('listening');
      setIntensity(0.3);
      globalState = 'listening';
      globalIntensity = 0.3;
    });

    return () => {
      window.removeEventListener('elevenlabs-convai:status-change' as any, handleStateChange as EventListener);
    };
  }, []);

  return { state, intensity };
}

// Reactive ring that pulses with conversation
function ReactiveRing({ radius, index }: { radius: number; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;

    const time = state.clock.elapsedTime;
    const baseScale = 1 + Math.sin(time * 2 + index) * 0.1;

    // Pulse based on global state
    let pulseScale = 1;
    let opacity = 0.1;

    if (globalState === 'speaking') {
      pulseScale = 1 + Math.sin(time * 8 + index * 0.5) * 0.3 * globalIntensity;
      opacity = 0.3 + globalIntensity * 0.4;
    } else if (globalState === 'listening') {
      pulseScale = 1 + Math.sin(time * 4 + index) * 0.15;
      opacity = 0.2;
    } else if (globalState === 'thinking') {
      pulseScale = 1 + Math.sin(time * 6 + index * 0.3) * 0.2;
      opacity = 0.25;
    }

    meshRef.current.scale.setScalar(baseScale * pulseScale);
    meshRef.current.rotation.z = time * 0.1 * (index % 2 === 0 ? 1 : -1);
    materialRef.current.opacity = opacity;
  });

  // Color based on state
  const getColor = () => {
    switch (globalState) {
      case 'speaking':
        return '#22d3ee'; // cyan
      case 'listening':
        return '#10b981'; // emerald
      case 'thinking':
        return '#8b5cf6'; // violet
      default:
        return '#6b7280'; // gray
    }
  };

  return (
    <mesh ref={meshRef} position={[0, 0, -5 - index * 2]}>
      <ringGeometry args={[radius - 0.05, radius, 64]} />
      <meshBasicMaterial
        ref={materialRef}
        color={getColor()}
        transparent
        opacity={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Floating particles that react to audio
function ReactiveParticles({ count = 100 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const positionsRef = useRef<Float32Array | null>(null);
  const velocitiesRef = useRef<Float32Array | null>(null);

  useFrame((state) => {
    if (!pointsRef.current || !positionsRef.current || !velocitiesRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position;
    const time = state.clock.elapsedTime;

    // Speed multiplier based on state
    const speedMultiplier = globalState === 'speaking' ? 3 : globalState === 'thinking' ? 2 : 1;

    for (let i = 0; i < count; i++) {
      positions.array[i * 3] += velocitiesRef.current[i * 3] * speedMultiplier;
      positions.array[i * 3 + 1] += velocitiesRef.current[i * 3 + 1] * speedMultiplier;
      positions.array[i * 3 + 2] += velocitiesRef.current[i * 3 + 2] * speedMultiplier;

      // Add subtle wave motion when speaking
      if (globalState === 'speaking') {
        positions.array[i * 3] += Math.sin(time * 5 + i) * 0.02 * globalIntensity;
        positions.array[i * 3 + 1] += Math.cos(time * 5 + i) * 0.02 * globalIntensity;
      }
    }

    positions.needsUpdate = true;
  });

  // Initialize positions if not already done
  if (!positionsRef.current) {
    positionsRef.current = new Float32Array(count * 3);
    velocitiesRef.current = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 15 + Math.random() * 20;
      positionsRef.current[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positionsRef.current[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positionsRef.current[i * 3 + 2] = radius * Math.cos(phi) - 10;
      velocitiesRef.current[i * 3] = (Math.random() - 0.5) * 0.02;
      velocitiesRef.current[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocitiesRef.current[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
  }

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positionsRef.current, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#22d3ee"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export function AudioReactive({ baseRadius = 3, particleCount = 150 }: AudioReactiveProps) {
  // Initialize the conversation state hook
  useConversationState();

  return (
    <group>
      {/* Reactive rings at different depths */}
      {[1, 1.5, 2, 2.5, 3].map((multiplier, index) => (
        <ReactiveRing
          key={index}
          radius={baseRadius * multiplier}
          index={index}
        />
      ))}

      {/* Reactive particles */}
      <ReactiveParticles count={particleCount} />
    </group>
  );
}
