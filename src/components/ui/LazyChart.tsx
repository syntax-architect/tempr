import React, { useState } from 'react';
import { Table, BarChart3 } from 'lucide-react';

export interface ChartDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
  unit?: string;
  category?: string;
}

export interface LazyChartProps {
  title: string;
  description?: string;
  textSummary: string;
  data: ChartDataPoint[];
  primaryLabel?: string;
  secondaryLabel?: string;
  unit?: string;
  className?: string;
}

export const LazyChart: React.FC<LazyChartProps> = ({
  title,
  description,
  textSummary,
  data,
  primaryLabel = 'Primary Value',
  secondaryLabel = 'Benchmark',
  unit = '',
  className = '',
}) => {
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');

  const maxValue = Math.max(...data.map((d) => Math.max(d.value, d.secondaryValue || 0)), 1);

  return (
    <div
      className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm font-sans text-slate-900 dark:text-slate-100 ${className}`}
      role="region"
      aria-label={title}
    >
      {/* Chart Header with Accessible Table Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
          )}
        </div>

        {/* View Toggle: Visual Bar Chart vs Accessible Data Table */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('chart')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
              viewMode === 'chart'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            aria-pressed={viewMode === 'chart'}
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Chart</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            aria-pressed={viewMode === 'table'}
          >
            <Table className="w-3.5 h-3.5 text-sky-500" />
            <span>Data Table</span>
          </button>
        </div>
      </div>

      {/* Required Text Summary (WCAG accessibility requirement) */}
      <div className="py-2.5 px-3 my-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
        <strong className="font-semibold text-slate-900 dark:text-white">Analysis Summary: </strong>
        {textSummary}
      </div>

      {/* Main View: Visual Bars or Accessible Table */}
      {viewMode === 'chart' ? (
        <div className="space-y-3 pt-2">
          {data.map((item, idx) => {
            const pct = Math.round((item.value / maxValue) * 100);
            const secPct = item.secondaryValue
              ? Math.round((item.secondaryValue / maxValue) * 100)
              : 0;

            return (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                    {item.label}
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {item.value} {unit}
                    </span>
                    {item.secondaryValue !== undefined && (
                      <span className="text-slate-400 text-xs">
                        (Ref: {item.secondaryValue} {unit})
                      </span>
                    )}
                  </div>
                </div>

                {/* Accessible Dual Progress Bar */}
                <div className="relative h-4 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center">
                  {/* Secondary Benchmark Bar */}
                  {secPct > 0 && (
                    <div
                      style={{ width: `${secPct}%` }}
                      className="absolute inset-y-0 left-0 bg-slate-300 dark:bg-slate-700 opacity-60 rounded-full"
                      title={`${secondaryLabel}: ${item.secondaryValue} ${unit}`}
                    />
                  )}
                  {/* Primary Measured Bar */}
                  <div
                    style={{ width: `${pct}%` }}
                    className="relative h-full bg-emerald-500 dark:bg-emerald-400 rounded-full transition-all duration-300 shadow-xs"
                    title={`${primaryLabel}: ${item.value} ${unit}`}
                  />
                </div>
              </div>
            );
          })}

          {/* Legend */}
          <div className="flex items-center gap-4 pt-2 text-xs font-mono text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>{primaryLabel}</span>
            </div>
            {data.some((d) => d.secondaryValue !== undefined) && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-400 dark:bg-slate-600" />
                <span>{secondaryLabel}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Accessible HTML Data Table View */
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-xs text-left border-collapse">
            <caption className="sr-only">{title} data table</caption>
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono">
                <th scope="col" className="py-2 pr-4 font-semibold">
                  Category / Period
                </th>
                <th scope="col" className="py-2 px-4 font-semibold text-right">
                  {primaryLabel} ({unit})
                </th>
                {data.some((d) => d.secondaryValue !== undefined) && (
                  <th scope="col" className="py-2 pl-4 font-semibold text-right">
                    {secondaryLabel} ({unit})
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-mono">
              {data.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-2.5 pr-4 text-slate-900 dark:text-white font-medium">
                    {row.label}
                  </td>
                  <td className="py-2.5 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                    {row.value.toLocaleString()} {unit}
                  </td>
                  {row.secondaryValue !== undefined && (
                    <td className="py-2.5 pl-4 text-right text-slate-500 dark:text-slate-400">
                      {row.secondaryValue.toLocaleString()} {unit}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
