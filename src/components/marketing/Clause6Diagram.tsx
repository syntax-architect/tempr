import React from 'react';
import {
  FileLock2,
  Cpu,
  Stamp,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Check,
  FileText,
  Binary,
  UserCheck,
  Lock,
  Layers,
  FileCode,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const Clause6Diagram: React.FC = () => {
  return (
    <section
      id="clause-6"
      className="py-20 sm:py-24 lg:py-28 bg-[#0C1425] border-b border-slate-700/60 relative overflow-hidden"
    >
      {/* Background Lighting Accents */}
      <div className="absolute top-1/4 -right-36 w-[650px] h-[500px] bg-amber-500/12 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 -left-36 w-[600px] h-[500px] bg-emerald-500/12 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-tech-grid-bright opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with Motion Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-amber-400 text-xs font-mono mb-4 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-semibold tracking-wide">European Standard EN 10204:2004 Clause 6</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-[-0.03em] leading-tight">
            Untouched Upstream Mill Certificates by Law
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Standard EN 10204 Clause 6 strictly dictates: <em className="text-white">"The intermediary shall only pass on to the purchaser the inspection certificate without any alteration to it. A separate explanation sheet may be added."</em> HeatLedger locks the original PDF byte-for-byte with SHA-256 integrity proofs.
          </p>
        </motion.div>

        {/* Unified Chain-of-Custody Pipeline with Moving Signals */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="rounded-2xl bg-slate-850/90 border border-slate-700/80 p-6 sm:p-8 shadow-2xl mb-12 backdrop-blur-xl"
        >
          <div className="flex flex-col lg:flex-row items-stretch gap-6 relative">
            {/* Stage 1: Ingest & Cryptographic Lock */}
            <div className="flex-1 rounded-xl bg-slate-900/90 border border-slate-750 hover:border-amber-500/40 p-6 flex flex-col justify-between shadow-md transition-all duration-300 group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono uppercase text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded font-bold">
                    Stage 01 · Intake
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileLock2 className="w-4.5 h-4.5 text-amber-400" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  Ingest &amp; Cryptographic Lock
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Ingests the original upstream steel mill 3.1 PDF from primary producers (SAIL,
                  Tata Steel, JSW). Computes an immutable SHA-256 checksum and binds the document as
                  tamper-evident <strong className="text-white font-semibold">Annex A</strong>.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-750 space-y-2 text-xs font-mono text-slate-300">
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Zero re-typing of ladle chemistry</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>SHA-256 document fingerprint</span>
                </div>
              </div>
            </div>

            {/* Stage Connector Arrow 1 with Animated Energy Signal */}
            <div className="hidden lg:flex flex-col items-center justify-center px-1 relative w-12">
              <div className="h-0.5 w-full bg-slate-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-flow-signal w-full h-full" />
              </div>
              <ArrowRight className="w-5 h-5 text-amber-400 mt-2" />
            </div>

            {/* Stage 2: Metallurgy Verification & Mass Balance */}
            <div className="flex-1 rounded-xl bg-slate-900/90 border border-slate-750 hover:border-blue-500/40 p-6 flex flex-col justify-between shadow-md transition-all duration-300 group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono uppercase text-blue-300 bg-blue-500/15 border border-blue-500/30 px-2.5 py-0.5 rounded font-bold">
                    Stage 02 · Engine
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/25 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Cpu className="w-4.5 h-4.5 text-blue-400" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  Deterministic ASTM Verification
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Deterministic OCR matches chemical elements and tensile tests against target
                  standards. Calculates IIW Carbon Equivalent (CEV) and runs PostgreSQL mass balance
                  constraints to prevent phantom heat reuse.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-750 space-y-2 text-xs font-mono text-slate-300">
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>IIW Carbon Equivalent formula</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Anti-phantom mass balance ledger</span>
                </div>
              </div>
            </div>

            {/* Stage Connector Arrow 2 with Animated Energy Signal */}
            <div className="hidden lg:flex flex-col items-center justify-center px-1 relative w-12">
              <div className="h-0.5 w-full bg-slate-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-flow-signal w-full h-full" />
              </div>
              <ArrowRight className="w-5 h-5 text-emerald-400 mt-2" />
            </div>

            {/* Stage 3: Authorized Sign-Off & Customs XML */}
            <div className="flex-1 rounded-xl bg-slate-900/90 border border-slate-750 hover:border-emerald-500/40 p-6 flex flex-col justify-between shadow-md transition-all duration-300 group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono uppercase text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded font-bold">
                    Stage 03 · Dispatch
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Stamp className="w-4.5 h-4.5 text-emerald-400" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  Authorized Sign-Off &amp; XML
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Routes to the Authorized Inspection Representative for digital signature and
                  official factory seal. Generates the compliant EN 10204 cover dossier alongside
                  the European CBAM XML communication file.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-750 space-y-2 text-xs font-mono text-slate-300">
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Authorized Inspector digital stamp</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Official EU CBAM XML generation</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Regulatory Audit Comparison Panel */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-850/90 border border-slate-700/80 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-xl backdrop-blur-xl">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-red-500/15 text-red-400 border border-red-500/30 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-red-400 uppercase font-mono tracking-wider">
                The Non-Compliant Risk: Re-typed Spreadsheets
              </h4>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Intermediary stockists often re-type chemical values on their own letterhead without
                appending the original mill certificate. Under European standard EN 10204 Clause 6,
                this is classified as non-conforming documentation and triggers immediate customs
                detention at EU ports.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-emerald-400 uppercase font-mono tracking-wider">
                HeatLedger AI Clause 6 Standard
              </h4>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                HeatLedger AI preserves the unbroken chain of custody. The factory's transformed 3.1
                certificate cites the original heat number and attaches the untouched upstream steel
                mill document as a tamper-evident Annex, backed by digital inspection sign-off.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
