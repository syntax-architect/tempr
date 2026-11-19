import React from 'react';
import { ShieldCheck, CheckCircle2, Lock, Cpu } from 'lucide-react';

/**
 * Lightweight SVG/CSS Animated Mockup for Mobile Hero
 * Prompt D7: Total footprint < 15 KB (well below 60 KB budget), zero layout shift,
 * hardware-accelerated CSS animations.
 */
export const MobileHeroMockup: React.FC = () => {
  return (
    <div className="w-full max-w-sm mx-auto rounded-2xl bg-slate-900 border border-slate-750 p-4 shadow-2xl relative overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-[11px] font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-slate-300 font-bold">MTC-IN-TSJ-26-9021</span>
        </div>
        <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          EN 10204 3.1
        </span>
      </div>

      {/* Certificate Simulated Body with Laser Scanner Line */}
      <div className="my-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 relative overflow-hidden font-mono text-[11px]">
        {/* Animated Laser Scanning Bar */}
        <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse-slow top-2" />

        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-400">Mill: Tata Steel Jamshedpur</span>
          <span className="text-emerald-400 font-bold">Melt: India (IN) ✓</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] my-2">
          <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block">C</span>
            <span className="text-white font-bold">0.22%</span>
          </div>
          <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block">Mn</span>
            <span className="text-white font-bold">0.88%</span>
          </div>
          <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block">Si</span>
            <span className="text-white font-bold">0.25%</span>
          </div>
          <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block">CEV</span>
            <span className="text-emerald-400 font-bold">0.408</span>
          </div>
        </div>

        <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-850">
          <span>Heat: TSJ-26-9021</span>
          <span className="text-emerald-400 font-mono">SHA-256: 878a3b... ✓</span>
        </div>
      </div>

      {/* Bottom Proof Strip */}
      <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-slate-400">
        <span className="flex items-center gap-1 text-emerald-400 font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          Melt &amp; Pour Verified
        </span>
        <span className="text-slate-400">Clause 6 Sealed</span>
      </div>
    </div>
  );
};
