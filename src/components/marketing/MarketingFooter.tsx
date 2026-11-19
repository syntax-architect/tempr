import React from 'react';
import { Logo } from '../brand/Logo';
import { ShieldCheck, Scale, FileText, CheckCircle2, Sparkles } from 'lucide-react';

export const MarketingFooter: React.FC = () => {
  return (
    <footer className="bg-[#080D1A] border-t border-slate-700/60 text-slate-300 py-16 sm:py-20 relative overflow-hidden">
      {/* Delicate Ambient Bottom Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[250px] bg-emerald-500/8 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Logo size="md" />
            <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
              The shop-floor-to-customs compliance operating system for Indian steel, pipe, flange,
              fastener, and engineering exporters. Automating EN 10204 3.1 Mill Test Certificates,
              EU Reg 2026/1963 Melt-and-Pour proof, and EU/UK CBAM emissions defense.
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              <span className="px-3 py-1 rounded-md bg-slate-800/90 border border-slate-700 text-slate-200 font-semibold">
                ISO 9001:2015
              </span>
              <span className="px-3 py-1 rounded-md bg-slate-800/90 border border-slate-700 text-slate-200 font-semibold">
                EN 10204:2004 Clause 6
              </span>
              <span className="px-3 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold">
                EU Reg 2026/1963
              </span>
              <span className="px-3 py-1 rounded-md bg-blue-500/15 border border-blue-500/30 text-blue-300 font-semibold">
                UK CDS Notice 2026
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-mono uppercase text-white tracking-wider">
              Compliance Tools
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <a
                  href="#simulator"
                  className="text-slate-300 hover:text-emerald-400 transition-colors"
                >
                  30-Second MTC Simulator
                </a>
              </li>
              <li>
                <a
                  href="#cn-checker"
                  className="text-slate-300 hover:text-emerald-400 transition-colors"
                >
                  CN 7304 - 7318 Scope Checker
                </a>
              </li>
              <li>
                <a
                  href="#clause-6"
                  className="text-slate-300 hover:text-emerald-400 transition-colors"
                >
                  Clause 6 Byte-Identical Integrity
                </a>
              </li>
              <li>
                <a
                  href="#roi-calculator"
                  className="text-slate-300 hover:text-emerald-400 transition-colors"
                >
                  CBAM Commercial Cost Difference Calculator
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-slate-300 hover:text-emerald-400 transition-colors"
                >
                  Factory OS Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Industrial Exporter Hubs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-mono uppercase text-white tracking-wider">
              Regional Field Engineering
            </h4>
            <div className="text-xs space-y-1.5 text-slate-300">
              <p className="font-semibold text-slate-100">West Bengal Metallurgy Cluster:</p>
              <p>Liluah, Belur &amp; Howrah Industrial Area</p>
              <p>Dankuni Heavy Engineering Zone</p>
              <p className="font-semibold text-slate-100 pt-1">Jharkhand &amp; Odisha:</p>
              <p>Jamshedpur &amp; Rourkela Upstream Mills</p>
            </div>
          </div>
        </div>

        {/* Legal Regulatory Bottom Bar */}
        <div className="pt-8 border-t border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div>© 2026 HeatLedger AI Technologies. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Cryptographic Tamper-Evident Annex A Verification</span>
            </span>
            <span>•</span>
            <span className="text-slate-300">Definitive EU CBAM Preparation</span>
          </div>
        </div>

        {/* Standard Regulatory Footer Disclaimer */}
        <p className="text-center text-xs text-slate-400 font-sans mt-6 max-w-2xl mx-auto leading-relaxed border-t border-slate-800/60 pt-4">
          HeatLedger supports compliance preparation. It is not legal advice and not an accredited
          verification body.
        </p>
      </div>
    </footer>
  );
};
