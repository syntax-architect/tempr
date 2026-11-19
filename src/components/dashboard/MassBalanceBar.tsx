import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export interface MassBalanceBarProps {
  receivedKg: number;
  shippedKg: number;
  allocatedKg?: number;
  scrapKg?: number;
  remainingKg: number;
  unit?: 'MT' | 'kg';
  showLegend?: boolean;
  className?: string;
}

export const MassBalanceBar: React.FC<MassBalanceBarProps> = ({
  receivedKg,
  shippedKg,
  allocatedKg = 0,
  scrapKg = 0,
  remainingKg,
  unit = 'MT',
  showLegend = true,
  className = '',
}) => {
  const isOverAllocated = remainingKg < -0.001;
  const divisor = unit === 'MT' ? 1000 : 1;
  const unitLabel = unit === 'MT' ? 'MT' : 'kg';

  const receivedDisplay = (receivedKg / divisor).toFixed(1);
  const shippedDisplay = (shippedKg / divisor).toFixed(1);
  const allocatedDisplay = (allocatedKg / divisor).toFixed(1);
  const scrapDisplay = (scrapKg / divisor).toFixed(1);
  const remainingDisplay = (remainingKg / divisor).toFixed(1);

  // Calculate percentages relative to received
  const total = receivedKg > 0 ? receivedKg : 1;
  const shippedPct = Math.min(100, Math.max(0, (shippedKg / total) * 100));
  const allocatedPct = Math.min(100 - shippedPct, Math.max(0, (allocatedKg / total) * 100));
  const scrapPct = Math.min(
    100 - (shippedPct + allocatedPct),
    Math.max(0, (scrapKg / total) * 100)
  );
  const remainingPct = Math.max(0, 100 - (shippedPct + allocatedPct + scrapPct));

  return (
    <div className={`space-y-2 w-full text-left ${className}`}>
      {/* Numbers Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="text-text-muted">
            Total:{' '}
            <strong className="text-text">
              {receivedDisplay} {unitLabel}
            </strong>
          </span>
          <span className="text-text-muted">
            Remaining:{' '}
            <strong
              className={isOverAllocated ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}
            >
              {remainingDisplay} {unitLabel}
            </strong>
          </span>
        </div>

        {isOverAllocated ? (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5" />
            OVER-ALLOCATED: {remainingDisplay} {unitLabel}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-emerald-400 text-xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Conserved</span>
          </span>
        )}
      </div>

      {/* Stacked Progress Bar */}
      <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
        {shippedPct > 0 && (
          <div
            style={{ width: `${shippedPct}%` }}
            className="bg-blue-500 transition-all duration-300"
            title={`Shipped: ${shippedDisplay} ${unitLabel} (${shippedPct.toFixed(0)}%)`}
          />
        )}
        {allocatedPct > 0 && (
          <div
            style={{ width: `${allocatedPct}%` }}
            className="bg-amber-500 transition-all duration-300"
            title={`Allocated: ${allocatedDisplay} ${unitLabel} (${allocatedPct.toFixed(0)}%)`}
          />
        )}
        {scrapPct > 0 && (
          <div
            style={{ width: `${scrapPct}%` }}
            className="bg-rose-500/80 transition-all duration-300"
            title={`Scrap: ${scrapDisplay} ${unitLabel} (${scrapPct.toFixed(0)}%)`}
          />
        )}
        {remainingPct > 0 && !isOverAllocated && (
          <div
            style={{ width: `${remainingPct}%` }}
            className="bg-emerald-500 transition-all duration-300"
            title={`Remaining: ${remainingDisplay} ${unitLabel} (${remainingPct.toFixed(0)}%)`}
          />
        )}
        {isOverAllocated && (
          <div
            style={{ width: '100%' }}
            className="bg-rose-600 animate-pulse"
            title="Over-allocated! Quantities exceed batch purchase."
          />
        )}
      </div>

      {/* Legend & Details */}
      {showLegend && (
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-text-muted pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
            <span>Shipped: {shippedDisplay}</span>
          </div>
          {allocatedKg > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
              <span>Allocated: {allocatedDisplay}</span>
            </div>
          )}
          {scrapKg > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500/80" />
              <span>Scrap: {scrapDisplay}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2.5 h-2.5 rounded-sm ${isOverAllocated ? 'bg-rose-600' : 'bg-emerald-500'}`}
            />
            <span>Available: {remainingDisplay}</span>
          </div>
        </div>
      )}
    </div>
  );
};
