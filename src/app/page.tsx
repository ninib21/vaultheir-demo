'use client';

import dynamic from 'next/dynamic';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Navigation from '@/components/Navigation';

// Dynamically import components for code splitting and performance
const Background3D = dynamic(() => import('@/components/Background3D'), {
  ssr: false,
  loading: () => null,
});

const Hero = dynamic(() => import('@/components/sections/Hero'), {
  loading: () => <div className="min-h-screen" />,
});

const Features = dynamic(() => import('@/components/sections/Features'));
const Demo = dynamic(() => import('@/components/sections/Demo'));
const Pricing = dynamic(() => import('@/components/sections/Pricing'));
const CTA = dynamic(() => import('@/components/sections/CTA'));
const Footer = dynamic(() => import('@/components/Footer'));

export default function Home() {
  return (
    <ErrorBoundary>
      <main className="relative min-h-screen overflow-hidden">
        <Navigation />
        <Background3D />
        <div className="relative z-10">
          <Hero />
          <Features />
          <Demo />
          <Pricing />
          <CTA />
          <Footer />
        </div>
      </main>
    </ErrorBoundary>
  );
}

