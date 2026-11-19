import React from 'react';
import { Calendar, ShieldAlert, Scale, ExternalLink, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { SOURCED_REGULATORY_FACTS } from '../../data/sourcedFacts';

export const WhyNowSection: React.FC = () => {
  return (
    <section
      id="why-now"
      className="py-16 sm:py-24 bg-[#0A0F1D] border-b border-slate-850 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono mb-4">
            <Calendar className="w-3.5 h-3.5" />
            <span>Statutory Timeline &amp; EU Sanctions</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Why 2026 Ends Spreadsheet Self-Declarations
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
            Every regulatory requirement below is codified in the Official Journal of the European Union.
            No estimates, no marketing buzzwords.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SOURCED_REGULATORY_FACTS.map((fact, idx) => (
            <motion.div
              key={fact.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                    {fact.date}
                  </span>
                  <span className="text-xs font-mono text-slate-400 truncate max-w-[200px]">
                    {fact.source}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">{fact.title}</h3>
                <p className="text-xs font-mono text-amber-400 mb-3">{fact.statutoryReference}</p>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{fact.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-400 font-mono font-medium">
                  <Scale className="w-3.5 h-3.5" />
                  Statutory Requirement
                </span>
                <span className="text-slate-400 font-mono">Legally Binding</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 p-4 rounded-xl bg-slate-900 border border-slate-800 text-center max-w-2xl mx-auto">
          <p className="text-xs text-slate-400">
            <strong className="text-slate-300">Legal Note:</strong> HeatLedger AI provides software tools to calculate emissions and package audit evidence. Exporters and authorized CBAM declarants must verify regulatory filings against official European Commission directives before final submission.
          </p>
        </div>
      </div>
    </section>
  );
};
