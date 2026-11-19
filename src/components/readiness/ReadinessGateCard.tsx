import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Lock,
  Unlock,
  Sparkles,
  FileText,
  UserCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReadinessEvaluation, ReadinessCheck } from '../../types';

interface ReadinessGateCardProps {
  evaluation: ReadinessEvaluation;
  onNavigateToField?: (fieldLink: string) => void;
  onRequestRelease?: () => void;
  onApproveRelease?: (overrideReason?: string) => void;
  userRole?: string;
  releaseStatus?: string;
}

export const ReadinessGateCard: React.FC<ReadinessGateCardProps> = ({
  evaluation,
  onNavigateToField,
  onRequestRelease,
  onApproveRelease,
  userRole = 'QA_INSPECTOR',
  releaseStatus = 'DRAFT',
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState<boolean>(false);
  const [overrideReason, setOverrideReason] = useState<string>('');

  const { score, status, can_release, checks, blocking_failures, warning_failures } = evaluation;

  // Determine circular meter color and status styling
  const statusColor =
    status === 'READY'
      ? {
          stroke: '#10B981', // emerald
          badgeBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
          title: 'Ready for Export Dispatch',
          icon: ShieldCheck,
        }
      : status === 'FIX_NEEDED'
        ? {
            stroke: '#F59E0B', // amber
            badgeBg: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
            title: 'Fix Needed (Warnings Present)',
            icon: AlertTriangle,
          }
        : {
            stroke: '#F43F5E', // rose
            badgeBg: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
            title: 'Dispatch Blocked by Gatekeeper',
            icon: AlertOctagon,
          };

  const circumference = 2 * Math.PI * 42; // r = 42
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Next actionable failed check for quick jump
  const firstFailingCheck = checks.find((c) => !c.passed);

  const handleConfirmOverride = () => {
    if (!overrideReason.trim()) return;
    onApproveRelease?.(overrideReason);
    setIsOverrideModalOpen(false);
  };

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-700/80 shadow-xl overflow-hidden backdrop-blur-xl">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800">
        <div className="flex items-center gap-4">
          {/* Circular SVG Score Dial */}
          <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background ring */}
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-slate-800"
                strokeWidth="8"
                fill="none"
              />
              {/* Progress ring */}
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke={statusColor.stroke}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-black font-mono text-white leading-none">
                {score}
              </span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mt-0.5">
                SCORE
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${statusColor.badgeBg}`}
              >
                <statusColor.icon className="w-3.5 h-3.5" />
                <span>{status}</span>
              </span>
              {releaseStatus === 'RELEASE_APPROVED' && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/40">
                  RELEASED
                </span>
              )}
            </div>

            <h3 className="text-base font-bold text-white tracking-tight">
              Shipment Release Gatekeeper
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {blocking_failures > 0
                ? `${blocking_failures} critical check${blocking_failures > 1 ? 's' : ''} blocking dispatch clearance`
                : warning_failures > 0
                  ? `${warning_failures} advisory warning${warning_failures > 1 ? 's' : ''} detected`
                  : 'All statutory, metallurgical, and mass balance rules verified'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
          {firstFailingCheck && (
            <button
              onClick={() => onNavigateToField?.(firstFailingCheck.field_link)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold transition-all group"
            >
              <span>Fix Next Issue</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}

          {releaseStatus === 'DRAFT' && (
            <button
              onClick={onRequestRelease}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-bold transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Request Release</span>
            </button>
          )}

          {can_release && releaseStatus !== 'RELEASE_APPROVED' && (
            <button
              onClick={() => onApproveRelease?.()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-glow-emerald transition-all"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Approve Dispatch</span>
            </button>
          )}

          {!can_release && userRole === 'OWNER' && releaseStatus !== 'RELEASE_APPROVED' && (
            <button
              onClick={() => setIsOverrideModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-all"
            >
              <Lock className="w-3.5 h-3.5 text-rose-400" />
              <span>Owner Override</span>
            </button>
          )}
        </div>
      </div>

      {/* Rules Checklist Preview / Toggle */}
      <div className="p-4 bg-slate-950/60">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400 font-medium">
            Readiness Audit Rules ({checks.filter((c) => c.passed).length}/{checks.length} Passed)
          </span>
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="inline-flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors"
          >
            <span>{isExpanded ? 'Collapse Checklist' : 'Show All Checks'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Collapsible Rules List */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-3 space-y-2 overflow-hidden"
            >
              {checks.map((check) => (
                <div
                  key={check.rule_id}
                  className={`p-3 rounded-xl border text-xs font-mono flex items-start justify-between gap-3 transition-colors ${
                    check.passed
                      ? 'bg-slate-900/60 border-slate-800 text-slate-300'
                      : check.severity === 'BLOCK'
                        ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                        : 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {check.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : check.severity === 'BLOCK' ? (
                      <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{check.name}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            check.severity === 'BLOCK'
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {check.severity}
                        </span>
                      </div>
                      <p className="text-slate-400 font-sans text-xs mt-0.5">{check.message}</p>
                      {!check.passed && (
                        <p className="text-emerald-300/90 font-mono text-[11px] mt-1 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{check.fix_hint}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {!check.passed && onNavigateToField && (
                    <button
                      onClick={() => onNavigateToField(check.field_link)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-semibold shrink-0"
                    >
                      Fix
                    </button>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Owner Override Modal */}
      {isOverrideModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-rose-500/40 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-rose-400 font-bold text-sm font-mono">
              <Lock className="w-4 h-4" />
              <span>OWNER RELEASE OVERRIDE</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              This shipment currently fails <strong className="text-rose-400">{blocking_failures} blocking rules</strong>.
              As plant Owner, you may authorize release for export, but European customs clearance remains your commercial liability. A mandatory audit log entry will be recorded.
            </p>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">
                Typed Justification Reason (Required):
              </label>
              <textarea
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                placeholder="e.g. Buyer accepted secondary mill lab cert under commercial concession C-409."
                className="w-full h-24 p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-rose-400 font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsOverrideModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmOverride}
                disabled={overrideReason.trim().length < 5}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white disabled:opacity-40"
              >
                Confirm Override &amp; Release
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
