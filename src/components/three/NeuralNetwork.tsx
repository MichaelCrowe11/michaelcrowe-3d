'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface NodeData {
  position: THREE.Vector3;
  connections: number[];
}

export function NeuralNetwork() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  // Generate nodes and connections once
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

  // Set up InstancedMesh positions and colors
  useEffect(() => {
    if (!meshRef.current) return;

    const tempObject = new THREE.Object3D();
    const color = new THREE.Color();
    const palette = ['#22d3ee', '#34d399', '#a78bfa']; // Cyan, Emerald, Violet

    nodes.forEach((node, i) => {
      tempObject.position.copy(node.position);
      tempObject.updateMatrix();
      
      meshRef.current?.setMatrixAt(i, tempObject.matrix);
      
      // Assign color cyclically
      color.set(palette[i % 3]);
      meshRef.current?.setColorAt(i, color);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, [nodes]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05; // Slower rotation
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Optimized: Single InstancedMesh for all nodes */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, nodes.length]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial transparent opacity={0.6} toneMapped={false} />
      </instancedMesh>

      {/* Connection lines */}
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial color="#22d3ee" transparent opacity={0.15} linewidth={1} />
      </lineSegments>
    </group>
  );
}
