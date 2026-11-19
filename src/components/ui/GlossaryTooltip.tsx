import React, { useState } from 'react';
import { HelpCircle, Info, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export type GlossaryTermKey = 'heat_number' | 'melt_pour' | 'cn_code' | 'cbam' | 'mtc_31';

export interface GlossaryTooltipProps {
  term: GlossaryTermKey;
  children?: React.ReactNode;
  iconOnly?: boolean;
}

export const GlossaryTooltip: React.FC<GlossaryTooltipProps> = ({
  term,
  children,
  iconOnly = false,
}) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  const title = t(`glossary.${term}_title`);
  const desc = t(`glossary.${term}_desc`);

  return (
    <span
      className="relative inline-flex items-center gap-1 group cursor-help"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      tabIndex={0}
      role="button"
      aria-label={`Glossary definition for ${title}`}
      aria-expanded={isVisible}
    >
      {children && <span className="underline decoration-dotted decoration-slate-400 underline-offset-2">{children}</span>}

      <HelpCircle className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 transition-colors shrink-0" />

      {isVisible && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl text-left z-50 pointer-events-none animate-in fade-in duration-150"
        >
          <span className="flex items-center gap-1.5 text-xs font-bold font-mono text-emerald-400 mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{title}</span>
          </span>
          <span className="text-xs text-slate-200 leading-relaxed block font-sans">
            {desc}
          </span>
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </span>
      )}
    </span>
  );
};
