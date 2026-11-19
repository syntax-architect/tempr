import React from 'react';
import {
  Building2,
  HelpCircle,
  ShieldCheck,
  TrendingDown,
  CheckCircle2,
  X,
  Sparkles,
  PhoneCall,
  Flame,
  ArrowRight,
} from 'lucide-react';

interface ExporterPitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToSimulator: () => void;
}

export const ExporterPitchModal: React.FC<ExporterPitchModalProps> = ({
  isOpen,
  onClose,
  onJumpToSimulator,
}) => {
  if (!isOpen) return null;

  const questions = [
    {
      num: '01',
      title: 'Explicit Melt & Pour Attestation',
      detail:
        "Does your upstream mill certificate explicitly declare 'Country of Melt & Pour: INDIA', or will European customs detain your container under EU Regulation 2026/1963?",
      proof:
        'HeatLedger AI validates the ISO 3166 Melt & Pour coordinate box or flags an immediate pre-shipment warning before departure.',
    },
    {
      num: '02',
      title: 'EN 10204 Clause 6 Byte-Identical Rule',
      detail:
        'Are you re-typing chemical analysis into Excel certificates? European declarants are systematically rejecting re-typed sheets without original mill annexes.',
      proof:
        'HeatLedger AI attaches the pristine upstream mill PDF byte-identically directly behind a separate divider page.',
    },
    {
      num: '03',
      title: 'Anti-Phantom Mass Balance',
      detail:
        'If a TÜV or SGS auditor reviews your past 6 months, did your factory export 80 tonnes attributed to a 50-tonne SAIL heat batch?',
      proof:
        'Our mass balance ledger decrements quota in real time, providing verifiable SHA-256 audit defense.',
    },
    {
      num: '04',
      title: 'CBAM Default Markup Defense',
      detail: 'Are European buyers asking for statutory CBAM default markup deductions?',
      proof:
        'Our recursive precursor calculator demonstrates verified emissions (~2.03 tCO2e/t vs 4.20 t default), providing an estimated ~€4,000 cost difference per container for planning.',
    },
    {
      num: '05',
      title: 'Fast Pilot Clearance',
      detail:
        'Would you test a 1-container pilot audit for ₹4,999 First Container Express Pass (100% credited back on Plant OS upgrade) to unblock an urgent European invoice in 24 hours?',
      proof:
        'We deliver the complete 3.1 PDF bundle, Country of Melt & Pour statement, and EU CBAM XML within 24 hours.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200/90 shadow-2xl p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto font-sans">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 text-xs font-mono font-medium text-amber-700 bg-amber-50 px-3 py-1 rounded-full w-fit mb-3 border border-amber-200/60">
          <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
          <span>Exporter Discovery &amp; Field Pitch Script</span>
        </div>

        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
          The 5 Exporter Validation Questions (Howrah / Liluah / Kolkata)
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Use this script when meeting with Export Directors and QA Heads of tube, flange, and
          fastener manufacturing plants.
        </p>

        {/* Question Cards */}
        <div className="mt-5 space-y-3">
          {questions.map((item) => (
            <div
              key={item.num}
              className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-1.5 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                  {item.num}
                </span>
                <h4 className="text-xs font-semibold text-slate-900">{item.title}</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">{item.detail}</p>
              <div className="pt-1 text-xs font-mono text-emerald-800 flex items-start gap-1.5 pl-6">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-emerald-900 font-semibold">Solution:</strong> {item.proof}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-6 pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-mono text-slate-500">
            Target Pilot: ₹4,999 First Container Express Pass (100% credited back on Plant OS
            upgrade)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onJumpToSimulator();
              }}
              className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Demo 30-Sec MTC Simulator</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
