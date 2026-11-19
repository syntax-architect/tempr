import React from 'react';
import { FileText, Lock, ChevronRight, ShieldCheck } from 'lucide-react';
import { RupeeAmount } from './Amounts';

export interface StatTileProps {
  label: string;
  value: string | number;
  delta?: string;
  isPositive?: boolean;
  sparklineData?: number[];
  icon?: React.ReactNode;
  className?: string;
}

export const StatTile: React.FC<StatTileProps> = ({
  label,
  value,
  delta,
  isPositive,
  sparklineData = [12, 18, 14, 22, 28, 25, 32],
  icon,
  className = '',
}) => {
  // Simple SVG sparkline generator
  const min = Math.min(...sparklineData);
  const max = Math.max(...sparklineData);
  const range = max - min || 1;
  const width = 64;
  const height = 24;

  const points = sparklineData
    .map((v, i) => {
      const x = (i / (sparklineData.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div
      className={`p-4 rounded-xl bg-surface border border-border shadow-sm flex flex-col justify-between text-left ${className}`}
    >
      <div className="flex items-center justify-between text-text-muted text-xs font-medium">
        <span>{label}</span>
        {icon && <span className="text-text-muted/80">{icon}</span>}
      </div>

      <div className="flex items-baseline justify-between mt-2">
        <span className="text-2xl font-bold tracking-tight text-text font-mono tabular-nums">
          {value}
        </span>
        {sparklineData.length > 1 && (
          <svg className="w-16 h-6 stroke-emerald-500 fill-none" viewBox={`0 0 ${width} ${height}`}>
            <polyline
              points={points}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {delta && (
        <div className="mt-2 text-xs font-medium flex items-center gap-1">
          <span className={isPositive ? 'text-emerald-400' : 'text-rose-400'}>{delta}</span>
          <span className="text-text-muted">vs last period</span>
        </div>
      )}
    </div>
  );
};

export interface KeyValueItem {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}

export const KeyValueGrid: React.FC<{
  items: KeyValueItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}> = ({ items, columns = 3, className = '' }) => {
  const colClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-4',
  }[columns];

  return (
    <div
      className={`grid ${colClass} gap-3 p-3 rounded-xl bg-surface-2/60 border border-border ${className}`}
    >
      {items.map((item, idx) => (
        <div key={idx} className="flex flex-col text-left">
          <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
            {item.label}
          </span>
          <span
            className={`text-xs font-semibold text-text mt-0.5 ${item.mono ? 'font-mono' : ''}`}
          >
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export const EmptyState: React.FC<{
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}> = ({ icon, title, description, action, className = '' }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-border bg-surface/40 ${className}`}
    >
      {icon && (
        <div className="w-12 h-12 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-text-muted mb-3">
          {icon}
        </div>
      )}
      <h3 className="text-sm font-semibold text-text mb-1">{title}</h3>
      <p className="text-xs text-text-muted max-w-sm mb-4 leading-relaxed">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export const PdfThumbnail: React.FC<{
  fileName: string;
  sizeBytes?: number;
  sha256?: string;
  isImmutable?: boolean;
  className?: string;
  onClick?: () => void;
}> = ({ fileName, sizeBytes, sha256, isImmutable = true, className = '', onClick }) => {
  const sizeMb = sizeBytes ? (sizeBytes / (1024 * 1024)).toFixed(2) : null;

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-xl bg-surface border border-border hover:border-emerald-500/40 transition-all ${
        onClick ? 'cursor-pointer active:scale-[0.99]' : ''
      } ${className}`}
    >
      <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
        <FileText className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-text truncate">{fileName}</span>
          {isImmutable && (
            <span title="SHA-256 Tamper-Locked Write-Once Document">
              <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5 text-xs text-text-muted">
          {sizeMb && <span>{sizeMb} MB</span>}
          {sha256 && (
            <span className="font-mono text-xs truncate max-w-[120px]" title={sha256}>
              {sha256.slice(0, 10)}…
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export interface DataListItem {
  id: string;
  title: string;
  subtitle: string;
  status: React.ReactNode;
  meta: string;
  numeric?: React.ReactNode;
  onClick?: () => void;
}

export const DataList: React.FC<{
  items: DataListItem[];
  className?: string;
}> = ({ items, className = '' }) => {
  return (
    <div
      className={`w-full flex flex-col divide-y divide-border rounded-xl border border-border bg-surface overflow-hidden ${className}`}
    >
      {items.map((item) => (
        <div
          key={item.id}
          onClick={item.onClick}
          className={`flex items-center justify-between p-3.5 hover:bg-surface-2/60 transition-colors ${
            item.onClick ? 'cursor-pointer active:bg-surface-2' : ''
          }`}
        >
          <div className="flex-1 min-w-0 pr-3 text-left">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-text truncate">{item.title}</span>
              {item.status}
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
              <span>{item.subtitle}</span>
              <span>•</span>
              <span>{item.meta}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {item.numeric && <div>{item.numeric}</div>}
            {item.onClick && <ChevronRight className="w-4 h-4 text-text-muted" />}
          </div>
        </div>
      ))}
    </div>
  );
};
