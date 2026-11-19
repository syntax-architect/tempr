import React, { useState } from 'react';
import { Logo } from '../brand/Logo';
import { AppMode, DashboardView } from '../../types';
import {
  ArrowRight,
  Menu,
  X,
  PhoneCall,
  Sparkles,
  Layers,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';

interface TopNavbarProps {
  currentMode: AppMode;
  onToggleMode: (mode: AppMode) => void;
  onNavigateToSection?: (sectionId: string) => void;
  currentDashboardView?: DashboardView;
  onSelectDashboardView?: (view: DashboardView) => void;
  onOpenPitchModal?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentMode,
  onToggleMode,
  onNavigateToSection,
  onOpenPitchModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Live Simulator', href: '#simulator' },
    { label: 'CN Code Scope', href: '#cn-checker' },
    { label: 'Clause 6 Protocol', href: '#clause-6' },
    { label: 'CBAM Calculator', href: '#roi-calculator' },
    { label: 'Pricing', href: '#pricing' },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    onNavigateToSection?.(href.replace('#', ''));
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-slate-900/80 border-b border-slate-700/50 shadow-lg shadow-black/20 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo with Smooth Scroll */}
          <div
            className="flex items-center gap-3 cursor-pointer transition-opacity hover:opacity-90"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <Logo size="md" />
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-xs font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>EU 2026/1963 ACTIVE</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5 bg-slate-800/60 border border-slate-700/60 p-1 rounded-full backdrop-blur-md shadow-inner">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleLinkClick(link.href)}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-700/60 rounded-full transition-all duration-150"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action Hub */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Field Pitch Script Trigger */}
            <button
              onClick={onOpenPitchModal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 hover:border-amber-500/50 transition-all duration-150 shadow-sm"
              title="5 Field Validation Questions for Steel Exporters"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Pitch Kit</span>
            </button>

            {/* Language Selector (Prompt D10) */}
            <LanguageSwitcher className="hidden sm:inline-block" />

            {/* Apple-Style Segmented Mode Switcher */}
            <div className="flex items-center p-0.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs shadow-inner backdrop-blur-md">
              <button
                onClick={() => onToggleMode('marketing')}
                className={`px-3.5 py-1 rounded-full font-medium transition-all duration-150 ${
                  currentMode === 'marketing'
                    ? 'bg-slate-700 text-white shadow-sm font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Marketing
              </button>
              <button
                onClick={() => onToggleMode('dashboard')}
                className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full font-medium transition-all duration-150 ${
                  currentMode === 'dashboard'
                    ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>Factory QA</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </button>
            </div>

            {/* Tactile Primary CTA Pill */}
            <button
              onClick={() => onToggleMode('dashboard')}
              className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-semibold text-xs px-4 py-2 rounded-full transition-all duration-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_0_30px_rgba(16,185,129,0.5)]"
            >
              <span>Launch App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown with Frosted Surface */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-obsidian-950/98 backdrop-blur-2xl px-5 py-5 space-y-2.5 shadow-2xl">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleLinkClick(link.href)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/[0.05] rounded-xl transition-colors"
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-white/[0.07] flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPitchModal?.();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/25 hover:bg-amber-500/15 transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Exporter Field Pitch Script</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onToggleMode('dashboard');
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-obsidian-950 shadow-md transition-all"
            >
              <span>Open Factory QA Workbench</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
