'use client';

import dynamic from 'next/dynamic';

const CursorTrail = dynamic(() => import('@/components/CursorTrail'), { ssr: false });
const ScrollProgress = dynamic(() => import('@/components/ScrollProgress'), { ssr: false });
const BackToTop = dynamic(() => import('@/components/BackToTop'), { ssr: false });
const SocialProofTicker = dynamic(() => import('@/components/SocialProofTicker'), { ssr: false });

export default function ClientComponents() {
  return (
    <>
      <ScrollProgress />
      <CursorTrail />
      <BackToTop />
      <SocialProofTicker />
    </>
  );
}
