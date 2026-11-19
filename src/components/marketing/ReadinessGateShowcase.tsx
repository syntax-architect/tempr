import React from 'react';
import { ShieldCheck, CheckCircle2, AlertOctagon, UserCheck, Send, Clock, FileCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const ReadinessGateShowcase: React.FC = () => {
  return (
    <section id="readiness-gate" className="py-16 sm:py-24 bg-[#0B1120] border-b border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Industrial Gate Control</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Stop Non-Compliant Containers Before Factory Gate Release
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            Dispatch teams cannot mark a shipment as "Released" if blocking compliance checks fail. No missing origin, no missing signatures.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Readiness Score Interactive Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-slate-400">Shipment Container</span>
                <h3 className="text-lg font-bold text-white font-mono">EXP-2026-ROTTERDAM-04</h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-emerald-400 font-bold px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/25">
                  READINESS: 100/100
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-850 border border-slate-800 text-xs">
                <span className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Melt and Pour Country Declared (India / BOF)
                </span>
                <span className="font-mono text-emerald-400 font-bold">PASSED</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-850 border border-slate-800 text-xs">
                <span className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Chemical Analysis within ASTM A106 Gr. B Spec
                </span>
                <span className="font-mono text-emerald-400 font-bold">PASSED</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-850 border border-slate-800 text-xs">
                <span className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Mass Balance: 24.5 MT within available 40 MT heat
                </span>
                <span className="font-mono text-emerald-400 font-bold">RECONCILED</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-850 border border-slate-800 text-xs">
                <span className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  EN 10204 3.1 Digital Signature with Step-Up MFA
                </span>
                <span className="font-mono text-emerald-400 font-bold">SIGNED</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-850 border border-slate-800 text-xs">
                <span className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Untouched Original Upstream Certificate Attached
                </span>
                <span className="font-mono text-emerald-400 font-bold">LOCKED</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">Gate Status:</span>
              <span className="text-emerald-400 font-bold font-mono flex items-center gap-1.5">
                <UserCheck className="w-4 h-4" />
                DISPATCH UNLOCKED (Approved by Plant QA)
              </span>
            </div>
          </motion.div>

          {/* Supplier Request Feature */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/25 px-2.5 py-0.5 rounded mb-3">
                <Send className="w-3.5 h-3.5" />
                <span>Supplier Collaboration</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Automated Supplier Emissions Data Requests
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Collecting precursor carbon emissions and energy data from sub-tier mills is tedious by phone. HeatLedger generates secure, no-login links for steel suppliers to upload their data directly on their mobile phone.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 mb-2">
                  <Send className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">WhatsApp &amp; Email Intake</h4>
                <p className="text-xs text-slate-400">
                  Suppliers upload photos or PDFs directly via WhatsApp or a unique plant email.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mb-2">
                  <FileCheck className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Precursor Verification</h4>
                <p className="text-xs text-slate-400">
                  Approved supplier data automatically links to heats for CBAM specific embedded emissions calculations.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-300">Try with sample data in the Factory Workbench:</span>
              <a
                href="/app?view=command-center"
                className="text-emerald-400 hover:text-emerald-300 font-bold inline-flex items-center gap-1 group"
              >
                <span>Open Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
