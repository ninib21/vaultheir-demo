'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, MeshDistortMaterial } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

function AnimatedMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <torusKnotGeometry args={[1, 0.3, 64, 16]} />
      <MeshDistortMaterial
        color="#71717a"
        attach="material"
        distort={0.4}
        speed={2}
        roughness={0.1}
        metalness={0.8}
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

function Particles({ count = 600 }: { count?: number }) {
  const particlesRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const buffer = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      buffer[i * 3] = (Math.random() - 0.5) * 18;
      buffer[i * 3 + 1] = (Math.random() - 0.5) * 18;
      buffer[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    return buffer;
  }, [count]);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#a1a1aa" transparent opacity={0.6} />
    </points>
  );
}

const FALLBACK_BG =
  'fixed inset-0 -z-10 h-screen w-screen bg-gradient-to-br from-[#040507] via-[#090c14] to-[#11162b]';

function shouldDefer3D() {
  if (typeof window === 'undefined') {
    return true;
  }
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isSmallViewport = window.matchMedia('(max-width: 768px)').matches;
  const lowPowerDevice =
    typeof navigator !== 'undefined' &&
    typeof navigator.hardwareConcurrency === 'number' &&
    navigator.hardwareConcurrency <= 4;
  return prefersReducedMotion || isSmallViewport || lowPowerDevice;
}

export default function Background3D() {
  const [render3D, setRender3D] = useState(false);

  useEffect(() => {
    if (shouldDefer3D()) {
      return;
    }

    const scheduleIdle = (cb: () => void) => {
      if (typeof window === 'undefined') {
        return () => undefined;
      }
      if ('requestIdleCallback' in window) {
        const handle = (window as any).requestIdleCallback(cb, { timeout: 1200 });
        return () => (window as any).cancelIdleCallback(handle);
      }
      const timeout = window.setTimeout(cb, 200);
      return () => window.clearTimeout(timeout);
    };

    const cancel = scheduleIdle(() => setRender3D(true));
    return cancel;
  }, []);

  if (!render3D) {
    return <div aria-hidden="true" className={`${FALLBACK_BG} blur-[1px]`} />;
  }

  return (
    <div className="fixed inset-0 -z-10 h-screen w-screen">
      <Canvas gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }} dpr={[1, 1.5]}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={70} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.4}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.6}
        />
        <ambientLight intensity={0.45} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#71717a" />
        <pointLight position={[-10, -10, -10]} intensity={0.4} color="#a1a1aa" />
        <Stars radius={90} depth={45} count={2000} factor={3} fade speed={0.6} />
        <AnimatedMesh />
        <Particles count={600} />
      </Canvas>
    </div>
  );
}

