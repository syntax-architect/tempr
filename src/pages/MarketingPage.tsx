import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNavbar } from '../components/navigation/TopNavbar';
import { HeroSection } from '../components/marketing/HeroSection';
import { WhyNowSection } from '../components/marketing/WhyNowSection';
import { ProblemSection } from '../components/marketing/ProblemSection';
import { HowItWorksSection } from '../components/marketing/HowItWorksSection';
import { MtcSimulator } from '../components/marketing/MtcSimulator';
import { CnScopeChecker } from '../components/marketing/CnScopeChecker';
import { Clause6Diagram } from '../components/marketing/Clause6Diagram';
import { ReadinessGateShowcase } from '../components/marketing/ReadinessGateShowcase';
import { RoiCalculator } from '../components/marketing/RoiCalculator';
import { PricingSection } from '../components/marketing/PricingSection';
import { FaqSection } from '../components/marketing/FaqSection';
import { MarketingFooter } from '../components/marketing/MarketingFooter';
import { ExporterPitchModal } from '../components/dashboard/modals/ExporterPitchModal';
import { LenisScroller } from '../components/effects/LenisScroller';
import { MobileStickyCta } from '../components/marketing/MobileStickyCta';
import { LeadBookingModal } from '../components/marketing/LeadBookingModal';

export const MarketingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isPitchModalOpen, setIsPitchModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLaunchApp = (view: string = 'command-center') => {
    navigate(`/app?view=${view}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenWorkbenchPreset = (presetId?: string) => {
    navigate(`/app?view=mtc-workbench${presetId ? `&preset=${presetId}` : ''}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1120] text-slate-100 selection:bg-emerald-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* Dynamic Ambient Lighting Orbs (hidden on mobile to prevent 700px+ GPU canvas lag) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="hidden sm:block absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-emerald-500/15 rounded-full blur-[140px] animate-pulse-slow" />
        <div className="hidden sm:block absolute top-[35%] -left-48 w-[650px] h-[550px] bg-amber-500/10 rounded-full blur-[160px] animate-float-slow" />
        <div className="hidden sm:block absolute top-[65%] -right-48 w-[700px] h-[600px] bg-blue-600/12 rounded-full blur-[160px] animate-float-reverse" />
        <div className="hidden sm:block absolute -bottom-40 left-1/3 w-[600px] h-[450px] bg-teal-500/10 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-tech-grid opacity-25" />
      </div>

      {/* Lenis Smooth Momentum Scroll Engine */}
      <LenisScroller />

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Sticky Top Navigation Bar */}
        <TopNavbar
          currentMode="marketing"
          onToggleMode={() => handleLaunchApp('command-center')}
          onNavigateToSection={scrollToSection}
          currentDashboardView="command-center"
          onSelectDashboardView={(view) => handleLaunchApp(view)}
          onOpenPitchModal={() => setIsPitchModalOpen(true)}
        />

        <main id="main-content" className="flex-1">
          {/* Hero Section */}
          <HeroSection
            onLaunchApp={() => handleLaunchApp('command-center')}
            onExplorePresets={() => scrollToSection('simulator')}
          />

          {/* Sourced, Dated Statutory Facts & Sanctions Timeline */}
          <WhyNowSection />

          {/* The Problem: Spreadsheets, Re-typing & Impoundment Risk */}
          <ProblemSection />

          {/* 3-Step Compliance Pipeline */}
          <HowItWorksSection />

          {/* Live MTC & CBAM Interactive Simulator (Sample files only) */}
          <MtcSimulator onOpenWorkbench={handleOpenWorkbenchPreset} />

          {/* CN Code Scope & Verification Advisory */}
          <CnScopeChecker />

          {/* EN 10204 Clause 6 Byte-Identical Protocol */}
          <Clause6Diagram />

          {/* Shipment Readiness Score & Release Gate Showcase */}
          <ReadinessGateShowcase />

          {/* Interactive ROI & CBAM Savings Calculator (Formula displayed, labeled Estimate) */}
          <RoiCalculator onSelectPlan={() => handleLaunchApp('command-center')} />

          {/* SaaS Pricing: 3 Tiers + Consultant, SAC 998313, 18% GST */}
          <PricingSection
            onSelectPlan={() => handleLaunchApp('command-center')}
            onOpenBookingModal={() => setIsBookingModalOpen(true)}
          />

          {/* Statutory & Technical FAQ with Schema.org JSON-LD */}
          <FaqSection />
        </main>

        {/* Global Footer */}
        <MarketingFooter />

        {/* Mobile Sticky CTA Bar (< md) */}
        <MobileStickyCta onOpenBooking={() => setIsBookingModalOpen(true)} />

        {/* Lead Booking Modal (Offline-friendly with retry, rate limited, honeypot) */}
        <LeadBookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
        />

        {/* Exporter Pitch Deck Modal */}
        <ExporterPitchModal
          isOpen={isPitchModalOpen}
          onClose={() => setIsPitchModalOpen(false)}
          onJumpToSimulator={() => {
            setTimeout(() => scrollToSection('simulator'), 100);
          }}
        />
      </div>
    </div>
  );
};

export default MarketingPage;
