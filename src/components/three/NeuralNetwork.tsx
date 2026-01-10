'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface NodeData {
  position: THREE.Vector3;
  connections: number[];
}

export function NeuralNetwork() {
  const groupRef = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const { nodes, lineGeometry } = useMemo(() => {
    const nodeCount = 60;
    const nodes: NodeData[] = [];
    const positions: number[] = [];

    // Create nodes in a spherical distribution
    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      const radius = 3 + Math.random() * 1.5;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      nodes.push({
        position: new THREE.Vector3(x, y, z),
        connections: []
      });
    }

    // Create connections between nearby nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = nodes[i].position.distanceTo(nodes[j].position);
        if (dist < 2.5 && Math.random() > 0.5) {
          nodes[i].connections.push(j);
          positions.push(
            nodes[i].position.x, nodes[i].position.y, nodes[i].position.z,
            nodes[j].position.x, nodes[j].position.y, nodes[j].position.z
          );
        }
      }
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    return { nodes, lineGeometry };
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Neural network nodes */}
      {nodes.map((node, i) => (
        <mesh key={i} position={node.position}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? '#22d3ee' : i % 3 === 1 ? '#10b981' : '#8b5cf6'}
            emissive={i % 3 === 0 ? '#22d3ee' : i % 3 === 1 ? '#10b981' : '#8b5cf6'}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}

      {/* Connection lines */}
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial color="#22d3ee" transparent opacity={0.3} />
      </lineSegments>
    </group>
  );
}
