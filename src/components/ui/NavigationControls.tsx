import React from 'react';
import { Check } from 'lucide-react';
import { haptics } from '../../lib/motion';

export interface StepItem {
  id: string | number;
  label: string;
  description?: string;
}

export interface StepperProps {
  steps: StepItem[];
  activeStep: number; // 0-indexed
  onStepClick?: (stepIndex: number) => void;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  activeStep,
  onStepClick,
  className = '',
}) => {
  return (
    <div
      className={`w-full flex items-center justify-between gap-2 overflow-x-auto py-2 ${className}`}
    >
      {steps.map((step, idx) => {
        const isComplete = idx < activeStep;
        const isCurrent = idx === activeStep;
        const isPending = idx > activeStep;

        return (
          <React.Fragment key={step.id}>
            <div
              onClick={() => onStepClick && onStepClick(idx)}
              className={`flex items-center gap-2.5 shrink-0 ${
                onStepClick ? 'cursor-pointer select-none' : ''
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                  isComplete
                    ? 'bg-emerald-500 text-black'
                    : isCurrent
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/60 ring-2 ring-emerald-500/20'
                      : 'bg-surface-2 text-text-muted border border-border'
                }`}
              >
                {isComplete ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
              </div>
              <div className="flex flex-col text-left">
                <span
                  className={`text-xs font-semibold ${
                    isCurrent ? 'text-text' : isComplete ? 'text-emerald-400' : 'text-text-muted'
                  }`}
                >
                  {step.label}
                </span>
                {step.description && (
                  <span className="text-xs text-text-muted hidden sm:inline">
                    {step.description}
                  </span>
                )}
              </div>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 min-w-[16px] transition-colors ${
                  idx < activeStep ? 'bg-emerald-500' : 'bg-border'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export interface SegmentedControlOption<T extends string = string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  size?: 'sm' | 'md';
}

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  className = '',
  size = 'md',
}: SegmentedControlProps<T>) {
  const sizeClasses = size === 'sm' ? 'p-0.5 text-xs' : 'p-1 text-sm';
  const itemSizeClasses = size === 'sm' ? 'py-1 px-2.5 min-h-[32px]' : 'py-1.5 px-3.5 min-h-[40px]';

  return (
    <div
      role="tablist"
      className={`inline-flex items-center rounded-xl bg-surface-2 border border-border ${sizeClasses} ${className}`}
    >
      {options.map((opt) => {
        const isSelected = opt.value === value;
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={isSelected}
            onClick={() => {
              haptics.tap();
              onChange(opt.value);
            }}
            className={`flex items-center justify-center gap-1.5 rounded-lg font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${itemSizeClasses} ${
              isSelected
                ? 'bg-surface text-text shadow-sm border border-border/80 font-semibold'
                : 'text-text-muted hover:text-text hover:bg-surface/50'
            }`}
          >
            {opt.icon && <span className="shrink-0">{opt.icon}</span>}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
