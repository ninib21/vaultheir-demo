'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, MeshDistortMaterial } from '@react-three/drei';
import { useRef } from 'react';
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
      <torusKnotGeometry args={[1, 0.3, 128, 32]} />
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

function Particles() {
  const particlesRef = useRef<THREE.Points>(null);
  const particles = useRef<Float32Array | null>(null);

  if (!particles.current) {
    particles.current = new Float32Array(1000 * 3);
    for (let i = 0; i < 1000; i++) {
      particles.current[i * 3] = (Math.random() - 0.5) * 20;
      particles.current[i * 3 + 1] = (Math.random() - 0.5) * 20;
      particles.current[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
  }

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
          count={1000}
          array={particles.current}
          itemSize={3}
          args={[particles.current, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#a1a1aa" transparent opacity={0.6} />
    </points>
  );
}

export default function Background3D() {
  return (
    <div className="fixed inset-0 -z-10 h-screen w-screen">
      <Canvas
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#71717a" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a1a1aa" />
        <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />
        <AnimatedMesh />
        <Particles />
      </Canvas>
    </div>
  );
}

