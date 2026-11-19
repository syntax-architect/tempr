import React, { useState } from 'react';
import {
  ShieldCheck,
  ArrowRight,
  FileCheck2,
  Scale,
  Zap,
  Globe2,
  FileCheck,
  CheckCircle2,
  Sparkles,
  Lock,
  Flame,
  TrendingDown,
  Layers,
  Cpu,
  FileText,
  Check,
  ChevronRight,
  RefreshCw,
  SlidersHorizontal,
  BarChart3,
  QrCode,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MobileHeroMockup } from './MobileHeroMockup';

interface HeroSectionProps {
  onLaunchApp: () => void;
  onExplorePresets: () => void;
}

interface HeatSample {
  id: string;
  millName: string;
  certNumber: string;
  heatNumber: string;
  standard: string;
  cev: number;
  country: string;
  chemistry: { [elem: string]: { val: number; spec: string } };
  actualSee: number;
  defaultSee: number;
  savingsEur: number;
  dossierHash: string;
  hmacSig: string;
}

const SAMPLE_HEATS: HeatSample[] = [
  {
    id: 'tata',
    millName: 'Tata Steel Jamshedpur',
    certNumber: 'MTC-IN-TSJ-26-9021',
    heatNumber: 'TSJ-26-9021',
    standard: 'ASTM A106 Gr. B / A105',
    cev: 0.408,
    country: 'India [IN] (BOF/CC)',
    chemistry: {
      C: { val: 0.22, spec: '≤ 0.35%' },
      Mn: { val: 0.88, spec: '0.60–1.05%' },
      Si: { val: 0.25, spec: '0.10–0.35%' },
      P: { val: 0.015, spec: '≤ 0.035%' },
      S: { val: 0.01, spec: '≤ 0.040%' },
      Cr: { val: 0.12, spec: '≤ 0.30%' },
      Ni: { val: 0.08, spec: '≤ 0.40%' },
      Mo: { val: 0.02, spec: '≤ 0.12%' },
    },
    actualSee: 2.05,
    defaultSee: 3.28,
    savingsEur: 4500,
    dossierHash: '878a3b7525344442f7da79...',
    hmacSig: 'hl_sig_v1_17af54387e55...',
  },
  {
    id: 'sail',
    millName: 'SAIL Bokaro Steel Plant',
    certNumber: 'MTC-IN-SAIL-4028',
    heatNumber: 'SAIL-BO-8812',
    standard: 'IS 2062 E250 / ASTM A36',
    cev: 0.384,
    country: 'India [IN] (BF-BOF)',
    chemistry: {
      C: { val: 0.18, spec: '≤ 0.22%' },
      Mn: { val: 0.95, spec: '0.80–1.20%' },
      Si: { val: 0.22, spec: '0.10–0.35%' },
      P: { val: 0.018, spec: '≤ 0.030%' },
      S: { val: 0.012, spec: '≤ 0.030%' },
      Cr: { val: 0.08, spec: '≤ 0.25%' },
      Ni: { val: 0.05, spec: '≤ 0.20%' },
      Mo: { val: 0.01, spec: '≤ 0.08%' },
    },
    actualSee: 2.12,
    defaultSee: 3.28,
    savingsEur: 4320,
    dossierHash: '4f9c1b993e110294da11...',
    hmacSig: 'hl_sig_v1_8e4b7029cb01...',
  },
  {
    id: 'jsw',
    millName: 'JSW Steel Vijayanagar',
    certNumber: 'MTC-IN-JSW-9104',
    heatNumber: 'JSW-VY-4409',
    standard: 'ASTM A105 Piping Flanges',
    cev: 0.412,
    country: 'India [IN] (Corex/BOF)',
    chemistry: {
      C: { val: 0.24, spec: '≤ 0.35%' },
      Mn: { val: 0.82, spec: '0.60–1.05%' },
      Si: { val: 0.28, spec: '0.10–0.35%' },
      P: { val: 0.014, spec: '≤ 0.035%' },
      S: { val: 0.009, spec: '≤ 0.040%' },
      Cr: { val: 0.14, spec: '≤ 0.30%' },
      Ni: { val: 0.09, spec: '≤ 0.40%' },
      Mo: { val: 0.03, spec: '≤ 0.12%' },
    },
    actualSee: 1.98,
    defaultSee: 3.28,
    savingsEur: 4850,
    dossierHash: 'dec6e348b6a92338721b...',
    hmacSig: 'hl_sig_v1_c491e08aa321...',
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onLaunchApp, onExplorePresets }) => {
  const [activeTab, setActiveTab] = useState<'ocr' | 'emissions' | 'dossier'>('ocr');
  const [selectedHeatId, setSelectedHeatId] = useState<string>('tata');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const currentHeat = SAMPLE_HEATS.find((h) => h.id === selectedHeatId) || SAMPLE_HEATS[0];

  const handleSimulateScan = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 600);
  };

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-slate-900 via-slate-900/95 to-[#0B1120] border-b border-slate-700/60 overflow-hidden">
      {/* Precision Technical Engineering Grid & Vibrant Ambient Glows */}
      <div className="absolute inset-0 bg-tech-grid-bright opacity-25 pointer-events-none" />

      {/* Left/Top Radiant Emerald/Cyan Aura (hidden on small mobile screens to prevent GPU lag) */}
      <div className="hidden sm:block absolute -top-16 left-10 w-[750px] h-[480px] bg-gradient-to-r from-emerald-500/20 via-teal-400/15 to-cyan-500/20 rounded-full blur-[140px] pointer-events-none animate-pulse-slow" />

      {/* Right Molten Amber Forge Glow */}
      <div className="hidden sm:block absolute top-1/4 -right-20 w-[600px] h-[500px] bg-amber-500/15 rounded-full blur-[150px] pointer-events-none animate-float-slow" />

      {/* Deep Cobalt Grid Glow */}
      <div className="hidden sm:block absolute bottom-10 left-1/3 w-[650px] h-[400px] bg-blue-600/12 rounded-full blur-[160px] pointer-events-none animate-float-reverse" />

      {/* Subtle Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-slate-900/40 to-[#0B1120] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 my-auto w-full">
        {/* 2-COLUMN HERO MAIN SPLIT: Left Text & CTAs / Right Live Interactive Terminal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-center">
          {/* LEFT COLUMN: Regulatory Scope, Punchy Left-Aligned Copy & CTAs */}
          <div className="lg:col-span-7 xl:col-span-6 flex flex-col items-start text-left">
            {/* Animated Regulatory Scope Pill */}
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-850/90 border border-emerald-400/35 text-emerald-300 text-xs font-mono mb-6 shadow-[0_0_20px_rgba(16,185,129,0.2)] backdrop-blur-xl cursor-default"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="tracking-wide font-medium">
                EU Regulation 2026/1963 &amp; CBAM Definitive Regime
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-bold">
                2026 AUDIT-READY
              </span>
            </motion.div>

            {/* Clear, Authoritative Headline with Silk Gradient & Left-Aligned Layout */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-5xl lg:text-[2.9rem] xl:text-[3.4rem] font-extrabold text-white tracking-[-0.035em] leading-[1.1] drop-shadow-sm"
            >
              From Raw Steel Mill Certificate to{' '}
              <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(16,185,129,0.35)]">
                EU &amp; UK Customs Clearance
              </span>{' '}
              in 30 Seconds.
            </motion.h1>

            {/* High-Contrast Technical Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 text-base sm:text-lg text-slate-200 font-normal leading-relaxed max-w-xl"
            >
              Reduce exposure to{' '}
              <strong className="text-white font-semibold underline decoration-emerald-400/60 underline-offset-4">
                statutory CBAM default markups
              </strong>
              . Prepares data for your authorised inspector and CBAM verifier with verified
              Melt-and-Pour origin declarations and draft CBAM data sheets.
            </motion.p>

            {/* Primary & Secondary Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto"
            >
              <button
                onClick={onLaunchApp}
                className="inline-flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-bold text-sm px-7 py-3.5 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.4),inset_0_1px_0_rgba(255,255,255,0.4)] hover:shadow-[0_0_45px_rgba(16,185,129,0.6)] transition-all duration-200 group"
              >
                <Zap className="w-4 h-4 fill-current group-hover:rotate-12 transition-transform" />
                <span>Launch Factory QA Workbench</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExplorePresets}
                className="hidden sm:inline-flex items-center justify-center gap-2.5 bg-slate-800/80 hover:bg-slate-750 text-slate-100 hover:text-white font-semibold text-sm px-6 py-3.5 rounded-full border border-slate-700/80 hover:border-slate-500 backdrop-blur-xl shadow-lg active:scale-[0.98] transition-all duration-200"
              >
                <FileCheck2 className="w-4 h-4 text-amber-400" />
                <span>Test Sample Shipment Free</span>
              </button>
            </motion.div>

            {/* Trust Metrics & Proof Micro-Strip */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 pt-6 border-t border-slate-800/80 w-full"
            >
              <div className="grid grid-cols-3 gap-3 text-left">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono tracking-tight">
                    €4,500
                  </div>
                  <div className="text-xs text-slate-400 font-medium leading-tight mt-0.5">
                    Avg Tax Saved / 25t Container
                  </div>
                </div>
                <div className="border-l border-slate-800 pl-3">
                  <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono tracking-tight">
                    30 Sec
                  </div>
                  <div className="text-xs text-slate-400 font-medium leading-tight mt-0.5">
                    MTC to Clause 6 XML Bundle
                  </div>
                </div>
                <div className="border-l border-slate-800 pl-3">
                  <div className="text-xl sm:text-2xl font-black text-cyan-300 font-mono tracking-tight">
                    0 Phantom
                  </div>
                  <div className="text-xs text-slate-400 font-medium leading-tight mt-0.5">
                    PostgreSQL Ledger Protected
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Melt-and-Pour attestation certified for Tata Steel, SAIL, and JSW heats</span>
              </div>
            </motion.div>
          </div>

          {/* Mobile Lightweight Mockup (< lg) */}
          <div className="block lg:hidden w-full mt-2">
            <MobileHeroMockup />
          </div>

          {/* RIGHT COLUMN: Interactive Live Verification Terminal & Telemetry Engine (>= lg) */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-6 relative mt-4 lg:mt-0">
            {/* Radiant Decorative Glows Behind Terminal */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500/25 via-cyan-500/20 to-amber-500/25 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 -z-10" />

            {/* Floating Trust Accent Badge (Top-Right) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="hidden sm:flex absolute -top-4 -right-4 z-20 items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/95 border border-emerald-500/40 shadow-xl backdrop-blur-xl text-xs font-mono font-bold text-emerald-300"
            >
              <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
              <span>SAVE €{currentHeat.savingsEur.toLocaleString()} / CONTAINER</span>
            </motion.div>

            {/* Floating Trust Accent Badge (Bottom-Left) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="hidden sm:flex absolute -bottom-4 -left-4 z-20 items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/95 border border-cyan-500/40 shadow-xl backdrop-blur-xl text-xs font-mono font-bold text-cyan-300"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>EU REG 2026/1963 CLAUSE 6</span>
            </motion.div>

            {/* The Main High-End Interactive Terminal Window */}
            <div className="rounded-2xl bg-slate-925/95 border border-slate-700/80 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl overflow-hidden relative">
              {/* Terminal Title Bar */}
              <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 mr-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                    <span>HEATLEDGER // VERIFICATION ENGINE</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                  </span>
                  <span className="text-xs font-mono text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded font-semibold">
                    STATUS 200 · LIVE
                  </span>
                </div>
              </div>

              {/* Sample Mill Heat Switcher Strip */}
              <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-xs font-mono text-slate-400 font-medium">
                  Select Mill Heat:
                </span>
                <div className="flex items-center gap-1">
                  {SAMPLE_HEATS.map((heat) => (
                    <button
                      key={heat.id}
                      onClick={() => {
                        setSelectedHeatId(heat.id);
                        handleSimulateScan();
                      }}
                      className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all ${
                        selectedHeatId === heat.id
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                      }`}
                    >
                      {heat.id === 'tata'
                        ? 'Tata Steel'
                        : heat.id === 'sail'
                          ? 'SAIL Bokaro'
                          : 'JSW Steel'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Stage Tab Bar */}
              <div className="px-4 pt-3 pb-0 bg-slate-900/50 border-b border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('ocr')}
                  className={`flex items-center gap-1.5 pb-2.5 px-2 text-xs font-mono font-medium border-b-2 transition-all ${
                    activeTab === 'ocr'
                      ? 'border-emerald-400 text-emerald-300 font-bold'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>1. MTC OCR &amp; Chemistry</span>
                </button>

                <button
                  onClick={() => setActiveTab('emissions')}
                  className={`flex items-center gap-1.5 pb-2.5 px-2 text-xs font-mono font-medium border-b-2 transition-all ${
                    activeTab === 'emissions'
                      ? 'border-emerald-400 text-emerald-300 font-bold'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>2. CBAM Savings</span>
                </button>

                <button
                  onClick={() => setActiveTab('dossier')}
                  className={`flex items-center gap-1.5 pb-2.5 px-2 text-xs font-mono font-medium border-b-2 transition-all ${
                    activeTab === 'dossier'
                      ? 'border-emerald-400 text-emerald-300 font-bold'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>3. Clause 6 Dossier</span>
                </button>
              </div>

              {/* Interactive Stage Body Content */}
              <div className="p-4 sm:p-5 relative min-h-[310px] flex flex-col justify-between">
                {/* Simulated Radar Scanner Line on State Switch */}
                {isSimulating && (
                  <motion.div
                    initial={{ top: 0, opacity: 0.9 }}
                    animate={{ top: '100%', opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'linear' }}
                    className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10B981] z-30 pointer-events-none"
                  />
                )}

                <AnimatePresence mode="wait">
                  {/* TAB 1: MTC OCR, Heat Extraction & Metallurgy */}
                  {activeTab === 'ocr' && (
                    <motion.div
                      key={`ocr-${currentHeat.id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-3.5"
                    >
                      {/* Document Meta Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs font-mono">
                        <div>
                          <div className="text-xs text-slate-400 font-medium">
                            VERIFIED MILL &amp; SPECIFICATION
                          </div>
                          <div className="text-white font-bold">{currentHeat.millName}</div>
                          <div className="text-cyan-300 text-xs">{currentHeat.standard}</div>
                        </div>
                        <div className="sm:text-right">
                          <div className="text-xs text-slate-400 font-medium">HEAT IDENTIFIER</div>
                          <div className="text-amber-400 font-bold font-mono">
                            #{currentHeat.heatNumber}
                          </div>
                          <div className="text-emerald-400 text-xs flex items-center sm:justify-end gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>Melt &amp; Pour: {currentHeat.country}</span>
                          </div>
                        </div>
                      </div>

                      {/* Chemical Composition Spectrum Grid */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5 text-xs font-mono text-slate-400">
                          <span>Spectrometric Chemistry Verification:</span>
                          <span className="text-emerald-400 font-semibold flex items-center gap-1">
                            <Check className="w-3 h-3" /> 8/8 Elements In-Spec
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5 text-xs font-mono">
                          {Object.entries(currentHeat.chemistry)
                            .slice(0, 8)
                            .map(([elem, data]) => (
                              <div
                                key={elem}
                                className="p-2 rounded bg-slate-900/90 border border-slate-800 flex flex-col justify-between"
                              >
                                <div className="flex items-center justify-between text-xs text-slate-400">
                                  <span className="font-bold text-slate-200">{elem}</span>
                                  <span className="text-xs text-emerald-400">PASS</span>
                                </div>
                                <div className="text-sm font-bold text-emerald-300 mt-0.5">
                                  {data.val}%
                                </div>
                                <div className="text-xs text-slate-500 truncate">{data.spec}</div>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* IIW Carbon Equivalent Formula Telemetry */}
                      <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-emerald-400" />
                          <div>
                            <span className="text-slate-300">IIW Carbon Equivalent (CEV): </span>
                            <span className="font-bold text-emerald-300">
                              {currentHeat.cev.toFixed(3)}
                            </span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200 text-xs font-bold">
                          100% WELDABLE (PASS ≤0.48)
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 2: CBAM Emissions Delta vs Statutory EU Default Markup */}
                  {activeTab === 'emissions' && (
                    <motion.div
                      key={`emissions-${currentHeat.id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-4"
                    >
                      {/* Big Net Cost Difference Highlight Card */}
                      <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 via-slate-900/80 to-teal-950/60 border border-emerald-500/40 text-center relative overflow-hidden">
                        <div className="text-xs font-mono uppercase text-emerald-300 tracking-wider font-semibold mb-1">
                          Estimated Cost Difference vs EU Default (Estimate for planning)
                        </div>
                        <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight drop-shadow-md">
                          €{currentHeat.savingsEur.toLocaleString()}
                          <span className="text-sm font-normal text-slate-300 ml-1.5 font-sans">
                            / 25t Container
                          </span>
                        </div>
                        <div className="text-xs text-emerald-300/90 font-mono mt-1">
                          Actual Verified: {currentHeat.actualSee} tCO₂e/t vs EU Statutory Baseline:{' '}
                          {currentHeat.defaultSee} tCO₂e/t
                        </div>
                      </div>

                      {/* Visual Bar Comparison */}
                      <div className="space-y-2.5 text-xs font-mono">
                        <div>
                          <div className="flex justify-between text-slate-400 mb-1">
                            <span className="flex items-center gap-1.5 text-rose-300">
                              <span className="w-2 h-2 rounded-full bg-rose-400 inline-block" />
                              EU Default Baseline (+10% markup, 2026):
                            </span>
                            <span className="text-rose-400 font-bold">
                              {currentHeat.defaultSee} tCO₂e/t
                            </span>
                          </div>
                          <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                            <div
                              className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full"
                              style={{ width: '100%' }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-slate-400 mb-1">
                            <span className="flex items-center gap-1.5 text-emerald-300">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                              HeatLedger Verified Actual (Annex III):
                            </span>
                            <span className="text-emerald-400 font-bold">
                              {currentHeat.actualSee} tCO₂e/t
                            </span>
                          </div>
                          <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                              style={{
                                width: `${(currentHeat.actualSee / currentHeat.defaultSee) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
                        <span>Precursor (BOF): 1.78 t · Factory Fuel: 0.07 t · Grid: 0.20 t</span>
                        <span className="text-emerald-400 font-bold">SAVINGS: 37.5%</span>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 3: Clause 6 Customs Dossier & XML Tamper-Lock */}
                  {activeTab === 'dossier' && (
                    <motion.div
                      key={`dossier-${currentHeat.id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-3"
                    >
                      {/* Document File Representation */}
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                              <FileCheck2 className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-mono font-bold text-white">
                                Dossier_EXP-2026-109_Clause6.pdf
                              </div>
                              <div className="text-xs text-slate-400 font-mono">
                                2 Pages · Merged Cryptographic Bundle
                              </div>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
                            EN 10204 3.1
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1 border-t border-slate-800/80">
                          <div className="p-2 rounded bg-slate-900 border border-slate-800">
                            <span className="text-slate-400 block text-xs">PAGE 1</span>
                            <span className="text-amber-400 font-semibold">
                              Exporter Cover Certificate
                            </span>
                          </div>
                          <div className="p-2 rounded bg-slate-900 border border-slate-800">
                            <span className="text-slate-400 block text-xs">PAGE 2 (ANNEX A)</span>
                            <span className="text-emerald-300 font-semibold">
                              Unaltered Upstream Mill MTC
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Cryptographic Signature Lock */}
                      <div className="p-2.5 rounded-lg bg-slate-900/90 border border-emerald-500/30 space-y-1 font-mono text-xs">
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                            <Lock className="w-3.5 h-3.5" />
                            HMAC-SHA256 SIGNATURE APPLIED:
                          </span>
                          <span className="text-slate-400">KEY: QA_HEAD</span>
                        </div>
                        <div className="text-emerald-300/90 truncate bg-slate-950 p-1.5 rounded border border-slate-800">
                          {currentHeat.hmacSig}
                        </div>
                        <div className="flex items-center justify-between text-slate-400 pt-1">
                          <span>SHA-256 Checksum:</span>
                          <span className="text-slate-300">{currentHeat.dossierHash}</span>
                        </div>
                      </div>

                      {/* Official EU Communication XML Tag */}
                      <div className="p-2 rounded bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between text-xs font-mono text-cyan-200">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                          CBAM_Communication_EXP-2026-109.xml
                        </span>
                        <span className="font-bold text-cyan-300">
                          PORT HAMBURG / ROTTERDAM READY
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Footer Live Telemetry Indicator & Action */}
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>PostgreSQL RLS Protected</span>
                  </div>

                  <button
                    onClick={onLaunchApp}
                    className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold group"
                  >
                    <span>Open in QA Workbench</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-METRIC ARCHITECTURAL PROOF STRIP (Across Full Width Below Split) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 pt-10 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left"
        >
          <div className="p-5 rounded-2xl bg-slate-850/80 hover:bg-slate-800 border border-slate-700/70 hover:border-emerald-400/50 shadow-md hover:shadow-glow-emerald transition-all duration-300 space-y-2 backdrop-blur-xl group">
            <div className="flex items-center gap-2.5 text-xs font-mono font-medium text-emerald-400">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" />
              </div>
              <span className="uppercase tracking-wider font-bold">Untouched Annex</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed group-hover:text-white transition-colors">
              Untouched upstream mill PDF preserved as byte-identical Annex A per EN 10204 Clause 6.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-850/80 hover:bg-slate-800 border border-slate-700/70 hover:border-amber-400/50 shadow-md hover:shadow-glow-amber transition-all duration-300 space-y-2 backdrop-blur-xl group">
            <div className="flex items-center gap-2.5 text-xs font-mono font-medium text-amber-400">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Scale className="w-4.5 h-4.5 text-amber-400" />
              </div>
              <span className="uppercase tracking-wider font-bold">Mass Balance</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed group-hover:text-white transition-colors">
              Ledger prevents phantom heat re-allocation audits across multiple export shipments.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-850/80 hover:bg-slate-800 border border-slate-700/70 hover:border-blue-400/50 shadow-md hover:shadow-glow-blue transition-all duration-300 space-y-2 backdrop-blur-xl group">
            <div className="flex items-center gap-2.5 text-xs font-mono font-medium text-blue-400">
              <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Globe2 className="w-4.5 h-4.5 text-blue-400" />
              </div>
              <span className="uppercase tracking-wider font-bold">Melt &amp; Pour Law</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed group-hover:text-white transition-colors">
              ISO 3166 Melt &amp; Pour country of origin attestation mandated by EU Reg 2026/1963.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-850/80 hover:bg-slate-800 border border-slate-700/70 hover:border-emerald-400/50 shadow-md hover:shadow-glow-emerald transition-all duration-300 space-y-2 backdrop-blur-xl group">
            <div className="flex items-center gap-2.5 text-xs font-mono font-medium text-emerald-400">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileCheck className="w-4.5 h-4.5 text-emerald-400" />
              </div>
              <span className="uppercase tracking-wider font-bold">CBAM Defense</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed group-hover:text-white transition-colors">
              Estimated €4,000+ difference per container vs EU default markups based on published
              rates.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
