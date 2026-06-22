'use client';

/* BioComputeField
 *
 * The thesis as ambient geometry: a living node network that is organic and
 * gold on the left (real-world biology) and resolves into a structured cyan
 * lattice on the right (computation). Slow drift, subtle pointer parallax,
 * additive glow. Sits behind the home content as the hero visual. */

import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const GOLD = new THREE.Color('#e7c984');
const CYAN = new THREE.Color('#3fd0d0');

function Field() {
  const group = useRef<THREE.Group>(null);
  const points = useRef<THREE.Points>(null);

  const { nodePositions, nodeColors, linePositions, lineColors, base } = useMemo(() => {
    const COUNT = 130;
    const W = 14; // x span
    const H = 8; // y span
    const D = 5; // z span
    const nodes: { p: THREE.Vector3; t: number }[] = [];

    for (let i = 0; i < COUNT; i++) {
      const t = i / (COUNT - 1); // 0 = biology, 1 = computation
      const x = -W / 2 + t * W;
      // left side spreads organically; right side snaps toward a lattice
      const jitter = (1 - t) * 1.0 + 0.12;
      const gx = Math.round((x) / 1.6) * 1.6; // lattice grid on x
      const px = THREE.MathUtils.lerp(x + (Math.random() - 0.5) * 2.2, gx, t * t);
      const ySlot = Math.round((Math.random() - 0.5) * H / 1.4) * 1.4;
      const py = THREE.MathUtils.lerp((Math.random() - 0.5) * H, ySlot, t * t) + (Math.random() - 0.5) * jitter;
      const pz = THREE.MathUtils.lerp((Math.random() - 0.5) * D, Math.round((Math.random() - 0.5) * D / 1.4) * 1.4, t * t);
      nodes.push({ p: new THREE.Vector3(px, py, pz), t });
    }

    const nodePositions = new Float32Array(COUNT * 3);
    const nodeColors = new Float32Array(COUNT * 3);
    const c = new THREE.Color();
    nodes.forEach((n, i) => {
      nodePositions[i * 3] = n.p.x;
      nodePositions[i * 3 + 1] = n.p.y;
      nodePositions[i * 3 + 2] = n.p.z;
      c.copy(GOLD).lerp(CYAN, n.t);
      nodeColors[i * 3] = c.r;
      nodeColors[i * 3 + 1] = c.g;
      nodeColors[i * 3 + 2] = c.b;
    });

    // connect nearby nodes (mycelial threads on the left, edges on the right)
    const lp: number[] = [];
    const lc: number[] = [];
    const maxDist = 2.6;
    const c2 = new THREE.Color();
    for (let i = 0; i < COUNT; i++) {
      let links = 0;
      for (let j = i + 1; j < COUNT && links < 3; j++) {
        const d = nodes[i].p.distanceTo(nodes[j].p);
        if (d < maxDist) {
          links++;
          lp.push(nodes[i].p.x, nodes[i].p.y, nodes[i].p.z, nodes[j].p.x, nodes[j].p.y, nodes[j].p.z);
          c2.copy(GOLD).lerp(CYAN, nodes[i].t);
          lc.push(c2.r, c2.g, c2.b);
          c2.copy(GOLD).lerp(CYAN, nodes[j].t);
          lc.push(c2.r, c2.g, c2.b);
        }
      }
    }

    return {
      nodePositions,
      nodeColors,
      linePositions: new Float32Array(lp),
      lineColors: new Float32Array(lc),
      base: nodePositions.slice(),
    };
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = Math.sin(t * 0.06) * 0.18;
    group.current.rotation.x = Math.cos(t * 0.05) * 0.06;
    // gentle pointer parallax
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, state.pointer.x * 0.6, 0.04);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, state.pointer.y * 0.4, 0.04);
    // subtle breathing on the nodes
    if (points.current) {
      const g = points.current.geometry as THREE.BufferGeometry;
      const pos = g.attributes.position.array as Float32Array;
      for (let i = 0; i < pos.length; i += 3) {
        pos[i + 1] = base[i + 1] + Math.sin(t * 0.7 + base[i]) * 0.06;
      }
      g.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={group}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[lineColors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent opacity={0.22} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>

      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[nodeColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          size={0.12}
          sizeAttenuation
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

export function BioComputeField() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', stencil: false, depth: true }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 9.5], fov: 58 }}
      >
        <ambientLight intensity={0.4} />
        <Field />
        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom intensity={1.1} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
          <Vignette offset={0.32} darkness={0.72} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
