import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  XCircle,
  Clock,
  FileCheck,
  FileText,
  Archive,
  Copy,
  Check,
} from 'lucide-react';
import { haptics } from '../../lib/motion';

export type StatusType =
  | 'Verified'
  | 'Needs review'
  | 'Missing'
  | 'Out of spec'
  | 'Awaiting sign-off'
  | 'Signed'
  | 'Draft'
  | 'Superseded';

interface StatusConfig {
  icon: React.ReactNode;
  bg: string;
  text: string;
  border: string;
}

const statusMap: Record<StatusType, StatusConfig> = {
  Verified: {
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
  },
  'Needs review': {
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
  },
  Missing: {
    icon: <HelpCircle className="w-3.5 h-3.5" />,
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
  },
  'Out of spec': {
    icon: <XCircle className="w-3.5 h-3.5" />,
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/30',
  },
  'Awaiting sign-off': {
    icon: <Clock className="w-3.5 h-3.5" />,
    bg: 'bg-sky-500/10',
    text: 'text-sky-400',
    border: 'border-sky-500/30',
  },
  Signed: {
    icon: <FileCheck className="w-3.5 h-3.5" />,
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-300',
    border: 'border-emerald-500/40',
  },
  Draft: {
    icon: <FileText className="w-3.5 h-3.5" />,
    bg: 'bg-surface-2',
    text: 'text-text-muted',
    border: 'border-border',
  },
  Superseded: {
    icon: <Archive className="w-3.5 h-3.5" />,
    bg: 'bg-zinc-800/40',
    text: 'text-zinc-400',
    border: 'border-zinc-700/50',
  },
};

export const StatusChip: React.FC<{
  status: StatusType;
  className?: string;
  size?: 'sm' | 'md';
}> = ({ status, className = '', size = 'md' }) => {
  const config = statusMap[status] || statusMap.Draft;
  const sizeStyles = size === 'sm' ? 'text-xs px-2 py-0.5 gap-1' : 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeStyles} ${className}`}
    >
      <span className="shrink-0">{config.icon}</span>
      <span>{status}</span>
    </span>
  );
};

export const ConfidenceBadge: React.FC<{
  confidence: number; // 0 to 1 or 0 to 100
  className?: string;
}> = ({ confidence, className = '' }) => {
  const pct = confidence <= 1 ? Math.round(confidence * 100) : Math.round(confidence);

  const colorClass =
    pct >= 90
      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
      : pct >= 75
        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
        : 'bg-red-500/10 text-red-400 border-red-500/30';

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono text-xs font-semibold px-2 py-0.5 rounded-full border ${colorClass} ${className}`}
      title={`AI Confidence Score: ${pct}%`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          pct >= 90 ? 'bg-emerald-400' : pct >= 75 ? 'bg-amber-400' : 'bg-red-400'
        }`}
      />
      <span>{pct}% Conf</span>
    </span>
  );
};

export const HeatNumberTag: React.FC<{
  heatNumber: string;
  className?: string;
  showCopy?: boolean;
}> = ({ heatNumber, className = '', showCopy = true }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(heatNumber);
      haptics.tap();
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <span
      onClick={showCopy ? handleCopy : undefined}
      className={`inline-flex items-center gap-1.5 font-mono text-xs font-bold px-2 py-1 rounded-lg bg-surface-2 border border-border text-text hover:border-emerald-500/50 transition-colors select-all ${
        showCopy ? 'cursor-pointer active:scale-95' : ''
      } ${className}`}
      title={showCopy ? 'Click to copy heat number' : undefined}
    >
      <span className="text-emerald-400 font-semibold">#</span>
      <span>{heatNumber}</span>
      {showCopy && (
        <span className="text-text-muted hover:text-emerald-400 shrink-0 ml-0.5">
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
        </span>
      )}
    </span>
  );
};

export const CNCodeTag: React.FC<{
  code: string;
  className?: string;
}> = ({ code, className = '' }) => {
  return (
    <span
      className={`inline-flex items-center gap-1 font-mono text-xs px-2 py-0.5 rounded-md bg-surface-2 border border-border text-text-muted ${className}`}
      title={`EU CN Code: ${code}`}
    >
      <span className="text-xs text-text-muted/70 font-semibold">CN</span>
      <span className="text-text font-bold">{code}</span>
    </span>
  );
};
