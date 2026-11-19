import React from 'react';
import { UploadCloud, Cpu, Lock, ArrowRight, ShieldCheck, CheckCircle2, FileText, Binary } from 'lucide-react';
import { motion } from 'framer-motion';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Ingest & Deterministic OCR Extraction',
      subtitle: 'Multi-page PDF or Mobile Camera Capture',
      desc: 'Raw mill test certificates are parsed using real PyMuPDF vector coordinates. Chemistry, heat numbers, and melt-and-pour country are extracted with confidence scores. Any field below 85% confidence is flagged amber for human confirmation.',
      badge: 'Zero Hallucinations',
      icon: UploadCloud,
    },
    {
      num: '02',
      title: 'Mass Balance & Carbon Calculation',
      subtitle: 'Anti-Phantom Ledger & Specific Embedded Emissions',
      desc: 'Heat quantities are locked in an atomic SQLite ledger. When heat tonnage is allocated to an export shipment, available balance decrements automatically. CBAM specific embedded emissions are calculated with a full mathematical step-by-step trace.',
      badge: 'Reconciled Inventory',
      icon: Cpu,
    },
    {
      num: '03',
      title: 'Cryptographic Signing & Delivery',
      subtitle: 'Ed25519 Digital Signature & Clause 6 Preservation',
      desc: 'QA inspectors sign off using step-up MFA. HeatLedger builds an EN 10204 3.1 inspection package containing the signed cover, the untouched original mill certificate byte-for-byte, and a draft CBAM XML data sheet for EU declarants.',
      badge: 'Audit-Ready Package',
      icon: Lock,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-[#0A0F1D] border-b border-slate-800 relative">
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
            <span>3-Step Compliance Pipeline</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            How HeatLedger Prepares Audit-Ready Shipments
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            From raw shop-floor mill certificates to tamper-evident packages in 30 seconds.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black font-mono text-emerald-400/40 group-hover:text-emerald-400 transition-colors">
                      {step.num}
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-300">
                      {step.badge}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 mb-4">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white mb-1">{step.title}</h3>
                  <p className="text-xs font-mono text-slate-400 mb-3">{step.subtitle}</p>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{step.desc}</p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
                  <span>Stage {step.num} of 03</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
