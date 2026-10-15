'use client';

import React from 'react';
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';
import { TemplatesSection } from './TemplatesSection';
import { PricingSection } from './PricingSection';
import { FaqSection } from './FaqSection';
import { Footer } from './Footer';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#2D3B36] selection:bg-[#C5A880]/30 selection:text-[#2D3B36]">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <TemplatesSection />
        <PricingSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}

export * from './Navbar';
export * from './HeroSection';
export * from './FeaturesSection';
export * from './TemplatesSection';
export * from './PricingSection';
export * from './FaqSection';
export * from './Footer';
