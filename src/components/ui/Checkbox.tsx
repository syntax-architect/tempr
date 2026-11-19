import React from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  checked,
  onChange,
  label,
  description,
  error,
  disabled = false,
  className = '',
}) => {
  const checkboxId = id || `hl-checkbox-${Math.random().toString(36).slice(2, 9)}`;

  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <div className={`flex flex-col select-none ${className}`}>
      <div className="flex items-start gap-2.5">
        <button
          id={checkboxId}
          type="button"
          role="checkbox"
          aria-checked={checked}
          aria-label={label || 'Checkbox'}
          disabled={disabled}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          className={`h-5 w-5 shrink-0 rounded-md border flex items-center justify-center transition-all focus-visible-ring cursor-pointer touch-target ${
            disabled ? 'cursor-not-allowed opacity-50' : ''
          } ${
            checked
              ? 'bg-emerald-600 dark:bg-emerald-500 border-emerald-600 dark:border-emerald-500 text-white'
              : error
                ? 'border-rose-500 bg-rose-50/20'
                : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-400'
          }`}
        >
          {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {(label || description) && (
          <div className="flex flex-col text-left cursor-pointer" onClick={handleClick}>
            {label && (
              <label
                htmlFor={checkboxId}
                className={`text-xs font-semibold ${
                  disabled ? 'text-slate-400' : 'text-slate-900 dark:text-white'
                }`}
              >
                {label}
              </label>
            )}
            {description && (
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {description}
              </span>
            )}
          </div>
        )}
      </div>

      {error && <span className="text-xs text-rose-500 mt-1 pl-7">{error}</span>}
    </div>
  );
};
