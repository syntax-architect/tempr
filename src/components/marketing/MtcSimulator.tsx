import React, { useState } from 'react';
import { SIMULATOR_PRESETS } from '../../data/mockData';
import { SimulatorPreset, BoundingBox } from '../../types';
import {
  CheckCircle2,
  ShieldCheck,
  Scan,
  ExternalLink,
  FileText,
  Building,
  Flame,
  TrendingDown,
  RotateCw,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { LaserScanBeam } from '../effects/LaserScanBeam';
import { AnimatedNumber } from '../effects/AnimatedNumber';

interface MtcSimulatorProps {
  onOpenWorkbench: (presetId?: string) => void;
}

export const MtcSimulator: React.FC<MtcSimulatorProps> = ({ onOpenWorkbench }) => {
  const [selectedPreset, setSelectedPreset] = useState<SimulatorPreset>(SIMULATOR_PRESETS[0]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [activeBox, setActiveBox] = useState<BoundingBox | null>(null);

  const handlePresetSelect = (preset: SimulatorPreset) => {
    setIsScanning(true);
    setSelectedPreset(preset);
    setActiveBox(null);
    setTimeout(() => {
      setIsScanning(false);
    }, 600);
  };

  const handleTriggerScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 700);
  };

  return (
    <section
      id="simulator"
      className="py-20 sm:py-24 lg:py-28 bg-obsidian-900 border-b border-slate-800 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-emerald-400 text-xs font-mono mb-4">
            <Scan className="w-3.5 h-3.5" />
            <span>Interactive 30-Second Simulator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-[-0.03em] leading-tight">
            See How Exporters Defend Actual Emissions Against Default Markups
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Select an export shipment preset to preview automated spectrometry extraction, ASTM/EN
            tolerance checks, and container-ready customs dossiers.
          </p>
        </div>

        {/* Integrated Industrial Shipment Selector Ribbon (Replaces 3 vibe-coded cards) */}
        <div className="mb-8 p-1.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row gap-1.5 shadow-sm">
          {SIMULATOR_PRESETS.map((preset) => {
            const isSelected = selectedPreset.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handlePresetSelect(preset)}
                className={`flex-1 p-3.5 rounded-lg text-left transition-all ${
                  isSelected
                    ? 'bg-slate-800 border border-slate-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {preset.code}
                    </span>
                    <span className="font-semibold text-xs text-white">
                      {preset.title.split('(')[0]}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{preset.tonnage} MT</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="truncate flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{preset.mill}</span>
                  </span>
                  <span className="font-mono text-xs text-emerald-400 shrink-0 ml-2">
                    Heat #{preset.heatNumber}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Split-Screen Interactive Simulator Card */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
          {/* Card Top Action Bar */}
          <div className="px-6 py-3.5 border-b border-white/[0.07] bg-obsidian-950/70 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-slate-400">Precursor MTC:</span>
                <span className="text-sm font-semibold text-white font-mono">
                  {selectedPreset.certNumber}
                </span>
                <span className="text-xs text-slate-400">({selectedPreset.mill})</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleTriggerScan}
                disabled={isScanning}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] active:scale-[0.98] text-xs font-mono text-emerald-300 border border-white/[0.09] transition-all disabled:opacity-50"
              >
                <RotateCw
                  className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-emerald-400' : ''}`}
                />
                <span>Run Instant AI Inspection</span>
              </button>

              <button
                onClick={() => onOpenWorkbench(selectedPreset.id)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-obsidian-950 text-xs font-semibold transition-all shadow-sm"
              >
                <span>Open in QA App</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 50/50 Split-Screen Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.07]">
            {/* LEFT PANE: Upstream Steel Mill 3.1 MTC Realistic Document Canvas */}
            <div className="p-6 bg-obsidian-950/60 relative flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                    Upstream Mill 3.1 Certificate Canvas
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400 bg-white/[0.03] px-2.5 py-0.5 rounded-md border border-white/[0.07]">
                  EN 10204:2004 Type 3.1
                </span>
              </div>

              {/* Simulated Mill Paper Document */}
              <div className="relative rounded-xl bg-white text-slate-900 p-5 shadow-md border border-slate-200/90 font-sans text-xs min-h-[460px] overflow-hidden select-none">
                {/* GSAP Laser Scan Beam Overlay */}
                <LaserScanBeam isScanning={isScanning} />

                {/* Mill Header */}
                <div className="border-b-2 border-slate-900 pb-2 mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="font-extrabold text-sm tracking-tight text-slate-900 uppercase">
                      {selectedPreset.mill}
                    </h3>
                    <p className="text-xs text-slate-600">
                      Quality Assurance &amp; Metallurgical Testing Department · Works Laboratory
                    </p>
                  </div>
                  <div className="text-right font-mono text-xs">
                    <div className="font-bold text-slate-900">INSPECTION CERTIFICATE 3.1</div>
                    <div className="text-slate-500">Ref: {selectedPreset.certNumber}</div>
                    <div className="text-slate-500">Date: {selectedPreset.issueDate}</div>
                  </div>
                </div>

                {/* Heat & Melt Section */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <div>
                    <span className="text-slate-500 block text-xs uppercase font-mono">
                      Product &amp; Heat No:
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      HEAT #{selectedPreset.heatNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs uppercase font-mono">
                      Country of Melt &amp; Pour:
                    </span>
                    <span className="font-bold text-emerald-800 flex items-center gap-1">
                      🇮🇳 {selectedPreset.meltCountry} (Original Origin)
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs uppercase font-mono">
                      Melting Route:
                    </span>
                    <span className="text-slate-800 font-medium">{selectedPreset.meltRoute}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs uppercase font-mono">
                      Standard Grade:
                    </span>
                    <span className="font-bold text-slate-800">
                      {selectedPreset.productType.split('/')[0]}
                    </span>
                  </div>
                </div>

                {/* Chemical Ladle Table in Document */}
                <div className="mb-3">
                  <div className="text-xs font-mono font-bold uppercase text-slate-700 mb-1 flex justify-between">
                    <span>Chemical Composition (Ladle Analysis - %)</span>
                    <span className="text-xs text-slate-500">Optical Emission Spectrometry</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-center border-collapse text-xs font-mono">
                      <thead>
                        <tr className="bg-slate-100 border border-slate-300">
                          {selectedPreset.chemistry.slice(0, 8).map((el) => (
                            <th key={el.symbol} className="p-1 border border-slate-300 font-bold">
                              {el.symbol}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-white">
                          {selectedPreset.chemistry.slice(0, 8).map((el) => (
                            <td
                              key={el.symbol}
                              className="p-1 border border-slate-300 font-semibold text-slate-800"
                            >
                              {el.measured.toFixed(el.symbol === 'P' || el.symbol === 'S' ? 3 : 2)}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mechanical Test Table */}
                <div className="mb-3">
                  <div className="text-xs font-mono font-bold uppercase text-slate-700 mb-1">
                    Mechanical Properties (Ambient Temp 23°C)
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    {selectedPreset.mechanics.map((m) => (
                      <div
                        key={m.property}
                        className="bg-slate-50 p-1.5 rounded border border-slate-200 flex justify-between"
                      >
                        <span className="text-slate-600">{m.property}:</span>
                        <span className="font-bold text-slate-900">{m.measured}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stamp & Authorized QA Signature */}
                <div className="mt-4 pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs">
                  <div className="text-slate-500 leading-tight">
                    <div>Issued under EN 10204 3.1</div>
                    <div>Material verified free of radiation</div>
                  </div>
                  <div className="text-center border-2 border-dashed border-emerald-600/70 p-2 rounded-lg bg-emerald-50/60">
                    <div className="font-bold text-emerald-800 uppercase text-xs">
                      QA Metallurgist Verified
                    </div>
                    <div className="text-xs text-emerald-700 font-mono">
                      SAIL / TATA / JSW MILL LABORATORY
                    </div>
                    <div className="text-xs text-slate-500">DIGITALLY STAMPED</div>
                  </div>
                </div>

                {/* Bounding Box Overlays */}
                {selectedPreset.boundingBoxes.map((box) => {
                  const borderClasses = {
                    amber: 'border-amber-500 bg-amber-500/15 text-amber-900',
                    cobalt: 'border-blue-600 bg-blue-500/15 text-blue-900',
                    emerald: 'border-emerald-500 bg-emerald-500/15 text-emerald-900',
                  }[box.type];

                  const tagClasses = {
                    amber: 'bg-amber-500 text-obsidian-950',
                    cobalt: 'bg-blue-600 text-white',
                    emerald: 'bg-emerald-500 text-obsidian-950',
                  }[box.type];

                  const isHovered = activeBox?.id === box.id;

                  return (
                    <div
                      key={box.id}
                      onMouseEnter={() => setActiveBox(box)}
                      onMouseLeave={() => setActiveBox(null)}
                      style={{
                        position: 'absolute',
                        left: `${box.coords.x}%`,
                        top: `${box.coords.y}%`,
                        width: `${box.coords.width}%`,
                        height: `${box.coords.height}%`,
                      }}
                      className={`border-2 rounded transition-all cursor-pointer z-10 ${borderClasses} ${
                        isHovered
                          ? 'ring-2 ring-white ring-offset-1 shadow-lg scale-[1.01]'
                          : 'opacity-90'
                      }`}
                    >
                      <span
                        className={`absolute -top-3 left-1 text-xs font-mono px-1.5 py-0.2 rounded font-bold uppercase shadow-sm ${tagClasses}`}
                      >
                        {box.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Bounding Box Legend */}
              <div className="mt-4 flex flex-wrap items-center justify-between text-xs font-mono gap-2 text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>Heat &amp; Melt Country</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>Optical Emission Spectrometry (OES)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Tensile / QA Stamp</span>
                  </span>
                </div>
                <span className="text-xs text-slate-500">Live Vision OCR Coordinates</span>
              </div>
            </div>

            {/* RIGHT PANE: Live Verification Result */}
            <div className="p-6 bg-slate-900/60 flex flex-col justify-between space-y-6">
              {/* Top Verification Status Badges */}
              <div className="space-y-4">
                {/* a) ASTM / EN Chemical & Tensile Tolerance Check */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-white/[0.07]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                        ASTM / EN Metallurgy Validation
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                      100% WITHIN SPEC
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 text-xs font-mono">
                    <div className="bg-slate-900/80 p-2.5 rounded-lg border border-white/[0.05]">
                      <span className="text-slate-400 block text-xs">C (Carbon)</span>
                      <span className="text-emerald-400 font-bold">
                        {selectedPreset.chemistry[0].measured}%
                      </span>
                      <span className="text-slate-500 text-xs block">
                        Max {selectedPreset.chemistry[0].max}%
                      </span>
                    </div>
                    <div className="bg-slate-900/80 p-2.5 rounded-lg border border-white/[0.05]">
                      <span className="text-slate-400 block text-xs">Mn (Manganese)</span>
                      <span className="text-emerald-400 font-bold">
                        {selectedPreset.chemistry[1].measured}%
                      </span>
                      <span className="text-slate-500 text-xs block">
                        {selectedPreset.chemistry[1].min}-{selectedPreset.chemistry[1].max}%
                      </span>
                    </div>
                    <div className="bg-slate-900/80 p-2.5 rounded-lg border border-white/[0.05]">
                      <span className="text-slate-400 block text-xs">CEV (Carbon Eq)</span>
                      <span className="text-emerald-400 font-bold">
                        {selectedPreset.chemistry
                          .find((c) => c.symbol === 'CEV')
                          ?.measured.toFixed(3)}
                      </span>
                      <span className="text-slate-500 text-xs block">IIW Formula Pass</span>
                    </div>
                  </div>
                </div>

                {/* b) EU Reg 2026/1963 & UK CDS Melt-and-Pour Proof Status */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-white/[0.07]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                        EU Reg 2026/1963 &amp; UK CDS Proof
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      INDIA MELTED &amp; POURED
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Primary steelmaking verified at{' '}
                    <strong className="text-amber-300">{selectedPreset.mill}</strong>. Melt-and-Pour
                    origin explicitly stated on original 3.1 MTC. Circumvention-proof audit trail
                    established.
                  </p>
                </div>

                {/* c) EU CBAM Precursor + Plant Embedded Emissions */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40 border border-emerald-500/25">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                      <Flame className="w-4 h-4 text-emerald-400" />
                      Embedded Emissions vs EU Default
                    </span>
                    <span className="text-xs font-mono font-semibold text-emerald-300">
                      38% Carbon Advantage
                    </span>
                  </div>

                  <div className="space-y-2 mt-3">
                    <div>
                      <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                        <span>Verified Actual Emissions:</span>
                        <span className="text-emerald-400 font-bold">
                          {selectedPreset.actualEmissions} tCO₂e / t
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${(selectedPreset.actualEmissions / selectedPreset.defaultEmissions) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                        <span>Official EU Default Baseline + 10% Markup (2026):</span>
                        <span className="text-red-400 font-medium">
                          {selectedPreset.defaultEmissions} tCO₂e / t
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-red-500/80 h-full rounded-full w-full" />
                      </div>
                    </div>
                  </div>

                  {/* Big Live Euro Savings Counter */}
                  <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono uppercase text-slate-400 block">
                        Net CBAM Savings for European Buyer:
                      </span>
                      <span className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono tracking-tight flex items-center gap-1.5">
                        <TrendingDown className="w-5 h-5 text-emerald-400" />
                        <span>
                          €<AnimatedNumber value={selectedPreset.euroSavings} duration={0.8} />{' '}
                          Saved
                        </span>
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono text-slate-400 block">Payload</span>
                      <span className="text-xs font-mono text-slate-200 font-semibold">
                        {selectedPreset.tonnage} MT
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/[0.07]">
                <div className="text-xs font-mono text-slate-400">
                  Ready to produce EU CBAM XML &amp; Clause 6 Merged Dossier.
                </div>
                <button
                  onClick={() => onOpenWorkbench(selectedPreset.id)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-obsidian-950 font-semibold text-xs px-5 py-2.5 rounded-full transition-all shadow-[0_2px_10px_rgba(16,185,129,0.3)]"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Inspect in QA Workbench</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
