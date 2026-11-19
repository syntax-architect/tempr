import React from 'react';
import { AlertTriangle, FileSpreadsheet, Lock, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const ProblemSection: React.FC = () => {
  const problems = [
    {
      bad: 'Re-typing mill chemical analyses onto export company letterheads',
      consequence: 'Violates EN 10204 Clause 6. German and Italian customs auditors reject re-typed inspection certificates.',
      fix: 'Untouched upstream mill certificate preserved byte-identical with SHA-256 cryptographic proof.',
    },
    {
      bad: 'Missing Country of Melt and Pour declaration on mill test certificates',
      consequence: 'Container impounded at Rotterdam, Antwerp, or Genoa under Council Regulation (EU) 2023/1214 (Art. 3g).',
      fix: 'Mandatory extraction and validation of primary crude steel melt plant before dispatch release.',
    },
    {
      bad: 'Relying on default emissions factors to skip actual calculations',
      consequence: 'Statutory 10% to 30% penalty markups under EU 2025/2621, adding €2,000–€5,000 extra tax per container.',
      fix: 'Deterministic step-by-step specific embedded emissions (SEE) calculation trace per tonne.',
    },
    {
      bad: 'Tracking heat allocations in disconnected Excel spreadsheets',
      consequence: 'Phantom over-allocation: selling 60 MT from a 40 MT heat batch across multiple export invoices.',
      fix: 'Mass-balance ledger locks remaining heat quantity and rejects over-allocations with exact deficit.',
    },
  ];

  return (
    <section id="problem" className="py-16 sm:py-24 bg-[#0B1120] border-b border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono mb-4">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>The Compliance Blind Spot</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            How Excel Spreadsheets Cause Customs Impoundment
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            European customs agencies no longer accept unsubstantiated assertions. Here is how traditional practices trigger container rejections:
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {problems.map((p, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Traditional Practice */}
                <div className="flex items-start gap-3 mb-3">
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-mono uppercase text-rose-400 font-bold block mb-1">
                      Traditional Shop-Floor Habit
                    </span>
                    <p className="text-sm font-semibold text-white">{p.bad}</p>
                  </div>
                </div>

                {/* Audit Consequence */}
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 mb-4 text-xs text-rose-200">
                  <strong className="block font-semibold text-rose-300 mb-0.5">EU Audit Consequence:</strong>
                  {p.consequence}
                </div>
              </div>

              {/* HeatLedger Fix */}
              <div className="pt-3 border-t border-slate-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300">
                  <strong className="text-emerald-300 block font-mono">HeatLedger Standard:</strong>
                  {p.fix}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
