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

const Stats = dynamic(() => import('@/components/sections/Stats'));
const Features = dynamic(() => import('@/components/sections/Features'));
const Demo = dynamic(() => import('@/components/sections/Demo'));
const Pricing = dynamic(() => import('@/components/sections/Pricing'));
const Testimonials = dynamic(() => import('@/components/sections/Testimonials'));
const CTA = dynamic(() => import('@/components/sections/CTA'));

export default function Home() {
  return (
    <ErrorBoundary>
      <main className="relative min-h-screen overflow-hidden">
        <Navigation />
        <Background3D />
        <div className="relative z-10">
          <Hero />
          <Stats />
          <Features />
          <Demo />
          <Pricing />
          <Testimonials />
          <CTA />
        </div>
      </main>
    </ErrorBoundary>
  );
}

