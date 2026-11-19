import React, { useEffect } from 'react';
import { X, Filter, Check } from 'lucide-react';
import { Button } from '../ui/Button';

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

export interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  statusOptions: FilterOption[];
  selectedStatus: string;
  onSelectStatus: (statusId: string) => void;
  sortOptions?: FilterOption[];
  selectedSort?: string;
  onSelectSort?: (sortId: string) => void;
  onReset?: () => void;
  activeCount?: number;
}

export const FilterBottomSheet: React.FC<FilterBottomSheetProps> = ({
  isOpen,
  onClose,
  title = 'Filters & Sorting',
  statusOptions,
  selectedStatus,
  onSelectStatus,
  sortOptions,
  selectedSort,
  onSelectSort,
  onReset,
  activeCount = 0,
}) => {
  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-obsidian-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Bottom Sheet Drawer */}
      <div className="relative z-10 w-full max-h-[85vh] bg-surface border-t border-border rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Grab Handle */}
        <div className="w-12 h-1.5 bg-border rounded-full mx-auto my-3 shrink-0" />

        {/* Header */}
        <div className="px-5 py-3 border-b border-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-text">{title}</h3>
            {activeCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
                {activeCount} active
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-2 text-text-muted hover:text-text"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-6 text-left">
          {/* Status Filters */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-semibold uppercase tracking-wider text-text-muted">
              Filter by Status
            </label>
            <div className="grid grid-cols-1 gap-2">
              {statusOptions.map((opt) => {
                const isSelected = selectedStatus === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => onSelectStatus(opt.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-mono transition-all text-left ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 font-bold'
                        : 'bg-surface-2/60 border-border text-text hover:bg-surface-2'
                    }`}
                  >
                    <span>{opt.label}</span>
                    <div className="flex items-center gap-2">
                      {opt.count !== undefined && (
                        <span className="text-text-muted text-xs">({opt.count})</span>
                      )}
                      {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort Options */}
          {sortOptions && sortOptions.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-mono font-semibold uppercase tracking-wider text-text-muted">
                Sort By
              </label>
              <div className="grid grid-cols-1 gap-2">
                {sortOptions.map((opt) => {
                  const isSelected = selectedSort === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => onSelectSort && onSelectSort(opt.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs font-mono transition-all text-left ${
                        isSelected
                          ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 font-bold'
                          : 'bg-surface-2/60 border-border text-text hover:bg-surface-2'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border bg-surface-2/30 flex items-center gap-3 shrink-0">
          {onReset && (
            <Button variant="secondary" size="sm" onClick={onReset} className="flex-1">
              Reset
            </Button>
          )}
          <Button variant="primary" size="sm" onClick={onClose} className="flex-1">
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};
